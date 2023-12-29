module.exports = function(app, mannersData) {

app.get('/', function(req, res) {
    res.render('landing.ejs', mannersData)
});

app.get('/login', function(req, res){
    res.render('login.ejs', mannersData)
});

app.get('/register', function(req, res){
    res.render('register.ejs', mannersData)
});


}