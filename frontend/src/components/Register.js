import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { RegisterRoute } from './ApiRoutes';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Register = ({ onClose }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await axios.post(RegisterRoute, formData);
            setSuccessMessage('Registration successful! You can now log in.');

            // Save user data to localStorage
            const { user } = response.data; // Assuming your backend returns the user object
            localStorage.setItem('user', JSON.stringify(user));

            // Clear form data
            setFormData({ username: '', email: '', password: '' });

            // Navigate to map page after successful registration
            setTimeout(() => {
                navigate('/map'); // Navigate to the map page
                if (onClose) onClose(); // Close modal after delay
            }, 2000);
        } catch (error) {
            if (error.response) {
                // Backend responded with an error
                setErrorMessage(error.response.data.msg || 'Registration failed. Please try again.');
            } else {
                // Network error or other issues
                setErrorMessage('An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login'); // Navigate to login page
        if (onClose) onClose(); // Close modal if onClose is a function
    };

    const handleClose = () => {
        navigate('/map'); // Navigate to map page
        if (onClose) onClose(); // Close the modal
    };

    return (
        <ModalContainer>
            <FormContainer onSubmit={handleSubmit}>
                <h2>Register</h2>
                {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                />
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
                <button type="button" onClick={handleClose} className="close-button">Close</button>
                
                {/* Have an account? Login prompt */}
                <LoginPrompt>
                    <span>Have an account? </span>
                    <LoginLink onClick={handleLoginRedirect}>Login</LoginLink>
                </LoginPrompt>
            </FormContainer>
        </ModalContainer>
    );
};

const ModalContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const FormContainer = styled.form`
    background: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 300px;

    h2 {
        margin-bottom: 15px;
    }

    label {
        margin-bottom: 5px;
        display: block;
    }

    input {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    button {
        padding: 10px;
        width: 100%;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .close-button {
        background: #f44336;
        color: white;
        margin-top: 10px;
    }
`;

const ErrorMessage = styled.div`
    color: red;
    margin-bottom: 10px;
`;

const SuccessMessage = styled.div`
    color: green;
    margin-bottom: 10px;
`;

const LoginPrompt = styled.div`
    margin-top: 15px;
    text-align: center;
`;

const LoginLink = styled.span`
    color: green;
    cursor: pointer;
    text-decoration: underline;

    &:hover {
        text-decoration: none; // Remove underline on hover
    }
`;

export default Register;
