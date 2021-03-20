const express = require('express');
const dotenv = require('dotenv');
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

// init database connection
connection();

// app config
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// set template engine
app.set('view engine', 'ejs');
app.set('views', __views);

// middleware
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/jq', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));

app.use(express.static(path.join(__public, '/css')));
app.use(express.static(path.join(__public, '/js')));
// load routes
app.get('/', (req, res) => {
  res.render('index');
});

// start server
app.listen(PORT, () => console.log(`Listening on port: http://localhost:${PORT}`));
