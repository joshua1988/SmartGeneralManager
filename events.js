var express = require('express');
var router = express.Router();

// DB
var mongojs = require('mongojs');
var expense = mongojs('birthday', ['expenseDB']);
var deposit = mongojs('birthday', ['depositDB']);
var change = mongojs('birthday', ['changeDB']);

router.get('/', function(req, res, next) {
    res.render('event.html');
});

router.get("/deposit", function(req, res) {
  // res.send("deposit GET API");

  expense.expenseDB.find(function(err, docs) {
    res.json(docs);
  });
});

router.post("/deposit", function(req, res) {
  // console.log("received POST data : ", req.body);

  expense.expenseDB.insert(req.body, function(err, docs) {
    res.json(docs);
  });
});

module.exports = router;
