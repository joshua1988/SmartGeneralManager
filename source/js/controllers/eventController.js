var eventApp = angular.module('eventApp', ["ngResource", "720kb.datepicker"]);

eventApp.controller("EventCtrl", ['$scope', '$http', function($scope, $http){

  $scope.balance = 0;
  $scope.deleteWhat = {};

  var refreshExpenseList = function() {
    $http.get('events/expense').success(function(response, data, status, headers, config) {
      // console.log("I got the data I requested ");

      $scope.expenses = response;
    }).error(function(data, status, headers, config) {
      console.log("expense error : ", status);
    });
  };

  var getBalance = function () {
    $http.get('events/balance').success(function(response, data, status, headers, config) {
      console.log("getBalance() : ", response);

      $scope.balance = parseInt(response);
    }).error(function(data, status, headers, config) {
      console.log("expense error : ", status);
    });
  };

  var updateBalance = function () {
    $http.post('events/balance', "130000").success(function(response, data, status, headers, config) {
      console.log("I got the data I requested ");

      $scope.expenses = response;
      console.log("res : ", response);
    }).error(function(data, status, headers, config) {
      console.log("expense error : ", status);
    });
  };

  var countBalance = function (balance, input) {
    return balance + parseInt(input);
  };

  refreshExpenseList();
  getBalance();

  $scope.expenses = [];
  $scope.expenseFormData = {
    expense_date : "",
    birthday_name : "",
    expense_amount : 0,
    expense_balance: 0
  };

  $scope.addExpense = function() {
    $scope.balance = countBalance($scope.balance, -$scope.expenseFormData.expense_amount);
    $scope.expenseFormData.expense_balance = $scope.balance;

    $http.post('events/expense', $scope.expenseFormData).success(function(response, data, status, headers, config) {
      refreshExpenseList();
      $scope.expenseFormData = null;
    }).error(function(data, status, headers, config) {
      console.log("expense error : ", status);
    });
  };

  $scope.removeExpense = function() {
    // console.log("what to delete? ", $scope.deleteWhat);

    $http.post('events/expense/remove', $scope.deleteWhat).success(function(response, data, status, headers, config) {
      console.log("response : ", response);
      refreshExpenseList();
    }).error(function(data, status, headers, config) {
      console.log("expense error : ", status);
    });

    $('#myModal').modal('toggle');
  };

  $scope.keepIndex = function (item) {
    $scope.deleteWhat = $scope.expenses[item];
    console.log($scope.deleteWhat);
  };

  // Deposit Controller
  $scope.deposits = [];
  $scope.depositFormData = {
    sequence : "",
    deposit_list : [],
    deposit_amount : "10000"
  };

  var refreshDepositList = function() {
    $http.get('events/deposit').success(function(response, data, status, headers, config) {
      // console.log("I got the data I requested ");

      $scope.deposits = response;
    }).error(function(data, status, headers, config) {
      console.log("get deposit error : ", status);
    });
  };
  refreshDepositList();

  $scope.addDeposit = function () {
    $scope.balance = countBalance($scope.balance, $scope.depositFormData.deposit_amount);
    console.log("balance after deposit : ", $scope.balance);
    console.log("depositFormData : ", $scope.depositFormData);
    console.log("account_holder : ", $scope.depositFormData.account_holder);
    // $scope.depositFormData.deposit_list.account_holder.push()

    $http.post('events/deposit', $scope.depositFormData).success(function(response, data, status, headers, config) {
      $scope.depositFormData = null;
      refreshDepositList();
    }).error(function(data, status, headers, config) {
      console.log("add deposit error : ", status);
    });
  };

}]);
