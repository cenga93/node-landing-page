const Message = require('../models/message');
const mongoose = require('mongoose');

module.exports.home = (req, res) => {
  res.render('pages/home', {
    title: 'Landing page',
  });
};

module.exports.sendMessage = (req, res) => {
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
};
