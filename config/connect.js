// ./config/connect.js

var localStrategy = require('passport-local');
var User = require('../app/models/User');

module.exports = function(passport){

  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    });
  });

  // Local login.
  passport.use('local-login', new localStrategy({
    usernameField:'correoElectronico',
    passwordField:'contrasena',
    passReqToCallback:true
  },
  function(req, correoElectronico, contrasena, done){
    User.findOne({'local.correoElectronico': correoElectronico}, function(err, user){
      if(err)
        return done(err);

      if(!user)
        return done(null, false, req.flash('loginMessage', 'Usuario y/o contrasena incorrecto(s).'));

      if(!user.validPassword(contrasena))
        return done(null, false, req.flash('loginMessage', 'Usuario y/o contraseña incorrecto(s).'));

      return done(null, user);
    });
  }));
};
