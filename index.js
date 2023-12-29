var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');


const app = express()
const port = 8000
app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/assets'));

app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile)

var mannersData = {appName: "Cultural Manners Mentor"}

require("./routes/main")(app, mannersData);

app.listen(port, () => console.log(`Manners app listening on port ${port}`))