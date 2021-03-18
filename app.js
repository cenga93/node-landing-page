const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const connection = require('./src/database/connection');
const app = express();
const PORT = process.env.PORT || 3000;

// path
const public_dir = path.join(__dirname, 'public');
const src_dir = path.join(__dirname, 'src');
const views_dir = path.join(src_dir, 'views');

// dotenv init
dotenv.config();

// init database connection
connection();

// app config
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// set template engine
app.set('view engine', 'ejs');
app.set('views', views_dir);

// static files
app.use(express.static(public_dir));

// load routes
app.get('/', (req, res) => {
  res.render('index');
});

// start server
app.listen(PORT, () => console.log(`Listening on port: http://localhost:${PORT}`));
