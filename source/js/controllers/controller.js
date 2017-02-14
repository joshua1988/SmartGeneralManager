// var myApp = angular.module('myApp', ["ng-fusioncharts", "angular-datepicker", "datatables", "ngResource"]);
var myApp = angular.module('myApp', ["ng-fusioncharts", "angular-datepicker", "ngResource"]);

myApp.controller("AppCtrl", ['$scope', '$http', function($scope, $http){

  var membersNum = 0;

  var refresh = function() {
    // 회식 참석자 명단 get
    $http.get('/vote').success(function(response, data, status, headers, config) {
      // console.log("I got the data I requested ",response.length-1);
      $scope.members = response;
      membersNum = response.length-1;
    }). error(function(data, status, headers, config) {

    });
    // 회식 날짜 get
    $http.get('/date').success(function(response, data, status, headers, config) {
      console.log("I got the data I requested", response[0].date.date);
      $scope.datePicker = response[0].date.date;
    }). error(function(data, status, headers, config) {
      // console.log("I got the data I requested failed ", data);
    });
  };
  refresh();

  $scope.selectedMembers = 0;
  $scope.unselectedMembers = membersNum;

  $scope.$watch('members', function(members){
    var selectedMembers = 0;
    var unselectedMembers = membersNum;
    angular.forEach(members, function(member){
      selectedMembers += member.selected ? 1 : 0;
      unselectedMembers -= member.selected ? 1 : 0;
    });
    $scope.selectedMembers = selectedMembers;
    $scope.unselectedMembers = unselectedMembers;
  }, true);

  $scope.save = function() {
    console.log($scope.members);
    $http.put('/vote/', {members: $scope.members}).success(function(response){
      refresh();
    }).error(function(data, status, headers, config) {
      console.log("error : ", data);
    });
    alert("저장되었습니다");
    // $http.put('/vote/', {members: $scope.members,
    //   selectedmembers : $scope.selectedMembers,
    //   unselectedmembers : $scope.unselectedMembers}).success(function(response){
    //   refresh();
    // }).error(function(data, status, headers, config) {
    //   console.log("error : ", data);
    // });
  };

  $scope.clear = function() {
    $http.put('/vote/clear', {members: $scope.members}).success(function(response){
      refresh();
      alert("리셋되었습니다");
    }).error(function(data, status, headers, config) {
      console.log("error : ", data);
    });
  };

  $scope.fields = [];
  var count = 0;

  var refreshFood = function() {
    $http.get('/foodmenu').success(function(response, data, status, headers, config) {
      // console.log("I got the data I requested ",response);
      $scope.fields = response;
    }). error(function(data, status, headers, config) {
      console.log("refreshFood error");
    });
  };

  refreshFood();

  $scope.addFoodMenu = function() {
    // console.log($("#foodmenu").val());
    if($("#foodmenu").val() !== ""){
      count++;

      $scope.field = {
        name: $scope.foodname,
        checkedNum: 0,
        count: count
      };

      $http.post("/foodmenu/", $scope.field).success(function(response){
        console.log("post success :", response);
      }).error(function(data, status, headers, config) {
        console.log("post error : ", data);
      });

      refreshFood();
      $("#foodmenu").val("");
    } else {
      alert("메뉴를 입력하세요");
    }
    // console.log("fields.name : ",$scope.fields);
  };

  $scope.saveList = function() {
    if($scope.fields.length !== 0){
      $http.put("/foodmenu/", $scope.fields).success(function(response) {
        console.log(response);
      }).error(function(data, status, headers, config) {
        console.log("error : ", data);
      });
      alert("소중한 의견 감사합니다.");
      refreshFood();
    } else {
      alert("메뉴가 아직 없습니다");
    }
  };

  $scope.resetList = function() {
    $http.delete("/foodmenu/").success(function(response){
      console.log(response);
    });
    refreshFood();
    alert("메뉴 전체가 리셋되었습니다.");
  };

  $scope.myDataSource = {
    chart: {
      caption: "회식 참석현황",
      subcaption: "2015.09.17",
      paletteColors: "#0075c2,#f45b00",
      startingangle: "120",
      showlabels: "0",
      showlegend: "1",
      enablemultislicing: "0",
      slicingdistance: "15",
      showpercentvalues: "0",
      showpercentintooltip: "0",
      // plottooltext: "Age group : $label Total visit : $datavalue",
      plottooltext: "$label",
      theme: "ocean",
      baseFontSize : 15,
      baseFont: "Italics"
    },
    data: [
      {
        label: "참석자",
        value: 0
      },
      {
        label: "불참석자",
        value: 13
      }
    ]
  };

  $scope.dataSource = {
    chart: {
      caption: "금주의 추천 메뉴",
      subCaption: "여러분들의 소중한 의견으로 구성되었습니다",
      // numberPrefix: "$",
      theme: "ocean",
      baseFontSize : 10,
    },
    data:[{
      label: "삼겹살",
      value: "5"
    },
    {
      label: "불고기",
      value: "1"
    },
    {
      label: "육회",
      value: "1"
    },
    {
      label: "양꼬치 & 칭따오",
      value: "2"
    },
    {
      label: "",
      value: null
    }]
  };

  $scope.updateMyChartData = function () {
    // For the attendees
    $scope.myDataSource.data[0].value = $scope.selectedMembers;
    $scope.myDataSource.data[1].value = $scope.unselectedMembers;

    // For the favorite menu
    var data = $scope.fields;
    var x;
    for (x in data){
      // console.log(data[x].name, data[x].checkedNum);
      // console.log(x);
      $scope.dataSource.data[x].value = data[x].checkedNum;
      $scope.dataSource.data[x].label = data[x].name;
    }
  };

  $scope.chatcontents = [];

  $scope.typeChatting = function () {
    console.log("typed something");
    $scope.chatcontent = {
      content: $scope.chatInput,
      user: "장기효"
    };
    $scope.chatcontents.push($scope.chatcontent);
    console.log($scope.chatcontent);
    $scope.chatInput = "";
  };


}]);

myApp.directive('foodDisplay', function($compile) {
  return {
    scope: false,
    templateUrl: 'public/assets/foodmenu.html',
    link: function(scope, element, attrs) {

      scope.change = function() {
        // console.log(scope.confirmed);
        // console.log(scope.fields);
        // console.log(this.field);
        if (scope.confirmed === true){
          this.field.checkedNum+=1;
        } else {
          this.field.checkedNum-=1;
        }
      };

    }
  };

});

// myApp.directive('chatlog', function($compile) {
//   return {
//     scope: false,
//     templateUrl: 'chatformat.html',
//     link: function(scope, element, attrs) {
//
//     }
//   };
//
// });

myApp.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.ngEnter);
        });

        event.preventDefault();
      }
    });
  };
});

myApp.directive("datepicker", ["$http", function ($http) {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, elem, attrs, ngModelCtrl) {

      var updateModel = function (dateText) {
        scope.$apply(function () {
          ngModelCtrl.$setViewValue(dateText);
        });
      };

      var options = {
        dateFormat: "yy/mm/dd",
        onSelect: function (dateText) {

          // console.log(dateText);
          var date = {
            "date" : dateText
          };

          // 회식 날짜 선정을 위한 post 요청
          // $http.put('/date', date).success(function(response, data, status, headers, config) {
          //   console.log("put response : ",response);
          // }). error(function(data, status, headers, config) {
          //   console.log(data);
          // });
        }
      };
      elem.datepicker(options);
    }
  };
}]);
