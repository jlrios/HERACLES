// ./app/models/Userj.s

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  local:{
    correoElectronico:String,
    contrasena: String,
    nombre:String,
    primerApellido:String,
    segundoApellido:String,
    perfil:Number,
    activo:Number
  }
});

userSchema.methods.generateHash = function(contrasena){
  return bcrypt.hashSync(contrasena, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(contrasena){
  return bcrypt.compareSync(contrasena, this.local.contrasena);
};

module.exports = mongoose.model('User', userSchema);
