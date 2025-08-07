import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';


const Auth: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const resetFields = () => {
    setName('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleLogin = async () => {
  try {
    await api.post('/auth/login', {
      email: username,
      password,
    });

    resetFields();
    navigate('/home');
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    alert(err.response?.data?.message || 'Login failed');
  }
};

const handleRegister = async () => {
  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  try {
    await api.post('/auth/register', {
      name,
      email: username,
      password,
    });

    alert('Registered successfully. Please login.');
    resetFields();
    setIsRegistering(false);
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    alert(err.response?.data?.message || 'Registration failed');
  }
};


  const handleSocialLogin = () => {
    window.location.href = 'https://karbon-business-assessment.onrender.com/auth/google/login';
  };

  return (
    <div
      className="min-h-screen bg-gray-200 flex items-center justify-center p-4 bg-contain"
      style={{ backgroundImage: "url('/bg_1.jpg')" }}
    >
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0 flex justify-center items-center">
            <button
              onClick={handleSocialLogin}
              className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 py-3 px-16 rounded flex items-center justify-center transition-colors"
            >
              <FcGoogle className="w-5 h-5 mr-3" />
              Login with Google
            </button>
          </div>

          <div className="flex lg:flex-col items-center lg:px-4">
            <div className="hidden lg:block w-px bg-gray-300 h-full"></div>
            <div className="lg:hidden w-full h-px bg-gray-300"></div>
            <div className="bg-white px-4 py-2 text-gray-500 text-sm font-medium">OR</div>
            <div className="hidden lg:block w-px bg-gray-300 h-full"></div>
            <div className="lg:hidden w-full h-px bg-gray-300"></div>
          </div>

          <div className="lg:w-1/2 lg:pl-8">
            <h2 className="text-xl font-medium text-gray-600 mb-6">
              {isRegistering ? 'Register' : 'Sign in manually'}
            </h2>

            <div className="space-y-4">
              {isRegistering && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-none rounded text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}

              <input
                type="email"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border-none rounded text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="password"
                placeholder={isRegistering ? 'Create Password' : 'Password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border-none rounded text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {isRegistering && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-none rounded text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}

              <div className="flex items-center justify-between mt-6">
                <div className="text-sm">
                  {isRegistering ? (
                    <>
                      Already have an account?
                      <br />
                      <button
                        onClick={() => {
                          setIsRegistering(false);
                          resetFields();
                        }}
                        className="text-red-500 hover:underline"
                      >
                        Login here
                      </button>
                    </>
                  ) : (
                    <>
                      Don’t have an account?
                      <br />
                      <button
                        onClick={() => {
                          setIsRegistering(true);
                          resetFields();
                        }}
                        className="text-red-500 hover:underline"
                      >
                        Register now
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={isRegistering ? handleRegister : handleLogin}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded font-medium transition-colors"
                >
                  {isRegistering ? 'REGISTER' : 'LOGIN'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
