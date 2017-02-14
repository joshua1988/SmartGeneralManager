// myApp.controller('WhopperCtrl', ['$scope', '$http', 'DTOptionsBuilder','$resource', function($scope, $http, DTOptionsBuilder, $resource){
myApp.controller('WhopperCtrl', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

  var wc = this;

  $scope.supportContentList = {};
  $scope.formData = {
    "support_id": null,
    "support_startdate": null,
    "support_duedate": null,
    "support_workbegin": null,
    "support_workend": null,
    "questioner": null,
    "status": null,
    "project_type": null,
    "project_target": null,
    "solution_version": null,
    "gluepd": null,
    "sop": null,
    "content_level": null,
    "support_content": null
  };

  // @@ Directive 랑 한 쌍
  // $scope.initDataTable = function() {
  //       // $("#noCampaignData").hide();
  //       console.log("hi1");
  //       $("#example").dataTable({
  //
  //       });
  //       console.log("hi2");
  // };

  var table = "";
  var initDataTable = function() {
    $timeout(function() {
      var rowCount = $("#example tr").length - 1;
      console.log("Row count value is " + rowCount);
      if (rowCount >= 0) {
        console.log("Entered into Sorting");
        $('#example').show();
        table = $('#example').DataTable({
          "order": [[0, 'desc']],
          "retrieve": true,
          // B letter means Buttons of extension I have added
          // dom: 'Bfrtip',
          dom: "<'row'<'col-sm-4'l><'col-sm-4'B><'col-sm-4'f>>R" +
          		"<'row'<'col-sm-12'tr>>" +
          		"<'row'<'col-sm-5'i><'col-sm-7'p>>",
          buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print',
          ],
        });
        console.log(table);
        // Rerendering
        // dataTable.fnDraw();
      }
    }, 200);
  };
  initDataTable();

  var reloadDataTable = function() {
    // console.log(table);
    // table.rows().remove().draw();
    table.destroy();
    $('#example').hide();
  };

  var supportListRefresh = function() {
    $http.get('/techsupport').success(function(response, data, status, headers, config) {
      $scope.supportContentList = response;
      // console.log(" $scope.supportContentList : ",$scope.supportContentList);
    }).error(function(data, status, headers, config) {
      console.log("supportListRefresh get failed ", data);
    });
  };
  supportListRefresh();

  $scope.supportSubmit = function() {
    $scope.formData.support_startdate = $("#support_startdate").val();
    $scope.formData.support_duedate = $("#support_duedate").val();
    $scope.formData.support_workbegin = $("#support_workbegin").val();
    $scope.formData.support_workend = $("#support_workend").val();
    $scope.formData.questioner = $("#questioner").val();
    $scope.formData.status = $("#status").val();
    $scope.formData.project_type = $("#project_type").val(); //
    $scope.formData.project_target = $("#project_target").val();
    $scope.formData.solution_version = $("#solution_version").val(); //
    $scope.formData.gluepd = $("#gluepd").val(); //
    $scope.formData.sop = $("#sop").val();
    $scope.formData.content_level = $("#content_level").val();
    $scope.formData.support_content = $("#support_content").val();
    // $scope model이 어떤 이유에서인지 먹지 않음 --> 아마 아래 directive에 연관된 scope에 의해서, 바인딩이 제대로 이루어지지 않는 것으로 추정
    // console.log($scope.formData.support_startdate);
    // console.log($scope.formData.support_duedate);

    // console.log(support_startdate +"\n"+ support_duedate +"\n" + questioner + "\n" + status + "\n" +project_type + "\n" +solution_version + "\n" +gluepd + "\n" +sop + "\n" +content_level + "\n" +support_content + "\n");

    $http.post('/techsupport', $scope.formData).success(function(response, data, status, headers, config) {
      // console.log("post response : ", response);
    }).error(function(data, status, headers, config) {
      console.log("post failed ", data);
    });

    $("#support_content").val("");
    supportListRefresh();
    reloadDataTable();
    initDataTable();
  };

  $scope.supportSearch = function() {
    console.log("---------------- SEARCH ------------------ ");
    $http.get('/techsupport').success(function(response, data, status, headers, config) {
      $scope.supportContentList = response;
    }).error(function(data, status, headers, config) {});
  };

  $scope.setSelected = function() {
    $scope.selected = this.support;
    $("#support_id").val($scope.selected._id);
    $("#support_startdate").val($scope.selected.support_startdate);
    $("#support_duedate").val($scope.selected.support_duedate);
    $("#support_workbegin").val($scope.selected.support_workbegin);
    $("#support_workend").val($scope.selected.support_workend);
    $("#questioner").val($scope.selected.questioner).trigger("change");
    $("#status").val($scope.selected.status).trigger("change");
    $("#project_type").val($scope.selected.project_type).trigger("change");
    $("#project_target").val($scope.selected.project_target).trigger("change");
    $("#solution_version").val($scope.selected.solution_version).trigger("change");
    $("#gluepd").val($scope.selected.gluepd).trigger("change");
    $("#sop").val($scope.selected.sop).trigger("change");
    $("#content_level").val($scope.selected.content_level).trigger("change");
    $("#support_content").val($scope.selected.support_content);

    var id2 = $("#support_id").val();
    // console.log("form Id" , id2 );
  };

  $scope.supportDelete = function() {
    $scope.formData.support_id = $("#support_id").val();
    // console.log("onDelete DBid" , $scope.formData.support_id );
    $http.put('/techsupport', $scope.formData).success(function(response, data, status, headers, config) {
      // console.log("supportListDelete success ");
      supportListRefresh();
      reloadDataTable();
      initDataTable();
    }).error(function(data, status, headers, config) {
      console.log("supportListDelete get failed ", data);
    });
  };

  $scope.supportUpdate = function() {
    $scope.formData.support_id = $("#support_id").val();
    $scope.formData.support_startdate = $("#support_startdate").val();
    $scope.formData.support_duedate = $("#support_duedate").val();
    $scope.formData.support_workbegin = $("#support_workbegin").val();
    $scope.formData.support_workend = $("#support_workend").val();
    $scope.formData.questioner = $("#questioner").val();
    $scope.formData.status = $("#status").val();
    $scope.formData.project_type = $("#project_type").val();
    $scope.formData.project_target = $("#project_target").val();
    $scope.formData.solution_version = $("#solution_version").val();
    $scope.formData.gluepd = $("#gluepd").val();
    $scope.formData.sop = $("#sop").val();
    $scope.formData.content_level = $("#content_level").val();
    $scope.formData.support_content = $("#support_content").val();

    $http.put('/techsupport/update', $scope.formData).success(function(response, data, status, headers, config) {
      supportListRefresh();
      reloadDataTable();
      initDataTable();
      // alert("수정되었습니다");
    }).error(function(data, status, headers, config) {
      console.log("supportUpdate get failed ", data);
    });
  };

  $scope.selectedRow = null;  //table row coloring
  $scope.setClickedRow = function(index){
    $scope.selectedRow = index;
  }

}]);

// myApp.directive('repeatDone', function() {
//     return function(scope, element, attrs) {
//         console.log("repeatDone executed");
//         if (scope.$last) { // all are rendered
//             scope.$eval(attrs.repeatDone);
//             console.log(attrs.repeatDone);
//             scope.initDataTable();
//         }
//     }
// });
