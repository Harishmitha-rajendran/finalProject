const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const eventController = require('../Controllers/eventController');
const registrationController = require('../Controllers/registrationController');
const isAdminController = require('../Controllers/isAdminController');
const interestController = require('../Controllers/interestController');

router.post('/login', userController.login);
router.post('/createUser', userController.createUser);
router.post('/resetPassword', userController.resetPassword);
router.post('/sendVerificationMail', userController.sendVerificationMail);
router.post('/addEvent', eventController.addEvent);
router.get('/events', eventController.getAllEvents);
router.put('/events/:id', eventController.updateEvent);
router.post('/registrations', registrationController.registerEvent)
router.get('/adminStatus/:id', isAdminController.checkAdminStatus);
router.post('/interests/like', interestController.addLike);
router.get('/registrations/:eventId/:userId', registrationController.checkRegistration);
router.get('/registeredevents/:userId', registrationController.getRegisteredEvents);

module.exports = router;