// /app/controllers/users.js

var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.findAllUsers = function(req, res){
  console.log("ENTRO...");
  User.find(function(err, users){
    if (err)
      res.send(500, err.message);

    var usersJSON = JSON.stringify(users);
    
    res.render('main', {
      title: "Hercules | Usuarios",
      user:req.user,
      users:usersJSON,
      view:"users",
      titleView:"Usuarios"
    });
  });
}
