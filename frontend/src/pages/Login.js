import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;

        // Validate email and password fields
        if (!email || !password) {
            return handleError('Email and password are required');
        }

        try {
            const url = `http://localhost:8080/auth/login`; // Use your local backend server URL
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });

            // Check if the response is ok
            if (!response.ok) {
                const errorData = await response.json(); // Attempt to get error details
                return handleError(errorData.message || 'Login failed'); // Show the error message
            }

            const result = await response.json();
            const { success, message, jwtToken, name } = result;

            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                setTimeout(() => {
                    navigate('/home');
                }, 1000);
            } else {
                handleError(message); // Handle error from result if any
            }
        } catch (err) {
            console.error(err); // Log the error for debugging
            handleError('Error connecting to the server');
        }
    };

    return (
        <div className='container'>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        placeholder='Enter your email...'
                        value={loginInfo.email}
                        required // Ensures the field must be filled out
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        placeholder='Enter your password...'
                        value={loginInfo.password}
                        required // Ensures the field must be filled out
                    />
                </div>
                <button type='submit'>Login</button>
                <span>Don't have an account? 
                    <Link to="/signup">Signup</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Login;
