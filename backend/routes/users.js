const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// The POST routes your frontend is trying to reach
router.post('/signUp', userController.signUp);
router.post('/login', userController.login);

module.exports = router;
