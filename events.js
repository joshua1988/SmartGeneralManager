var express = require('express');
var router = express.Router();

// DB
var mongojs = require('mongojs');
var ObjectId = require('mongojs').ObjectId;
var expense = mongojs('birthday', ['expenseDB']);
var deposit = mongojs('birthday', ['depositDB']);
var balance = mongojs('birthday', ['balanceDB']);

router.get('/', function(req, res, next) {
    res.render('event.html');
});

router.get("/expense", function(req, res) {
  // res.send("expense GET API");

  expense.expenseDB.find(function(err, docs) {
    res.json(docs);
  });
});

router.post("/expense", function(req, res) {
  // console.log("received POST data : ", req.body);

  expense.expenseDB.insert(req.body, function(err, docs) {
    res.json(docs);
  });
});

router.post("/expense/remove", function(req, res) {

  console.log("req : ", req.body);
  expense.expenseDB.remove({
    _id : new ObjectId(req.body._id)
  }, function(err, docs) {
    res.json(docs);
  });
});

router.get("/balance", function(req, res) {

  balance.balanceDB.find(function(err, docs) {
    res.json(docs[0].amount);
  });
});

router.post("/balance", function(req, res) {
  balance.balanceDB.update({
    "_id" : "1"
  }, {
    $set: {
      "amount" : req.body
    }
  }, function(err, docs) {
    console.log(docs);
  });
});

module.exports = router;
