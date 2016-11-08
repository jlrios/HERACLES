// ./app/models/Userj.s

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  local:{
    correoElectronico:String,
    contrasena: String
  }
});

userSchema.methods.generateHash = function(contrasena){
  return bcrypt.hashSync(contrasena, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(contrasena){
  return bcrypt.compareSync(contrasena, this.local.contrasena);
};

module.exports = mongoose.model('User', userSchema);
