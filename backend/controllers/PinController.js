const Pin = require('../models/Pins');

// Add a new pin
const addPin = async (req, res) => {
    const newPin = new Pin(req.body);
    try {
        const savedPin = await newPin.save();
        res.status(200).json(savedPin);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get all pins
const getAllPins = async (req, res) => {
    try {
        const pins = await Pin.find();
        res.status(200).json(pins);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = { addPin, getAllPins };