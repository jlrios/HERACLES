// ./app/routes.js

module.exports = function(app, passport){

  var UserCtrl = require('./controllers/Users.js');
  var User = require('./models/User');

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // Puro get's.
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
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

app.get('/main/users', UserCtrl.findAllUsers);

app.get('/main/users/blank', function(req, res){
  res.render('main', {
    title: "Hércules | Agregar usuario",
    user:req.user,
    view:"blankUser",
    titleView:"Agregar usuario"
  });
});

app.get('/main/users/edit/:id', function(req, res){
  console.log("ENTRO...");
  var id = req.params.id;
  console.log(id);
  User.findById({'local.correoElectronico': req.body.correoElectronico}, function(err, user){
    if (err){
      return done(err);
    }

    if (user) {
      res.render('main', {
        title: "Hércules | Editar usuario",
        user: req.user,
        view: "edit-user",
        titleView: "Editar usuario"
      });
    }
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

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // Puro post's
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // Login post.
  app.post('/login', passport.authenticate('local-login', {
    successRedirect:'/main',
    failureRedirect:'/',
    failureFlash:true
  }));

  // Post's de usuarios.
  app.post('/main/users/blank', UserCtrl.addUser);
  app.post('/main/users/edit', UserCtrl.editUser);

}
