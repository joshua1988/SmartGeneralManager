var eventApp = angular.module('eventApp', ["ngResource", "720kb.datepicker"]);

eventApp.controller("EventCtrl", ['$scope', '$http', function($scope, $http){

  $scope.balance = 0;
  $scope.deleteWhat = {};

  var refreshExpenseList = function() {
    $http.get('events/expense').success(function(response, data, status, headers, config) {
      // console.log("I got the data I requested ");

      $scope.days = response;
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

      $scope.days = response;
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

  $scope.expenseFormData = {
    expense_date : "",
    birthday_name : "",
    expense_amount : ""
  };

  $scope.days = [];

  $scope.addExpense = function() {
    $http.post('events/expense', $scope.expenseFormData).success(function(response, data, status, headers, config) {
      $scope.balance = countBalance($scope.balance, $scope.expenseFormData.expense_amount);
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
    $scope.deleteWhat = $scope.days[item];
    console.log($scope.deleteWhat);
  };

  // Deposit Controller
  $scope.deposits = [];
  $scope.deposit = {
    sequence : "1",
    account_holder : "입금자는 박보검",
    deposit_amount : "10,000"
  };

  $scope.depositFormData = {
    sequence : "1",
    name : "입금자는 박보검",
    amount : "10,000"
  };



}]);
