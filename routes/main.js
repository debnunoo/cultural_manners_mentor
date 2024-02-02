const { Db } = require("mongodb");

module.exports = function(app, mannersData) {

// var c_learning = require('./cultural_learning.js');

const bcrypt = require('bcrypt');
const { check, validationResult, body } = require('express-validator')

app.get('/', function(req, res) {
    res.render('landing.ejs', mannersData)
});

app.get('/login', function(req, res){
    res.render('login.ejs', mannersData)
});

var loginValid = [
    check('email').notEmpty().isEmail().normalizeEmail(), 
    check('password').notEmpty()
]

app.post('/loggedin', loginValid, function(req, res){
    if(!errors.isEmpty()) {
        console.error('Failed');
    }
    else {
        var webUser = req.sanitize(req.body.username);
        const plaintextPass = req.sanitize(req.body.password);

        let query = `SELECT email, hashedpassword
                     FROM users
                     WHERE email = ?`

        client.query(query, webUser, function(req, res) {
            if(err) {
                return console.log(err.message);
            }
            else {
                console.log(result);

                hashedPass = result.rows[0].hashedpassword;

                bcrypt.compare(plaintextPass, hashedPass, function(err, result){
                    if(err) {
                        res.send("Sorry, your password doesn't seem to be correct! Please try again <a href='/login'>here</a> or reset your password <a href='/forgottenPassword>here</a>");
                    }
                    else if(result == true) {
                        console.log('Login has been successful');
                        res.redirect('/home');
                    }
                    else {
                        res.send('Please try again');
                    }
                })
            }   
        })
    }

})

app.get('/register', function(req, res){
    res.render('register.ejs', mannersData)
});

var registrationValid = [
    check('email').isEmail().normalizeEmail().notEmpty(),
    check('password').isLength({min: 8}).notEmpty(),
    check('first').notEmpty(),
    check('surname').notEmpty()
]

app.post('/registered', registrationValid, function(req, res) {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.error('Failed');
    }
    else {
        const plaintextPass = req.sanitize(req.body.password);
        const salt_rounds = 10

        const hashedPass = bcrypt.hashSync(plaintextPass, salt_rounds);

        bcrypt.hash(plaintextPass, salt_rounds, function(err, hashedPass) {

            let query = `INSERT INTO users (
                         first_name, surname, email, username, hashedpassword)
                         VALUES(?, ?, ?, ?, ?)`;
            
            let newrecord = [req.sanitize(req.body.first), req.sanitize(req.body.surname), req.sanitize(req.body.email),
                            req.sanitize(req.body.username), hashedPass]

            client.query(query, newrecord, (err, result) => {
                if(err) {
                    return console.log(err.message);
                }
                else {
                    console.log('Registration successful!');
                    res.redirect('/home');
                }
            });
        });
    };
});


app.get('/forgottenPassword', function(req, res){
    res.render('forgotten_password.ejs', mannersData)
});

// https://express-validator.github.io/docs/6.6.0/custom-error-messages
var newPassValid = [
    check('email').isEmail().normalizeEmail().notEmpty(),
    check('password').isLength({min: 8}).notEmpty().withMessage('Password must be at least 8 characters long!'),
    check('confirm_pass').isLength({min: 8}).notEmpty(),
    check('password').custom((value, {req}) => {
        if(value !== req.body.confirm_pass) {
            throw new Error(
                'Passwords do not match! Please try again.'
            )
        }
    })
]

app.post('/passwordChanged', newPassValid, function(req, res){
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.error('Failed');
    }
    else {
        var user = req.sanitize(req.body.email);

        let user_query = `SELECT id, email
                          FROM users
                          WHERE email = ?`;

        client.query(user_query, user, (error, result) => {
            if(error) {
                console.log(error);
                res.send('Sorry, please try again!');
            }
            else {
                // if the email can be found against the database results (if more than 1 result appears), 
                // then continue to the next route handler
                if(result.rows.length > 0) {
                    // continuing with the requests if user exists
                    next();
                    const plaintextPass = req.sanitize(req.body.password);
                    const salt_rounds = 10

                    const hashedPass = bcrypt.hashSync(plaintextPass, salt_rounds);

                    bcrypt.hash(plaintextPass, salt_rounds, function(err, hashedPass) {
                        
                        let query = `UPDATE users
                                    SET hashedpassword = ?
                                    WHERE email = ?`;

                        let updaterecord = [req.sanitize(req.body.password), user];

                        client.query(query, updaterecord, (error, result) => {
                            if(err) {
                                return console.log(err.message);
                            }
                            else {
                                console.log('Registration successful!');
                                res.send('Your password has successfully been updated! Please login <a href="login.ejs">here</a>.')
                            }
                        });
                    });
                }
                else {
                    res.send('Sorry, there is no account this address. Please create an account <a href="register.ejs">here</a>')
                }
            };
        });
    }
})

app.get('/home', function(req, res) {
    res.render('index.ejs', mannersData)
});

app.get('/discussionForum', function(req, res) {

    let query = `SELECT post_title, COUNT(DISTINCT user_id) AS num_participants, MAX(date_added) AS latest_date
                 FROM forum
                 GROUP BY post_title`


        client.query(query, (error, result) => {
        if(error) {
            res.redirect('./');
        }
        else {
            let data = Object.assign({}, mannersData, {forumPosts:result.rows});
            console.log(result.rows);
            res.render('discussion_forum.ejs', data);
        }
    })
});

app.get('/addNewPost', function(req, res) {
    res.render('add_forum.ejs', mannersData)
})

app.post('/postSubmitted', function(req, res) {
    
    // https://tecadmin.net/get-current-date-time-javascript/
    // getting the javascript date object 
    var date = new Date();
    // formatting the full date to input into the database
    var post_date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

    let query = `INSERT INTO user_id, post_title, post_content, username, date_added
                 VALUES(?, ?, ?, (SELECT username FROM users WHERE user_id = ?), post_date)`

    let newrecord = [req.sanitize ]

    client.query()

    
})

// app.get('/example-questions', function(req, res) {
   
// })


}