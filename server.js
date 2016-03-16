var express = require('express');
var app = express();
var mongojs = require('mongojs');

var db = mongojs('members', ['members']);
var fooddb = mongojs('foodmenu', ['foodmenu']);
var datedb = mongojs('gatheringdate',['gatheringdate']);
var techsupportdb = mongojs('techsupport', ['contents']);  // mongojs('db name', ['collection name']);

var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.get("/vote", function (req, res){
  console.log("I received a GET request");

  db.members.find(function (err,docs) {
    res.json(docs);
  });
});

app.put('/vote/', function(req, res) {
  // var id = req.params.id;
  var members = req.body.members;
  // var selectedmembers = req.body.selectedmembers;
  // var unselectedmembers = req.body.unselectedmembers;
  // console.log("selectedmembers : "+selectedmembers);
  // console.log("unselectedmembers : "+unselectedmembers);

  var i = 0;
  members.forEach(function(data) {
    i++;
    console.log(" @before update"+i+ " : "+data.selected + ", " +data.name);
    db.members.update(
      { "name" : data.name },
      {$set: {"name" : data.name, "selected" : data.selected}}, function(err, doc){
        // console.log(doc);
      });
  });
  // db.members.update(
  //   { "selectedmembers" : selectedmembers },
  //   {$set: {"selectedmembers" : selectedmembers, "unselectedmembers" : unselectedmembers}}, function(err, doc){
  //     console.log(doc);
  //   });
  console.log(" @after update : ",members);
  // res.json(members, selectedmembers, unselectedmembers);
  res.json(members);
});

app.put('/vote/clear', function(req, res){
  var members = req.body.members;

  db.members.update(
    { "name" : {$nin:[null]} },
    {$set: {selected : false}},
    {multi: true}, function(err, doc){
      // console.log(doc);
    });
  res.json(members);
});

app.put("/date", function (req, res){
  console.log("I received a PUT request for Gathering Date");
  // console.log("request : ", typeof req.body);

  datedb.gatheringdate.update(
      {"name": "setDate"},
      {$set: {"name":"setDate", "date" : req.body}}, function(err, doc){
    });
});

app.get("/date", function(req,res) {
  console.log("I received a GET request for Gathering Date");
  datedb.gatheringdate.find({ "name": "setDate" }, function (err,docs) {
    res.json(docs);
  });
});

// foodmenu
app.get('/foodmenu', function(req, res) {
  // console.log("I received a Food GET request");
  fooddb.foodmenu.find(function (err,docs) {
    res.json(docs);
  });
});

app.post('/foodmenu/', function(req, res) {
  console.log(req.body);
  fooddb.foodmenu.insert(req.body, function(err, docs) {
    res.json("post mehthod sucess : ",docs);
  });
});

app.put('/foodmenu/', function(req, res) {
  console.log(req.body);
  var foodlist = req.body;

  foodlist.forEach(function(data) {
    // console.log(" @before update : "+data.name + ", " + data.checkedNum + ", " +data.count);
    fooddb.foodmenu.update(
      { "name" : data.name },
      {$set: {"name" : data.name, "checkedNum" : data.checkedNum, "count" : data.count}}, function(err, doc){
        // console.log(" i 번째 데이터 : ",doc);
      });
  });
});

app.delete('/foodmenu/', function(req, res) {
  fooddb.foodmenu.remove(function (err,docs) {
      res.json(docs);
  });
});

// tech support service
app.post('/techsupport', function(req, res) {
  console.log(req.body);
  techsupportdb.contents.insert(req.body, function(err, docs) {
    res.json(docs);
  });
});

app.get('/techsupport', function(req, res) {
  console.log("I received a GET request from supports");
  techsupportdb.contents.find(req.body, function(err, docs) {
    res.json(docs);
  });
});

app.put('/techsupport/', function(req, res) {

	var id = { _id: db.ObjectId(req.body.support_id) };

   console.log("DBid DELETE server.js : " , id);

	 techsupportdb.contents.remove( id, function(err, docs){
        if(err){
            console.log("Error to remove" + err);
        }
        else{
            console.log("Removed");
        }
        res.json(docs);
    });
});

app.put('/techsupport/update', function(req, res) {

	var id = {_id: db.ObjectId(req.body.support_id) } ;

	console.log("DBid UPDATE server.js : " , id, req.body);

    techsupportdb.contents.update( id, req.body, function(err, docs){
        if(err){
            console.log("Error to update" + err);
        }
        else{
            console.log("Updated " , id);
        }
        res.json(docs);
    });
});

app.listen(3000);
console.log("Server running on port 3000");
