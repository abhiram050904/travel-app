import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Map1 from './components/Map1';
import Login from './components/Login'; // Your login component
import Register from './components/Register'; // Your register component

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem('user'); // Assuming you stored the user in localStorage
        if (user) {
            setIsLoggedIn(true); // User exists in localStorage
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Map1 />} />
                <Route path="/map" element={isLoggedIn ? <Map1 /> : <Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
};

export default App;
