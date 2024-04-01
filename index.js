// importing required node dependencies (libraries)
var express = require('express'); // express.js
var ejs = require('ejs'); // ejs
var bodyParser = require('body-parser'); // body-parser to process incoming requests
var { Client } = require('pg'); // postgresql
var session = require('express-session'); // express-session to generate sessions for users
var dotenv = require('dotenv').config({path: 'credentials.env'}); // to hide personal credentials
var validator = require('express-validator'); // 
var sanitizer = require('express-sanitizer');

// initialising express
const app = express()
const port = 8000 // setting the port that will be listened to by the app
app.use(bodyParser.urlencoded({extended:true}))
app.use(sanitizer());
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

// setting the path to the file directories
app.use(express.static(__dirname + '/css')); // to read css file
app.use(express.static(__dirname + '/assets')); // to read the different media (pictures and images) within the folder
app.use(express.static(__dirname + '/unit_test')); // to conduct testing within the code

app.set('views', __dirname + '/templates'); // setting the templates folders to render web pages
app.set('view engine', 'ejs'); // rendering web pages using ejs
app.engine('html', ejs.renderFile); // mapping ejs files to html files

// creating a new client, and entering connection details
const client = new Client ({
    user: process.env.db_user,
    host: 'localhost',
    database: 'postgres',
    password: process.env.db_password,
    port: process.env.port
});

// connecting to the client
client.connect((err) => {
    if(err) {
        console.log('Database connection failed.', err.stack)
    }
    else {
        console.log('Postgres database is connected');
    }
})

// declaring the database object as global in order to access within main.js
global.client = client;

// creating a variable with the app name
var mannersData = {appName: "Cultural Manners Mentor"}

// getting the main.js file
require("./routes/main")(app, mannersData);

// listening for visitors on the specified port and current web address
app.listen(port, () => console.log(`Manners app listening on port ${port}`))