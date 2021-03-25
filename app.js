const express = require('express');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');
const connection = require('./src/database/connection');
const Message = require('./src/models/message');
const app = express();
const PORT = process.env.PORT || 3000;
// ********************************************

// ********************************************

// path
const __public = path.join(__dirname, 'public');
const __src = path.join(__dirname, 'src');
const __views = path.join(__src, 'views');

// dotenv init
dotenv.config();

// init database connection
connection();

// app config
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(expressLayouts);

// set template engine
app.set('view engine', 'ejs');
app.set('views', __views);
app.set('layout', 'layout/default');

// static files
app.use(express.static(path.join(__public, '/css')));
app.use(express.static(path.join(__public, '/js')));
app.use(express.static(path.join(__public, '/img')));
app.use('/bootstrap/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/bootstrap/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/jq', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/fonts', express.static(path.join(__public, '/www/fonts')));
app.use('/svg', express.static(path.join(__public, '/www/svg')));
app.use('/img', express.static(path.join(__public, '/img')));

// load routes
app.get('/', (req, res) => {
  res.render('pages/home');
});

app.get('/contact', (req, res) => {
  res.render('pages/contact');
});

app.post('/contact', (req, res) => {
  const { firstname, lastname, email, message } = req.body;
  const newMessage = new Message({
    _id: new mongoose.Types.ObjectId(),
    firstname,
    lastname,
    email,
    message,
  });

  newMessage
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).redirect('/');
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// start server
app.listen(PORT, () => console.log(`Listening on port: http://localhost:${PORT}`));
