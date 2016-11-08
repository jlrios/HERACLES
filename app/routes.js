// ./app/routes.js

module.exports = function(app, passport){
  app.get('/', function(req, res){
    res.render('index');
  });

  app.get('/login', function(req, res){
    res.render('login');
  });

  app.get('/dashboard', function(req, res){
    res.render('includes/dashboard/dashboard');
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect:'/dashboard',
    failureRedirect:'/',
    failureFlash:true
  }))
}
