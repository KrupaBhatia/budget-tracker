import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');  // Clear any existing errors

    try {
      // Send request to backend to create a new user
      const response = await axios.post(
        'http://127.0.0.1:8000/api/signup/',
        { username, password },
        { headers: { Authorization: undefined } } // Explicitly remove Authorization header
      );

      // If user creation is successful, navigate to the login page or login directly
      if (response.status === 201) {
        navigate('/login'); // Navigate to login after successful registration
      }
    } catch (err) {
      console.error(err);
      setError('Error creating user. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transition-all duration-300">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Create a New Account</h1>
          <p className="text-gray-500">Enter your details to sign up</p>
        </div>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold shadow-md transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <div className="text-sm text-center text-gray-500 mt-6">
          Already have an account? 
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate('/login')} // Navigate to login page if user already has an account
          >
            Log In
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;
