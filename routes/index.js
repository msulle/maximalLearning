var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'home' });
});

router.get('/review', function(req, res, next) {
  res.render('review', { title: 'review' });
});

router.get('/new', function(req, res, next) {
  res.render('new', { title: 'new' });
});

router.get('/userlist', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({}, {}, function(e, docs) {
    res.render('userlist', {
      "userlist": docs
    });
  });
});

router.get('/newuser', function(req, res) {
  res.render('newuser', { title: 'Add New User' });
});

router.post('/adduser', function(req, res) {
  var db = req.db;
  var userName = req.body.username;
  var userEmail = req.body.useremail;
  var collection = db.get('usercollection');
  collection.insert({
    "username": userName,
    "email": userEmail
  }, function (err, doc) {
    if (err) {
      res.send("There was a problem with communicating with the database");
    }
    else {
      res.redirect("userlist");
    }
  });
});

module.exports = router;
