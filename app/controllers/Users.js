// /app/controllers/users.js

var mongoose = require('mongoose');
var User = mongoose.model('User');

// Lista completa de usuarios, llama a otra función.
exports.findAllUsers = function(req, res) {
  findUsersAndRender(req, res);
}

// Agregar usuario, vista.
exports.blankUser = function(req, res) {
  res.render('main', {
    title: "Hércules | Agregar usuario",
    user:req.user,
    view:"blankUser",
    titleView:"Agregar usuario"
  });  
}

// Agregar un nuevo usuario, también llama a la función para listar a los usuarios, después
// de que el usuario haya sido agregado.
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

// Editar usuario, también llama a la función para listar a los usuarios, después de
// actualizar el registro.
exports.updateUser = function(req, res){

  User.findById(req.params.id, function(err, userUpdate){
    if (err){
      return done(err);
    }

    userUpdate.local.correoElectronico = req.body.correoElectronico;
    userUpdate.local.contrasena = req.body.contrasena;
    userUpdate.local.primerApellido = req.body.primerApellido;
    userUpdate.local.segundoApellido = req.body.segundoApellido;
    userUpdate.local.nombre = req.body.nombreCompleto;

    userUpdate.save(function(err){
      if (err)
        throw err;

      findUsersAndRender(req, res);
    });
  });
}

exports.deleteUser = function(req, res) {
  User.findById(req.params.id, function(err, userDelete){
    userDelete.remove(function(err){
      if (err)
        throw err;

      findUsersAndRender(req, res);
    });
  });
}

exports.editUser = function(req, res) {
  var id = req.params.id;

  User.findById(id, function(err, userId){
    if (err){
      return done(err);
    }

    if (userId) {
      res.render('main', {
        title: "Hércules | Editar usuario",
        user: req.user,
        userId: userId,
        view: "edit-user",
        titleView: "Editar usuario"
      });
    }
  });
}

// Lista de todos los usuarios y renderiza la vista.
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
