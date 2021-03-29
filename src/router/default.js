const express = require('express');
const { home, sendMessage } = require('../controllers/defaultController');
const router = express.Router();

router.get('/', home);
router.post('/contact', sendMessage);

module.exports = router;
