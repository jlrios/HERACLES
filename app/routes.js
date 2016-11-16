// ./app/routes.js

module.exports = function(app, passport){
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

  app.get('/dashboard', function(req, res){
    console.log(res);
    res.render('dashboard/dashboard', {
      title:"Hércules | Dashboard",
      user:req.user
    });
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect:'/dashboard',
    failureRedirect:'/',
    failureFlash:true
  }));
}
