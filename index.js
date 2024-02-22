var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
// var fileSystem = require('fs');
// var mongoose = require('mongoose');
var { Client } = require('pg');
var session = require('express-session');
var dotenv = require('dotenv').config({path: 'credentials.env'});
var validator = require('express-validator');
var sanitizer = require('express-sanitizer');
const { MongoClient } = require('mongodb');

const app = express()
const port = 8000
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

app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/unit_test'));
app.use(express.json());

app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile)


// https://www.mongodb.com/docs/atlas/tutorial/connect-to-your-cluster/
const uri = process.env.mongo_uri;
const mongoClient = new Client(uri);

mongoClient.connect((err) => {
    console.log('Mongodb database has successfully connected!');
})


// https://node-postgres.com/
const client = new Client ({
    user: process.env.db_user,
    host: 'localhost',
    database: 'postgres',
    password: process.env.db_password,
    port: process.env.port
});

// https://node-postgres.com/apis/client
client.connect((err) => {
    if(err) {
        console.log('Database connection failed.', err.stack)
    }
    else {
        console.log('Postgres database is connected');
    }
})

// declaring the database objects as global in order to access within main.js
global.client = client;
global.mongoClient = mongoClient;

var mannersData = {appName: "Cultural Manners Mentor"}

require("./routes/main")(app, mannersData);

app.listen(port, () => console.log(`Manners app listening on port ${port}`))