const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const eventController = require('../Controllers/eventController');
const registrationController = require('../Controllers/registrationController');
const isAdminController = require('../Controllers/isAdminController');
const interestDetailsController = require('../Controllers/interestDetailsController');


router.post('/login', userController.login);
router.post('/createUser', userController.createUser);
router.post('/resetPassword', userController.resetPassword);
router.post('/sendVerificationMail', userController.sendVerificationMail);
router.post('/addEvent', eventController.addEvent);
router.get('/events', eventController.getAllEvents);
router.put('/events/:id', eventController.updateEvent);
router.post('/registrations', registrationController.registerEvent)
router.get('/adminStatus/:id', isAdminController.checkAdminStatus);
router.post('/interestDetails', interestDetailsController.createInterestDetails);

module.exports = router;