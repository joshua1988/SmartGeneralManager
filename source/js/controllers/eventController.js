var eventApp = angular.module('eventApp', ["ngResource", "720kb.datepicker"]);

eventApp.controller("EventCtrl", ['$scope', '$http', function($scope, $http){

  $scope.balance = 0;

  var refreshExpense = function() {
    $http.get('events/deposit').success(function(response, data, status, headers, config) {
      // console.log("I got the data I requested ");

      $scope.days = response;
    }).error(function(data, status, headers, config) {
      console.log("expense error : ", status);
    });
  };

  var countBalance = function (input, balance) {
    // console.log("input : " + input + ". type is :" + typeof input);
    // console.log("balance : " + balance + ". type is :" + typeof balance);
    balance = parseInt(balance);
    input = parseInt(input);
    balance += input;
    return balance;
  };

  var getBalance = function () {
    $http.get('events/balance').success(function(response, data, status, headers, config) {
      // console.log("getBalance() : ", response);

      $scope.balance = response;
    }).error(function(data, status, headers, config) {
      console.log("expense error : ", status);
    });
  };

  var updateBalance = function () {
    $http.post('events/balance').success(function(response, data, status, headers, config) {
      console.log("I got the data I requested ");

      $scope.days = response;
      console.log("res : ", response);
    }).error(function(data, status, headers, config) {
      console.log("expense error : ", status);
    });
  };
  refreshExpense();
  getBalance();

  $scope.expenseFormData = {
    expense_date : "",
    birthday_name : "",
    expense_amount : ""
  };

  $scope.depositFormData = {
    sequence : "1",
    name : "입금자는 박보검",
    amount : "10,000"
  };

  $scope.days = [];

  $scope.submitExpenseForm = function() {
    $http.post('events/deposit', $scope.expenseFormData).success(function(response, data, status, headers, config) {
      // console.log("Data has been posted");

      console.log("countBalance() :" + countBalance($scope.expenseFormData.expense_amount, $scope.balance));
      refreshExpense();
      $scope.expenseFormData = null;
    }).error(function(data, status, headers, config) {
      console.log("expense error : ", status);
    });
  };

  $scope.removeExpense = function(item) {
    console.log($scope.days[item]);

    $http.post('events/deposit/remove', $scope.days[item]).success(function(response, data, status, headers, config) {
      console.log("response : ", response);
      refreshExpense();
    }).error(function(data, status, headers, config) {
      console.log("expense error : ", status);
    });
  };

}]);
