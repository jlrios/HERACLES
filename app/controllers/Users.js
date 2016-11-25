// /app/controllers/users.js

var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.findAllUsers = function(req, res){
  findUsersAndRender(req, res);
}

exports.addUser = function(req, res){
  User.findOne({'local.correoElectronico': req.body.correoElectronico}, function(err, user){
    if (err){
      return done(err);}

    if (user) {
      return done(null, false, req.flash('signupMessage', 'El correo electrónico ya se encuentra registrado.'));
    } else {
      var newUser = new User();

      newUser.local.correoElectronico = req.body.correoElectronico;
      newUser.local.contrasena = newUser.generateHash(req.body.contrasena);
      newUser.local.primerApellido = req.body.primerApellido;
      newUser.local.segundoApellido= req.body.segundoApellido;
      newUser.local.nombre = req.body.nombreCompleto;
      newUser.local.activo = 1;
      newUser.local.perfil = 1;

      newUser.save(function(err) {
        if (err)
          throw err;

        findUsersAndRender(req, res);
      });
    }
  });
}

// Encuentra todos los usuarios y renderiza la vista.
function findUsersAndRender(_req, _res) {
  User.find(function(err, users){
    if (err)
      _res.send(500, err.message);

    _res.render('main', {
      title: "Hércules | Usuarios",
      user:_req.user,
      users:users,
      view:"users",
      titleView:"Usuarios"
    });
  });
}
