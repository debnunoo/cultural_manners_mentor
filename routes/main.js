const { post } = require('request');

module.exports = function(app, mannersData) {

// var c_learning = require('./cultural_learning.js');
// var fs = require('fs');

const bcrypt = require('bcrypt');
const { check, validationResult, body } = require('express-validator')
const redirectLogin = (req, res, next) => {
    // checking to see if the a session has been created for the user
    if (!req.session.userId ) {
        // if not, redirecting to the login page
        res.redirect('./login')
    } 
    // if so, application will keep running
    else { next (); }
}

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
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.error('Failed');
        res.send('Please <a href="/login">try again</a>!');
    }
    else {
        var webUser = [req.body.email];

        let query = `SELECT user_id, email, hashedpassword
                     FROM users
                     WHERE email = $1`

        client.query(query, webUser, (err, result) => {
            if(err) {
                return console.log(err.message);
            }
            else {
                console.log(result.rows);

                hashedPass = result.rows[0].hashedpassword;
                //  Retrieving the user_id from query
                userId = result.rows[0].user_id;

                bcrypt.compare(req.sanitize(req.body.password), hashedPass, function(err, result) {
                    if(err) {
                        res.send("Sorry, your password doesn't seem to be correct! Please try again <a href='/login'>here</a> or reset your password <a href='/forgottenPassword>here</a>");
                    }
                    else if(result == true) {
                        console.log('Login has been successful');
                        req.session.userId = userId;
                        res.redirect('./home');
                    }
                    else {
                        res.send('Please <a href="/login">try again</a>');
                    }
                });
            }  
        });
    }

});

app.get('/logout', redirectLogin, function(req, res){
    req.session.destroy(err => {
        if (err) {
          return res.redirect('./');
        }
            // sending message to user to indicate logging out has been successful
            res.send('You have successfully logged out. Please return to <a href= "/">Home</a>');
        });
});

app.get('/register', function(req, res){
    res.render('register.ejs', mannersData)
});

var registrationValid = [
    check('email').isEmail().normalizeEmail().notEmpty(),
    check('password').isLength({min: 8, max: 15}).notEmpty().withMessage('Password must be at least 8 characters, but no more than 15 characters long!'),
    check('first').notEmpty(),
    check('surname').notEmpty()
]

app.post('/registered', registrationValid, function(req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.error('Failed');
        res.send('Please <a href="/register">try again</a>!');
    }
    else {
        const plaintextPass = req.sanitize(req.body.password);
        const salt_rounds = 10

        // simplified from https://regexr.com/3bfsi
        var regex = /^[A-Za-z\d@$!%*?&£=~|\-#<>_\/\\)('"^]{8,15}$/;
        // https://stackoverflow.com/questions/74331431/how-i-can-validate-password-with-node-js
        if(!plaintextPass.match(regex)){
            res.send("Please ensure your password is at least 8 characters and no more than 15 characters long and contains 1 upper case, 1 lower case, 1 number and 1 special keyboard character");
        }
        else {
            const hashedPass = bcrypt.hashSync(plaintextPass, salt_rounds);

            bcrypt.hash(plaintextPass, salt_rounds, function(err, hashedPass) {

                let query = `INSERT INTO users (
                            first_name, surname, email, username, hashedpassword)
                            VALUES($1, $2, $3, $4, $5)`;
                
                let newrecord = [req.sanitize(req.body.first), req.sanitize(req.body.surname), req.sanitize(req.body.email),
                                req.sanitize(req.body.username), hashedPass]

                client.query(query, newrecord, (err, result) => {
                    if(err) {
                        return console.log(err.message);
                    }
                    else {
                        console.log('Registration successful!');
                        res.send('Thank you for registering to Cultural Manners Mentor. Please now <a href="/login">sign in</a>.')
                    }
                });
            });
        };
    };
});


app.get('/forgottenPassword', function(req, res){
    res.render('forgotten_password.ejs', mannersData)
});

