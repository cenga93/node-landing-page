const express = require('express');
const dotenv = require('dotenv').config();
const path = require('path');
const morgan = require('morgan');
const connection = require('./src/database/connection');
const app = express();
const PORT = process.env.PORT || 3001;

// init db onnection
connection();

// app config
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// static files
app.use(express.static(path.join(__dirname, 'public')));
// load routes
app.get('/', (req, res) => {
  res.send('<h1>radi</h1>');
});

// start server
app.listen(PORT, () => console.log(`Listening on port: http://localhost:${PORT}`));
