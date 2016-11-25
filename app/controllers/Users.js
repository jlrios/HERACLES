// /app/controllers/users.js

var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.findAllUsers = function(req, res){
  User.find(function(err, users){
    if (err)
      res.send(500, err.message);

    res.render('main', {
      title: "Hércules | Usuarios",
      user:req.user,
      users:users,
      view:"users",
      titleView:"Usuarios"
    });
  });
}

exports.addUser = function(req, res){

}
