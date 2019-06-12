const express = require('express');
const logger = require('morgan');
const missingItem = require('./api/router/missingItemRouter');
const foundedItem = require('./api/router/foundedItemRouter');
const categoryItem = require('./api/router/categoryItemRouter');
const bodyParser = require('body-parser');
const mongoose = require('./api/config/database'); //database configuration
const cors = require('cors');
const session = require('client-sessions');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const app = express();
app.use(cors());
app.use(cookieParser());
// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(logger('dev'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.get('/', function(req, res){
res.json({"message" : "Build REST API with node.js"});
});
// public route
app.use('/missing', missingItem);
app.use('/founded', foundedItem);
app.use('/category', categoryItem);
// private route
// app.use('/movies', validateUser, movies);
app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function(req, res, next) {
 let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
});
  
// handle errors
app.use(function(err, req, res, next) {
 console.log(err);
 
  if(err.status === 404)
   res.status(404).json({message: "Not found"});
  else 
    res.status(500).json({message: "Something looks wrong :( !!!"});
});

app.listen(8080, function(){
    console.log('Node server 8080');
});