// https://express-validator.github.io/docs/6.6.0/custom-error-messages
var newPassValid = [
    check('email').isEmail().normalizeEmail().notEmpty(),
    check('password').isLength({min: 8, max: 15}).notEmpty().withMessage('Password must be at least 8 characters, but no more than 15 characters long!'),
    check('confirm_pass').isLength({min: 8, max: 15}).notEmpty(),
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
        res.send('Please <a href="/forgottenPassword">try again</a>!');
    }
    else {
        var user = req.sanitize(req.body.email);

        let user_query = `SELECT user_id, email
                          FROM users
                          WHERE email = $1`;

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

                    // simplified from https://regexr.com/3bfsi
                    var regex = /^[A-Za-z\d@$!%*?&£=~|\-#<>_\/\\)('"^]{8,15}$/;
                    // https://stackoverflow.com/questions/74331431/how-i-can-validate-password-with-node-js
                    if(!plaintextPass.match(regex)){
                        res.send("Please ensure your password is at least 8 characters and no more than 15 characters long and contains 1 upper case, 1 lower case, 1 number and 1 special keyboard character");
                    }
                    const hashedPass = bcrypt.hashSync(plaintextPass, salt_rounds);

                    bcrypt.hash(plaintextPass, salt_rounds, function(err, hashedPass) {
                        
                        let query = `UPDATE users
                                    SET hashedpassword = $1
                                    WHERE email = $2`;

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

app.get('/home', redirectLogin, function(req, res) {

    // let query = `SELECT first_name, user_id
    //              FROM users
    //              WHERE user_id = $1`

    // const loggedUser = [req.session.userId];

    //     client.query(query, loggedUser, (error, result) => {
    //     if(error) {
    //         res.redirect('/');
    //     }
    //     else {
    //         let data = Object.assign({}, mannersData, {availableUsers:result.rows});
    //         console.log(result.rows);
    //         res.render('index.ejs', data);
    //     }
    // });

    res.render('index.ejs', mannersData)
});

app.get('/discussionForum', redirectLogin, function(req, res) {

    // https://stackoverflow.com/questions/6133107/extract-date-yyyy-mm-dd-from-a-timestamp-in-postgresql
    let query = `SELECT post_title, COUNT(DISTINCT user_id) AS num_participants, MAX(TO_CHAR(date_added, 'DD/MM/YYYY')) AS latest_date
                 FROM forum
                 GROUP BY post_title`;


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

app.get('/addNewPost', redirectLogin, function(req, res) {

    let query = `SELECT post_title, post_id
                 FROM forum
                 GROUP BY post_id, post_title`
    
    client.query(query, (error, result) => {
        if(error) {
            res.redirect('./');
        }
        else {
            let data = Object.assign({}, mannersData, {forumTitles:result.rows});
            console.log(result.rows);
            res.render('add_forum.ejs', data);
        }
    })

})

app.post('/postSubmitted', redirectLogin, function(req, res) {

    // getting form input fields
    // const p_title = req.body.titleOfPosts;
    const p_title_input = req.sanitize(req.body.title_input);
    const p_content = req.sanitize(req.body.review);
    const user_id = req.session.userId;

        console.log(p_title_input);
        // console.log(p_title);
        let query = `INSERT INTO forum(user_id, post_title, post_content, username, date_added)
                 VALUES($1, $2, $3, (SELECT username FROM users WHERE user_id = $4), NOW())`;

        let newrecord = [user_id, p_title_input, p_content, user_id]

        client.query(query, newrecord, (error, result) => {
            if(error) {
                console.log(error);
                res.send('Sorry, your post could not be added! Please try again <a href="addNewPost">here</a>.');
            }
            else {
                res.send('Your post has been added successfully! You can the forums <a href="/discussionForum">here</a>');
            }

        });
    
});

app.get('/discussionForum/:post_title', function(req, res) {

    // retrieving the variable to include within the parameters
    var post_title = req.params.post_title;

    // retrieving the post_title from the body to retrieve details from the database
    // var titleToRetrieve = req.body.post_title;
    
    let query = `SELECT username, TO_CHAR(date_added, 'DD/MM/YYYY') AS post_date, post_content, post_title
                 FROM forum
                 WHERE post_title = $1;`;

    client.query(query, [post_title], (error, result) => {
        if(error) {
            res.redirect('/discussionForum');
            console.log(error);
        }
        else {
            let data = Object.assign({}, mannersData, {individualPosts:result.rows, post_title:post_title});
            console.log(result.rows);
            res.render('individual_forum.ejs', data);
        }
    });
});

app.get('/uk', function(req, res) {
    res.render('question_template.ejs', mannersData);
});

}