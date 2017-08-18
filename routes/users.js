var express = require('express');
var router = express.Router();

router.get('/userlist', function(req, res) {
  var db = req.db;
  var collection= db.get('userlist');
  collection.find({}, {}, function(e, docs) {
    res.json(docs);
  });
});

router.post('/adduser', function(req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  collection.insert(req.body, function(err, result) {
    res.send(
      (err === null) ? {msg: '' } : { msg: err }
    );
  });
});

router.delete('/deleteuser/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  var userToDelete = req.params.id;
  collection.remove({ '_id': userToDelete }, function(err) {
    res.send((err === null) ? { msg: '' } : { msg:`error: ${err}`});
  });
});

module.exports = router;
