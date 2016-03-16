myApp.controller('WhopperCtrl', ['$scope', '$http', 'DTOptionsBuilder','$resource', function($scope, $http, DTOptionsBuilder, $resource){
  // var wc = this;
  //
  // wc.supportContentList = {};
  // wc.formData = {
  //   "support_id" : null,
  //   "support_startdate" : null,
  //   "support_duedate" : null,
  //   "questioner" : null,
  //   "status" : null,
  //   "project_type" : null,
  //   "project_target": null,
  //   "solution_type" : null,
  //   "gluepd" : null,
  //   "sop" : null,
  //   "content_level" : null,
  //   "support_content" : null
  // };
  //
  // wc.dtOptions = DTOptionsBuilder.newOptions()
  //     .withOption('autoWidth','responsive',true);
  //
  // $resource('/techsupport').query().$promise.then(function(data) {
  //         wc.supportContentList = data;
  //         console.log(wc.supportContentList);
  //     });

  // wc.dtOptions = {
  //         'fnRowCallback': function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
  //             console.log(aData);
  //             return nRow;
  //         }
  //     }

  $scope.initDataTable

  var supportListRefresh = function() {
    $http.get('/techsupport').success(function(response, data, status, headers, config) {
      $scope.supportContentList = response;
      // console.log(" $scope.supportContentList : ",$scope.supportContentList);
    }). error(function(data, status, headers, config) {
      console.log("supportListRefresh get failed ",data);
    });
  };

  supportListRefresh();

  $scope.supportSubmit = function() {
    $scope.formData.support_startdate = $("#support_startdate").val();
    $scope.formData.support_duedate = $("#support_duedate").val();
    $scope.formData.questioner = $("#questioner").val();
    $scope.formData.status = $("#status").html();
    $scope.formData.project_type = $("#project_type").html();
    $scope.formData.project_target = $("#project_target").html();
    $scope.formData.solution_type = $("#solution_type").html();
    $scope.formData.gluepd = $("#gluepd").html();
    $scope.formData.sop = $("#sop").html();
    $scope.formData.content_level = $("#content_level").html();
    $scope.formData.support_content = $("#support_content").val();
    // $scope model이 어떤 이유에서인지 먹지 않음 --> 아마 아래 directive에 연관된 scope에 의해서, 바인딩이 제대로 이루어지지 않는 것으로 추정
    // console.log($scope.formData.support_startdate);
    // console.log($scope.formData.support_duedate);

    // console.log(support_startdate +"\n"+ support_duedate +"\n" + questioner + "\n" + status + "\n" +project_type + "\n" +solution_type + "\n" +gluepd + "\n" +sop + "\n" +content_level + "\n" +support_content + "\n");

    $http.post('/techsupport', $scope.formData).success(function(response, data, status, headers, config) {
      console.log("post response : ", response);
    }). error(function(data, status, headers, config) {
      console.log("post failed ", data);
    });

    $("#support_content").val("");
    supportListRefresh();
  };

  $scope.supportSearch = function() {
    console.log("---------------- SEARCH ------------------ ");
    $http.get('/techsupport').success(function(response, data, status, headers, config) {
      $scope.supportContentList = response;
    }). error(function(data, status, headers, config) {
    });
  };

  $scope.setSelected = function() {
    $scope.selected = this.support;
    console.log($scope.selected);
    $("#support_id").val($scope.selected._id) ;

    $("#support_startdate").val($scope.selected.support_startdate);
    $("#support_duedate").val($scope.selected.support_duedate);
    $("#questioner").val($scope.selected.questioner );
    $("#status").val($scope.selected.status);
    $("#project_type").val($scope.selected.project_type)
    $("#project_target").val($scope.selected.project_target);
    $("#solution_type").val($scope.selected.solution_type);
    $("#gluepd").val($scope.selected.gluepd);
    $("#sop").val($scope.selected.sop);
    $("#content_level").val($scope.selected.content_level);
    $("#support_content").val($scope.selected.support_content);

    var id2 = $("#support_id").val();
    console.log("form Id" , id2 );
  };

  $scope.supportDelete= function() {
    $scope.formData.support_id = $("#support_id").val();
    console.log("onDelete DBid" , $scope.formData.support_id );
    $http.put('/techsupport',$scope.formData).success(function(response, data, status, headers, config) {
      console.log("supportListDelete success ");
      supportListRefresh();
    }). error(function(data, status, headers, config) {
      console.log("supportListDelete get failed ",data);
    });
  }

  $scope.supportUpdate= function() {
    $scope.formData.support_id = $("#support_id").val();
    $scope.formData.support_startdate = $("#support_startdate").val();
    $scope.formData.support_duedate = $("#support_duedate").val();
    $scope.formData.questioner = $("#questioner").val();
    $scope.formData.status = $("#status").html();
    $scope.formData.project_type = $("#project_type").html();
    $scope.formData.project_target = $("#project_target").html();
    $scope.formData.solution_type = $("#solution_type").html();
    $scope.formData.gluepd = $("#gluepd").html();
    $scope.formData.sop = $("#sop").html();
    $scope.formData.content_level = $("#content_level").html();
    $scope.formData.support_content = $("#support_content").val();

    console.log("onUpdate DBid" , $scope.formData.support_id );

    $http.put('/techsupport/update',$scope.formData).success(function(response, data, status, headers, config) {
      supportListRefresh();
      console.log("supportUpdate success ");
    }). error(function(data, status, headers, config) {
      console.log("supportUpdate get failed ",data);
    });
  }

}]);
