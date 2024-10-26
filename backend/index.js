// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

// Middleware
app.use(express.json());
app.use(cors());
// Database connection
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Database connected"))
    .catch((err) => console.error("Database connection error:", err));

// Import routes
const pinRoutes = require('./Routes/PinsRoutes');
app.use('/api/v1', pinRoutes);

const AuthRoutes=require('./Routes/UserRoutes')
app.use('/api/v1/auth',AuthRoutes);
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
