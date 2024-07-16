// routes/auth.js
const express = require('express');
const { request, verify, register } = require('../services/authController');

const router = express.Router();

router.post('/request-message', request);
router.post('/sign-message', verify);
router.post('/register', register);

module.exports = router;
