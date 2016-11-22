// /app/controllers/users.js

var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.findAllUsers = function(req, res){
  User.find(function(err, users){
    if (err)
      res.send(500, err.message);

    res.status(200).json(users);
  });
}
