// /app/controllers/users.js

var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.findAllUsers = function(req, res){
  console.log("ENTRO...");
  User.find(function(err, users){
    if (err)
      res.send(500, err.message);

    var usersJSON = users;
    console.log(usersJSON);
    res.render('main', {
      title: "Hercules | Usuarios",
      user:req.user,
      users:users,
      view:"users",
      titleView:"Usuarios"
    });
  });
}
