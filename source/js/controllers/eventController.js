var eventApp = angular.module('eventApp', ["ngResource", "720kb.datepicker"]);

eventApp.controller("EventCtrl", ['$scope', '$http', function($scope, $http){
  $scope.expenseFormData = {
    birthday_name : "알렉스",
    expense_amount : "10,000"
  };

  $scope.depositFormData = {
    sequence : "1",
    name : "입금자는 박보검",
    amount : "10,000"
  };

  var data1 = {
    "birthday_name" : "A",
    "expense_amount" : "A"
  };
  var data2 = {
    "name" : "C",
    "amount" : "C"
  };
  $scope.days = [data1, data2];

  $scope.submitExpenseForm = function() {
    $http.post('events/deposit', $scope.expenseFormData).success(function(response, data, status, headers, config) {
      // console.log("Data has been posted");

      console.log("post response : ", response);
    }). error(function(data, status, headers, config) {
      console.log("expense error : ", status);
    });
  };

  var refreshExpense = function() {
    $http.get('events/deposit').success(function(response, data, status, headers, config) {
      console.log("I got the data I requested ");

      $scope.days = response;
      console.log("res : ", response);
    }). error(function(data, status, headers, config) {
      console.log("expense error : ", status);
    });
  };
}]);
