// ./app/routes.js

module.exports = function(app, passport){

  var UserCtrl = require('./controllers/Users.js');
  var User = require('./models/User');

  app.get('/', function(req, res){
    res.render('index', {
      title:"Sistema Hércules"
    });
  });

  app.get('/login', function(req, res){
    res.render('login', {
      title:"Hércules | Iniciar sesión"
    });
  });

  app.get('/main', function(req, res){
    res.render('main', {
      title:"Hércules | Dashboard",
      user:req.user,
      view:"dashboard",
      titleView:"Dashboard"
    });
  });

  app.get('/main/profiles', function(req, res){
    res.render('main', {
      title: "Hércules | Perfiles",
      user:req.user,
      view:"profiles",
      titleView:"Perfiles"
    });
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  // Login post.
  app.post('/login', passport.authenticate('local-login', {
    successRedirect:'/main',
    failureRedirect:'/',
    failureFlash:true
  }));

  app.get('/main/users', UserCtrl.findAllUsers);
  app.get('/main/users/blank', UserCtrl.blankUser);
  app.get('/main/users/delete/:id', UserCtrl.deleteUser);
  app.get('/main/users/edit/:id', UserCtrl.editUser);
  app.post('/main/users/update/:id', UserCtrl.updateUser);
  app.post('/main/users/add', UserCtrl.addUser);
}
