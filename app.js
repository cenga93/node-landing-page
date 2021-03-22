const express = require('express');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const morgan = require('morgan');
const connection = require('./src/database/connection');
const app = express();
const PORT = process.env.PORT || 3000;

// path
const __public = path.join(__dirname, 'public');
const __src = path.join(__dirname, 'src');
const __views = path.join(__src, 'views');

// dotenv init
dotenv.config();

// init database connection ****** DISABLED for now
// connection();

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

// load routes
app.get('/', (req, res) => {
  res.render('pages/home');
});

app.get('/contact', (req, res) => {
  res.render('pages/contact');
});

// start server
app.listen(PORT, () => console.log(`Listening on port: http://localhost:${PORT}`));
