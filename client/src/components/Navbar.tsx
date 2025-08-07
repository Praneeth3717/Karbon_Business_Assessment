import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  name?: string;
  userId?: string;
}

const Navbar: React.FC = () => {
  const [userName, setUserName] = useState<string | undefined>('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');

    if (token) {
      try {
        const user: DecodedToken = jwtDecode(token);
        setUserName(user.name);
        navigate('/home');
      } catch (error) {
        console.error('Invalid token:', error);
        Cookies.remove('token');
        navigate('/');
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Notepad</h1>
          </div>

          <div className="flex items-center space-x-6">
            <div className='flex justify-center items-center space-x-2'>
              <div className="w-8 h-8 text-white bg-blue-600 rounded-full flex items-center justify-center">
                <FaUserCircle className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-700">{userName}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FaSignOutAlt className="w-5 h-5" />
              <span>Logout</span>
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
