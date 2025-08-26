import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { RootState } from '../redux/store';
import { setAuth } from '../redux/slices/authSlice';
import Navbar from '../components/Navbar';
import { getBorrowHistory } from '../apis/memberApis';
import type { BackendResponse, BorrowType } from '../types/type';

const BorrowHistory = () => {
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = user?.role;

  const [borrowHistory, setBorrowHistory] = useState<BorrowType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Toast configuration
  const toastOptions = {
    position: 'top-right' as const,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'light' as const,
  };

  // Fetch borrow history
  useEffect(() => {
    const fetchBorrowHistory = async () => {
      if (!accessToken || role !== 'Member') {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        const response: BackendResponse<BorrowType[]> = await getBorrowHistory();
        setBorrowHistory(response.data || []);
      } catch (err: any) {
        if (err.message.includes('401') || err.message.includes('unauthorized')) {
          dispatch(setAuth({ user: null, accessToken: null }));
          toast.error('Session expired. Please log in again.', toastOptions);
          navigate('/login');
        } else {
          setError(err.message || 'Failed to fetch borrow history');
          toast.error(err.message || 'Failed to fetch borrow history', toastOptions);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowHistory();
  }, [accessToken, role, dispatch, navigate]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center py-10 text-blue-900">Loading...</div>
        <ToastContainer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="text-red-500 text-center py-10">{error}</div>
        <ToastContainer />
      </>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6 shadow-lg">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-blue-900 mb-2">Borrow History</h1>
            <p className="text-blue-600 text-lg font-medium">Your borrowing records, {user?.name}</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
            >
              Go to Homepage
            </button>
          </div>

          {/* Borrow History Table */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Your Borrow History</h2>
            {borrowHistory.length === 0 ? (
              <p className="text-gray-600 text-center">No borrow history found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Author</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">ISBN</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Borrow Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Return Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Created At</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {borrowHistory.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {typeof record.book === 'string' ? 'N/A' : record.book.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {typeof record.book === 'string' ? 'N/A' : record.book.author}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {typeof record.book === 'string' ? 'N/A' : record.book.isbn}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(record.borrowDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {record.returnDate ? new Date(record.returnDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${record.returnDate ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                              }`}
                          >
                            {record.returnDate ? 'Returned' : 'Borrowed'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(record.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BorrowHistory;