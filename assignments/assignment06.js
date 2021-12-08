// --- global variables ---

var loans = [
  { loan_year: 2020, loan_amount: 10000.00, loan_int_rate: 0.0453 },
  { loan_year: 2021, loan_amount: 10000.00, loan_int_rate: 0.0453 },
  { loan_year: 2022, loan_amount: 10000.00, loan_int_rate: 0.0453 },
  { loan_year: 2023, loan_amount: 10000.00, loan_int_rate: 0.0453 },
  { loan_year: 2024, loan_amount: 10000.00, loan_int_rate: 0.0453 }
]; 

let loanWithInterest = 0;
let int = 0;
let payments;
// --- function: loadDoc() ---

function loadDoc() {
  
  // pre-fill defaults for first loan year
  var defaultYear = loans[0].loan_year;
  // console.log(defaultYear) // debug: defaultYear starts at 2020
  // document.getElementById("loan_year0" + 1).value = defaultYear++; // js
  $("#loan_year01").val(defaultYear++); // jquery
  // console.log(defaultYear) // debug: defaultYear increments
  var defaultLoanAmount = loans[0].loan_amount; $("#loan_amt01").val(defaultLoanAmount.toFixed(2));
  //changing all the html to jquery
  var defaultInterestRate = loans[0].loan_int_rate;
  $("#loan_int01").val(defaultInterestRate);
  
  var loanWithInterest 
  = loans[0].loan_amount * (1 + loans[0].loan_int_rate); $("#loan_bal01").text(toComma(loanWithInterest.toFixed(2)));
  
  // pre-fill defaults for other loan years
  for(var i=2; i<6; i++) {
    document.getElementById("loan_year0" + i).value 
      = defaultYear++;
    document.getElementById("loan_year0" + i).disabled 
      = true;
    document.getElementById("loan_year0" + i).style.backgroundColor 
      = "gray";
    document.getElementById("loan_year0" + i).style.color 
      = "white";
    document.getElementById("loan_amt0" + i).value 
      = defaultLoanAmount.toFixed(2);
    document.getElementById("loan_int0" + i).value 
      = defaultInterestRate;
    document.getElementById("loan_int0" + i).disabled 
      = true;
    document.getElementById("loan_int0" + i).style.backgroundColor 
      = "gray";
    document.getElementById("loan_int0" + i).style.color 
      = "white";
   loanWithInterest 
     = (loanWithInterest + defaultLoanAmount) 
     * (1 + defaultInterestRate);
   document.getElementById("loan_bal0" + i).innerHTML 
     = toComma(loanWithInterest.toFixed(2));
    } // end: "for" loop
  
  // all input fields: select contents on focus (jquery) 
  $("input[type=text]").focus(function() {
    $(this).select();
    $(this).css("background-color", "yellow");
  }); 
  $("input[type=text]").blur(function() {
    $(this).css("background-color", "white");
  });
  
  // set focus to first year: messes up codepen
  // $("#loan_year01").focus();
  // update loans array when exiting "year" input field (jquery)
  
  //changed to blur on any text change
   $("input[type=text]").blur(function() {
   updateLoansArray();
  });
} // end: function loadDoc()


function toComma(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//////////////////////////////////////////
//function updateLoansArray, updateForm, toMoney, and Angular are from https://codepen.io/gpcorser/pen/pogEQJw
//As06, Qz07, jQuery, Angular, collegeDebtEstimator - George Corser
//////////////////////////////////////////////


function updateLoansArray() {
  
  
  // regex tester web site: https://www.regexpal.com/
  let yearP = /^(19|20)\d{2}$/;
  let amtP = /^([1-9][0-9]*)+(.[0-9]{1,2})?$/;
  let intP = /^(0|)+(.[0-9]{1,5})?$/;

  let valid = true;
  if(!yearP.test($(`#loan_year01`).val())){
    valid = false;
    $(`#loan_year01`).css("background-color", "red");
  }
  for (i = 1; i < 6; i++) {
    if(!amtP.test($(`#loan_amt0${i}`).val())) {
      valid = false;
      $(`#loan_amt0${i}`).css("background-color", "red");
    } 
  }
  if(!intP.test($(`#loan_int01`).val())) {
    valid = false;
    $(`#loan_int01`).css("background-color", "red");
  }

  if(valid) {
    loans[0].loan_year = parseInt($("#loan_year01").val());
    for(var i=1; i<5; i++) {
      loans[i].loan_year = loans[0].loan_year + i;
    }
    for(i = 1; i<6; i++){
      let amt = parseFloat($(`#loan_amt0${i}`).val()).toFixed(2);
      loans[i-1].loan_amount = amt;
    }
    let rate = parseFloat($("#loan_int01").val());
    for(i=0; i<5; i++){
      loans[i].loan_int_rate = rate;
    }
    
    updateForm();
    
  } // end: if
  
}


let updateForm = () => {
  loanWithInterest = 0;
  let totalAmt = 0;
  for(i = 1; i < 6; i++) {
    $(`#loan_year0${i}`).val(loans[i - 1].loan_year);
    let amt = loans[i - 1].loan_amount;
    $(`#loan_amt0${i}`).val(amt);
    totalAmt += parseFloat(amt);
    $(`#loan_int0${i}`).val(loans[i - 1].loan_int_rate);
    loanWithInterest 
      = (loanWithInterest + parseFloat(amt)) 
      * (1 + loans[0].loan_int_rate);
    $("#loan_bal0" + i).text(toMoney(loanWithInterest));
  }
  int = loanWithInterest - totalAmt;
  $(`#loan_int_accrued`).text(toMoney(int));
  
}



let toMoney = (value) => {  return `\$${toComma(value.toFixed(2))}`;} 

//save the current form
function SAVE(){
localStorage.setItem(`Current`, JSON.stringify(loans));
}

function LOAD(){
 loans = JSON.parse(localStorage.getItem(`Current`));
     updateForm();
}




var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope) {
  //setting up the scope for the angular
  $scope.payments = [];
  //changing the payments table to be updated with 
  $scope.populate = function () {
    
    updateForm();
    
    let total = loanWithInterest;
    let iRate = loans[0].loan_int_rate;
    let r = iRate / 12;
    let n = 11;
    //loan payment formula
    //https://www.thebalance.com/loan-payment-calculations-315564
    let pay = 12 * (total / ((((1+r)**(n*12))-1)/(r *(1+r)**(n*12))));
    for (let i = 0; i < 10; i++) {
      total -= pay 
      let int = total * (iRate); 
      $scope.payments[i] = {
        "year":loans[4].loan_year + i + 1,
        "payment": toMoney(pay), 
        "amt": toMoney(int),
        "ye": toMoney(total += int)
      }
    }
    $scope.payments[10] = {
      "year":loans[4].loan_year + 11,
      "payment": toMoney(total),
      "amt": toMoney(0),
      "ye":toMoney(0)
    }
  }
});
