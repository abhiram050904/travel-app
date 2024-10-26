// routes/pinRoutes.js
const express = require('express');
const router = express.Router();
const { addPin, getAllPins } = require('../controllers/PinController');

// Route to add a new pin
router.post('/add', addPin);

// Route to get all pins
router.get('/getall', getAllPins);

module.exports = router;
