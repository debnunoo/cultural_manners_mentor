module.exports = function(app, mannersData) {

    // retrieving the questions for each culture through requiring the file
    const questions =  require('./question.js');


    const bcrypt = require('bcrypt');
    const { check, validationResult, body } = require('express-validator');
    const redirectLogin = (req, res, next) => {
        // checking to see if the a session has been created for the user
        if (!req.session.userId ) {
            // if not, redirecting to the login page
            res.redirect('./login')
        } 
        // if so, application will keep running
        else { next (); }
    }

    // landing route when user enters url address into browser
    app.get('/', function(req, res) {
        res.render('landing.ejs', mannersData);
    });

    // login route
    app.get('/login', function(req, res){
        res.render('login.ejs', mannersData);
    });

    // form fields to validate prior to logining in 
    var loginValid = [
        check('email').notEmpty().isEmail().normalizeEmail(), 
        check('password').notEmpty()
    ]

    // route user is redirected to after a successful login
    app.post('/loggedin', loginValid, function(req, res){
        // creating errors to process the validation
        const errors = validationResult(req);
        // processing errors if validation fails above
        if(!errors.isEmpty()) {
            console.error('Failed');
            // message to send if validation fails
            res.send('Your details were not correct! Please <a href="/login">try again</a>!');
        }
        else {
            // retrieving the users email from the form field
            var webUser = [req.body.email];

            // running query to select users details from the database based off the entered email address
            let query = `SELECT user_id, email, hashedpassword
                        FROM users
                        WHERE email = $1`;

            client.query(query, webUser, (err, result) => {
                if(err) {
                    console.log(err.message);
                    // sending message to user if query fails
                    res.send('Sorry your email was not recognised. Please register <a href="/register">here</a>');
                }
                else {
                    console.log(result.rows);

                    // retrieving the hash from the results (from the results (from query) query)
                    hashedPass = result.rows[0].hashedpassword;
                    //  Retrieving the user_id from the results (of the query)
                    userId = result.rows[0].user_id;

                    // using bcrypt to compare the inputted plaintext password with the hash (stored within database)
                    bcrypt.compare(req.sanitize(req.body.password), hashedPass, function(err, result) {
                        if(err) {
                            // sending message to page if login fails 
                            res.send("Sorry, your password doesn't seem to be correct! Please try again <a href='/login'>here</a> or reset your password <a href='/forgottenPassword>here</a>");
                        }
                        else if(result == true) {
                            console.log('Login has been successful');
                            // creating a session and session id using the userid from the database
                            req.session.userId = userId;
                            // sending users straight to the home page if login is successful
                            res.redirect('./home');
                        }
                        else {
                            // sending message if unexpected failure
                            res.send('Please <a href="/login">try again</a>');
                        }
                    });
                }  
            });
        }

    });

    // route for when users wish to log off the web application
    app.get('/logout', redirectLogin, function(req, res){
        // destroying the session once logout is clicked
        req.session.destroy(err => {
            if (err) {
                // if unable to logout, then redirect to the home
                res.redirect('./');
            }
                // sending message to user to indicate logging out has been successful
                res.send('You have successfully logged out. Please return to <a href= "/">Home</a>');
            });
    });

    // register route
    app.get('/register', function(req, res){
        res.render('register.ejs', mannersData);
    });

    // form fields to validate prior to registering
    var registrationValid = [
        check('email').isEmail().normalizeEmail().notEmpty(),
        check('password').isLength({min: 8, max: 15}).notEmpty().withMessage('Password must be at least 8 characters, but no more than 15 characters long!'),
        check('first').notEmpty(),
        check('surname').notEmpty()
    ]

    // route user is redirected to after a successful registration
    app.post('/registered', registrationValid, function(req, res) {
        // creating errors to process the validation
        const errors = validationResult(req);
        // processing errors if validation fails above
        if(!errors.isEmpty()) {
            console.error('Failed');
            // message to send if validation fails
            res.send('Sorry, there was an issue. Please re-enter your details Please <a href="/register">here!</a>!');
        }
        else {
            // retrieving the users entered password
            const plaintextPass = req.sanitize(req.body.password);
            // defining the number of salts that should be used for hashing
            const salt_rounds = 10

            // specifying the regex pattern (for the password)
            var regex = /^[A-Za-z\d@$!%*?&£=~|\-#<>_\/\\)('"^]{8,15}$/;

            // conditional statement to check if the password matches the regular expression
            if(!plaintextPass.match(regex)){
                // message to send if the password does not match the regex
                res.send("Please ensure your password is at least 8 characters and no more than 15 characters long and contains 1 upper case, 1 lower case, 1 number and 1 special keyboard character");
            }
            else {
                const hashedPass = bcrypt.hashSync(plaintextPass, salt_rounds);

                // creating the hash by salting the user inputted password
                bcrypt.hash(plaintextPass, salt_rounds, function(err, hashedPass) {

                    // running query to input users details into the database - specifically the users table
                    let query = `INSERT INTO users (
                                first_name, surname, email, username, hashedpassword)
                                VALUES($1, $2, $3, $4, $5)`;
                    
                    // retrieving the form details and santising them prior to database input
                    let newrecord = [req.sanitize(req.body.first), req.sanitize(req.body.surname), req.sanitize(req.body.email),
                                    req.sanitize(req.body.username), hashedPass]

                    client.query(query, newrecord, (err, result) => {
                        if(err) {
                            console.log(err.message);
                            // message if details could not be inputted
                            res.send('Sorry, there was an issue. Please re-enter your details Please <a href="/register">here!</a>!');
                        }
                        else {
                            console.log('Registration successful!');
                            // message if registration is successful
                            res.send('Thank you for registering to Cultural Manners Mentor. Please now <a href="/login">sign in</a>.')
                        }
                    });
                });
            };
        };
    });

    // forgotten password route
    app.get('/forgottenPassword', function(req, res){
        res.render('forgotten_password.ejs', mannersData)
    });

    // form fields to validate prior to resetting password
    var newPassValid = [
        check('email')
            .notEmpty().withMessage('Email is required.')
            .isEmail().normalizeEmail().withMessage('Invalid email format.'),
        check('password')
            .notEmpty().withMessage('Password is required.')
            .isLength({ min: 8, max: 15 }).withMessage('Password must be between 8 and 15 characters.')
    ];

    // route user is redirected to after a successful password resetting
    app.post('/passwordChanged', newPassValid, function(req, res){
        // retrieving users email from the form field
        var user_email = req.sanitize(req.body.email);

        // creating errors to process the validation
        const errors = validationResult(req);
        // processing errors if validation fails above
        if(!errors.isEmpty()) {
            console.error('Failed', errors.array());
            // message to send if validation fails
            res.send('Please <a href="/forgottenPassword">try again</a>!');
        }
        else {
            // running query to select users details from the database based off the entered email address
            let user_query = `SELECT user_id, email
                            FROM users
                            WHERE email = $1`;

            client.query(user_query, [user_email], (error, result) => {
                if(error) {
                    console.log(error);
                    // message to send if query fails - email is not found within the database
                    res.send('Please enter your email address correctly. Please try again <a href="/forgottenPassword">here.</a>');
                }
                else {
                    // using !== to compare the values of the inputted email (within the html form) and the email stored within the database
                    if(user_email !== result.rows[0].email) {
                        res.send(`There is no existing account associated with ${user_email}. Please <a href="/forgottenPassword">try again</a> or <a href="/register">create an account.</a>`);
                    }
                    else {
                        // continuing with the requests if user exists
                        // retrieving the users entered password
                        const plaintextPass = req.sanitize(req.body.password);
                        // defining the number of salts that should be used for hashing
                        const salt_rounds = 10

                        // specifying the regex pattern (for the password)
                        var regex = /^[A-Za-z\d@$!%*?&£=~|\-#<>_\/\\)('"^]{8,15}$/;

                        // conditional statement to check if the password matches the regular expression
                        if(!plaintextPass.match(regex)){
                            // message to send if the password does not match the regex
                            res.send("Please ensure your password is at least 8 characters and no more than 15 characters long and contains 1 upper case, 1 lower case, 1 number and 1 special keyboard character");
                        }
                        else {
                            const hashedPass = bcrypt.hashSync(plaintextPass, salt_rounds);

                            // creating the hash by salting the user inputted password
                            bcrypt.hash(plaintextPass, salt_rounds, function(err, hashedPass) {
                                
                                // running query to update users password details (hash) by using the inputted email address
                                // from the form
                                let update_record_query = `UPDATE users
                                                        SET hashedpassword = $1
                                                        WHERE email = $2`;

                                // retrieving the form fields to update users details
                                let updaterecord = [hashedPass, user_email];

                                client.query(update_record_query, updaterecord, (error, result) => {
                                    if(error) {
                                        console.log(error.message);
                                        // message if details could not be updated
                                        res.send('Failed to update password. Please <a href="/forgottenPassword">try again.</a>');
                                    }
                                    else {
                                        console.log('Registration successful!');
                                        // message if password reset was successful
                                        res.send('Your password has successfully been updated! Please login <a href="/login">here</a>.');
                                    }
                                });
                            });
                        };
                    };
                };
            });
        }
    })

    // route of the home page when users successfully login
    app.get('/home', redirectLogin, function(req, res) {

        // running query to select users first name based off their userid
        let query = `SELECT first_name, user_id
                    FROM users
                    WHERE user_id = $1`;

        // retrieving the session ID (previously set during login) as the userid to get users name
        const loggedUser = req.session.userId;

        client.query(query, [loggedUser], (error, result) => {
            if(error) {
                res.send('Sorry, please try logging in <a href="/login">again</a>.');
            }
            else {
                // assigning the results from the query to the variable availableUsers
                let data = Object.assign({}, mannersData, {availableUsers:result.rows});
                // console.log(result.rows);
                res.render('index.ejs', data);
            }
        });
    });

    // discussion forum route
    app.get('/discussionForum', redirectLogin, function(req, res) {
        // running query to select forum details, particularly the title, number of participants and date
        let query = `SELECT post_title, num_participants, TO_CHAR(latest_date, 'DD/MM/YYYY') AS latest_date_string
                    FROM (
                        SELECT post_title, COUNT(DISTINCT user_id) AS num_participants, MAX(date_added) AS latest_date
                        FROM forum 
                        GROUP BY post_title
                    ) AS subquery
                    ORDER BY latest_date DESC`;

        client.query(query, (error, result) => {
            if(error) {
                res.redirect('./');
            }
            else {
                // assigning the results from the query to the variable forumPosts
                let data = Object.assign({}, mannersData, {forumPosts:result.rows});
                console.log(result.rows);
                res.render('discussion_forum.ejs', data);
            }
        });
    });

    // route to add new forums
    app.get('/addNewForum', redirectLogin, function(req, res) {
        res.render('add_forum.ejs', mannersData);
    });

    // route user is redirected to after a successful forum input
    app.post('/forumAdded', redirectLogin, function(req, res) {

        // getting form input fields and sanitising them prior to inputting
        const p_title_input = req.sanitize(req.body.title_input);
        const p_content = req.sanitize(req.body.review);

        // retrieving the session ID
        const user_id = req.session.userId;

        // running query to input forum details into the database - specifically the forum table
        // using postgresql function NOW() to add the current time into the database
        let query = `INSERT INTO forum(user_id, post_title, post_content, username, date_added)
                VALUES($1, $2, $3, (SELECT username FROM users WHERE user_id = $4), NOW())`;

        // retrieving the form details
        let newrecord = [user_id, p_title_input, p_content, user_id]

        client.query(query, newrecord, (error, result) => {
            if(error) {
                console.log(error);
                // message to send if forum could not added
                res.send('Sorry, your forum could not be added! Please try again <a href="/addNewPost">here</a>.');
            }
            else {
                // message if forum addition is successful
                res.send('Your forum has been added successfully! You can the forums <a href="/discussionForum">here</a>');
            }

        });  
    });

    // route to allow users to add new posts to individual forums
    app.get('/discussionForum/addNewPost', redirectLogin, function(req, res) {
        // selecting forum title to display within a dropdown menu
        let query = `SELECT post_title
                    FROM forum
                    GROUP BY post_title`;
        
        client.query(query, (error, result) => {
            if(error) {
                res.redirect('./');
            }
            else {
                // assigning the results from the query to the variable forumTitles
                let data = Object.assign({}, mannersData, {forumTitles:result.rows});
                console.log(result.rows);
                res.render('add_post.ejs', data);
            }
        });
    });

    // route user is redirected to after a successful post input
    app.post('/postSubmitted', redirectLogin, function(req, res) {
        // selecting the value from the dropdwon menu
        const selected_title = req.body.existing_forums;
        // retrieving the session ID to use as userid
        const user_id = req.session.userId;

        // retrieving the form details
        let newrecord = [user_id, selected_title, req.sanitize(req.body.review), user_id];

        // running query to input post details into the database - specifically the forum table
        // using postgresql function NOW() to add the current time into the database
        let query = `INSERT INTO forum(user_id, post_title, post_content, username, date_added)
                    VALUES($1, $2, $3, (SELECT username FROM users WHERE user_id = $4), NOW())`;

        client.query(query, newrecord, (error, result) => {
            if(error) {
                // message to send if post could not added
                res.send('Sorry, your post could not be added! Please try again <a href="/addNewPost">here</a>.');
                console.log(error);
            }
            else {
                // message if post addition is successful
                res.send('Your post has been added successfully! Please click <a href="/discussionForum">here</a>');
            }
        });
    })

    // route to allow users to view individual forums
    app.get('/discussionForum/:post_title', redirectLogin, function(req, res) {

        // retrieving the variable to include within the parameters
        var post_title = req.params.post_title;

        // running query to select forum details - users' username, content, title and date they added the post
        let query = `SELECT username, TO_CHAR(date_added, 'DD/MM/YYYY') AS post_date, post_content, post_title
                    FROM forum
                    WHERE post_title = $1;`;

        client.query(query, [post_title], (error, result) => {
            if(error) {
                res.redirect('/discussionForum');
                console.log(error);
            }
            else {
                // assigning the results from the query to the variable individualPosts and the parameter to post_title
                let data = Object.assign({}, mannersData, {individualPosts:result.rows, post_title:post_title});
                console.log(result.rows);
                res.render('individual_forum.ejs', data);
            }
        });
    });

    // route to take users to uk culture page
    app.get('/uk', redirectLogin, function(req, res) {
        const uk = questions.uk_q; 
        res.render('map_template.ejs', {mannersData, uk});
    });

    // route to take users to the questions related to the uk
    app.get('/uk/questions', redirectLogin, function(req, res) {
        // var userScore = questions.score;
        // const questionNumber = req.params.number;
         // retrieving the questions (from the module required at the start of the file)
        // accessing specifically the uk questions
        const uk = questions.uk_q; 
        res.render('uk_question_template.ejs', {mannersData, uk});
    });

    // route to take users to usa culture page
    app.get('/usa', redirectLogin, function(req, res) {
        res.render('map_template.ejs', mannersData);
    });

    // route to take users to the questions related to the usa
    app.get('/usa/questions', redirectLogin, function(req, res) {
        // var userScore = questions.score;
        // retrieving the questions (from the module required at the start of the file)
        // accessing specifically the usa questions
        const usa = questions.usa_q; 
        res.render('usa_question_template.ejs', {mannersData, usa});
    });

    // route to take users to ghana culture page
    app.get('/ghana', redirectLogin, function(req, res) {
        res.render('map_template.ejs', mannersData);
    });

    // route to take users to the questions related to the ghana
    app.get('/ghana/questions', redirectLogin, function(req, res) {
        // var userScore = questions.score;
         // retrieving the questions (from the module required at the start of the file)
        // accessing specifically the ghana questions
        const ghana = questions.gh_q; 
        res.render('ghana_question_template.ejs', {mannersData, ghana});
    });

    app.get('/ghana/result-ghana', redirectLogin, function(req, res) {
        // running query to select users first name based off their userid
        let query = `SELECT first_name, user_id
                    FROM users
                    WHERE user_id = $1`;

        // retrieving the session ID (previously set during login) as the userid to get users name
        const loggedUser = req.session.userId;

        client.query(query, [loggedUser], (error, result) => {
            if(error) {
                res.send('Sorry, there was an unexpected error. Please try <a href="/ghana/questions">again</a>.');
            }
            else {
                // assigning the results from the query to the variable usersName
                let data = Object.assign({}, mannersData, {usersName:result.rows});
                // console.log(result.rows);
                res.render('question_results.ejs', data);
            }
        });

        // res.render('question_results.ejs', mannersData);
    });

    app.get('/uk/result-uk', redirectLogin, function(req, res) {
        // running query to select users first name based off their userid
        let query = `SELECT first_name, user_id
                    FROM users
                    WHERE user_id = $1`;

        // retrieving the session ID (previously set during login) as the userid to get users name
        const loggedUser = req.session.userId;

        client.query(query, [loggedUser], (error, result) => {
            if(error) {
                res.send('Sorry, there was an unexpected error. Please try <a href="/ghana/questions">again</a>.');
            }
            else {
                // assigning the results from the query to the variable usersName
                let data = Object.assign({}, mannersData, {usersName:result.rows});
                // console.log(result.rows);
                res.render('question_results.ejs', data);
            }
        });
        // res.render('question_results.ejs', mannersData);
    });

    app.get('/usa/result-usa', redirectLogin, function(req, res) {
        // running query to select users first name based off their userid
        let query = `SELECT first_name, user_id
                    FROM users
                    WHERE user_id = $1`;

        // retrieving the session ID (previously set during login) as the userid to get users name
        const loggedUser = req.session.userId;

        client.query(query, [loggedUser], (error, result) => {
            if(error) {
                res.send('Sorry, there was an unexpected error. Please try <a href="/ghana/questions">again</a>.');
            }
            else {
                // assigning the results from the query to the variable usersName
                let data = Object.assign({}, mannersData, {usersName:result.rows});
                // console.log(result.rows);
                res.render('question_results.ejs', data);
            }
        });
        // res.render('question_results.ejs', mannersData);
    });

};