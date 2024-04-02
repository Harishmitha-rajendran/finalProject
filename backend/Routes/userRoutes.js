const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const eventController = require('../Controllers/eventController');

router.post('/login', userController.login);
router.post('/createUser', userController.createUser);
router.post('/resetPassword', userController.resetPassword);
router.post('/addEvent', eventController.addEvent);

module.exports = router;
