import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut } from 'lucide-react';
import type { RootState } from '../redux/store';
import { removeAuth } from '../redux/slices/authSlice';
import { logout } from '../apis/authApis';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = user?.role;

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(removeAuth());
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || "Logout failed. Please try again.");
    }
  };

  return (
    <nav className="bg-blue-900 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Name */}
        <Link to={'/'} className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full shadow-md">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Nalanda</h1>
            <p className="text-sm text-blue-200">Library Management System</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          {accessToken ? (
            <>
              {role === 'Admin' && (
                <Link
                  to="/books"
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200"
                >
                  Manage Books
                </Link>
              )}
              {role === 'Member' && (
                <Link
                  to="/borrow-history"
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200"
                >
                  Borrow History
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg flex items-center space-x-2 transition-all duration-200 cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav >
  );
};

export default Navbar;