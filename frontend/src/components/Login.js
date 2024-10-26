import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { LoginRoute } from './ApiRoutes'; // Update with your actual login route

const Login = ({ onClose = () => {} }) => { // Default to empty function
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

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
        try {
            const response = await axios.post(LoginRoute, formData);
            if (response.data.status) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setSuccessMessage('Login successful!');
                setErrorMessage('');
                navigate('/'); // Navigate to home page on successful login
            } else {
                setErrorMessage(response.data.msg);
                setSuccessMessage('');
            }
        } catch (err) {
            setErrorMessage('Login failed. Please try again.');
            setSuccessMessage('');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onClose(); // Call the onClose function passed as prop
        navigate('/'); // Navigate to the /map page when closing
    };

    const handleRegisterClick = () => {
        navigate('/register'); // Navigate to the register page
    };

    return (
        <ModalContainer>
            <FormContainer onSubmit={handleSubmit}>
                <h2>Login</h2>
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
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <button type="button" onClick={handleClose} className="close-button">Close</button>
                <RegisterMessage>
                    <p>Don't have an account? <span className="register-link" onClick={handleRegisterClick}>Register</span></p>
                </RegisterMessage>
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

const RegisterMessage = styled.div`
    text-align: center;
    margin-top: 10px;

    .register-link {
        color: green;
        cursor: pointer;
        text-decoration: underline; /* Optional: adds underline to link */
    }

    .register-link:hover {
        text-decoration: none; /* Optional: removes underline on hover */
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

export default Login;
