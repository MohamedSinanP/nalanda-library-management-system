import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Book,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { RootState } from '../redux/store';
import { setAuth } from '../redux/slices/authSlice';
import Navbar from '../components/Navbar';
import {
  getBooks,
  getMostBorrowedBooks,
  getActiveMembers,
  getBookAvailability,
  borrowBook,
  returnBook,
  getGenres,
  getAuthors,
  getBorrowStatus,
} from '../apis/memberApis';
import type { MostBorrowedBook, ActiveMember, BookAvailability } from '../types/type';
import type { BookType } from '../types/type';

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const Homepage = () => {
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const role = user?.role;

  // State for books with pagination
  const [books, setBooks] = useState<BookType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [booksPerPage] = useState(10);

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // State for reports
  const [mostBorrowed, setMostBorrowed] = useState<MostBorrowedBook[]>([]);
  const [activeMembers, setActiveMembers] = useState<ActiveMember[]>([]);
  const [availability, setAvailability] = useState<BookAvailability>({
    totalBooks: 0,
    borrowedBooks: 0,
    availableBooks: 0,
  });

  // State for borrowed book IDs
  const [borrowedBookIds, setBorrowedBookIds] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Toast configuration
  const toastOptions = {
    position: "top-right" as const,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light" as const,
  };

  // Fetch filter options (genres and authors)
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [genresRes, authorsRes] = await Promise.all([
          getGenres(),
          getAuthors()
        ]);
        setGenres(genresRes.data || []);
        setAuthors(authorsRes.data || []);
      } catch (err) {
        console.error('Failed to fetch filter options:', err);
        toast.error('Failed to fetch filter options', toastOptions);
      }
    };

    fetchFilterOptions(); // Fetch filter options regardless of login status
  }, []);

  // Fetch borrowed book IDs (only for logged-in members)
  useEffect(() => {
    const fetchBorrowStatus = async () => {
      try {
        const response = await getBorrowStatus();
        setBorrowedBookIds(response.data || []);
      } catch (err) {
        console.error('Failed to fetch borrow status:', err);
        toast.error('Failed to fetch borrow status', toastOptions);
      }
    };

    if (accessToken && role === 'Member') {
      fetchBorrowStatus();
    }
  }, [accessToken, role]);

  // Fetch books with current filters and pagination
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const filters: any = {};

      if (debouncedSearchTerm) filters.search = debouncedSearchTerm;
      if (selectedGenre) filters.genre = selectedGenre;
      if (selectedAuthor) filters.author = selectedAuthor;

      const response = await getBooks(currentPage, booksPerPage, filters);
      setBooks(response.data.books || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalBooks(response.data.total || 0);
    } catch (err: any) {
      if (err.message.includes('401') || err.message.includes('unauthorized')) {
        dispatch(setAuth({ user: null, accessToken: null }));
        toast.error('Session expired. Please log in again.', toastOptions);
      }
      setError(err.message);
      toast.error(err.message || 'Failed to fetch books', toastOptions);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, selectedGenre, selectedAuthor, dispatch]);

  // Fetch reports data (optional, keep conditional if API requires authentication)
  const fetchReports = async () => {
    try {
      const [mostBorrowedRes, activeMembersRes, availabilityRes] = await Promise.all([
        getMostBorrowedBooks(5),
        getActiveMembers(5),
        getBookAvailability()
      ]);

      setMostBorrowed(mostBorrowedRes.data || []);
      setActiveMembers(activeMembersRes.data || []);
      setAvailability(availabilityRes.data || {
        totalBooks: 0,
        borrowedBooks: 0,
        availableBooks: 0,
      });
    } catch (err: any) {
      console.error('Failed to fetch reports:', err);
      toast.error('Failed to fetch reports', toastOptions);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchBooks(); // Fetch books regardless of login status
    if (accessToken) {
      fetchReports(); // Fetch reports only for logged-in users
    }
  }, [fetchBooks, accessToken]);

  // Handle borrow book
  const handleBorrow = async (bookId: string) => {
    if (!accessToken || role !== 'Member') {
      toast.error('Please log in as a member to borrow books', toastOptions);
      return;
    }

    try {
      setLoading(true);
      await borrowBook(bookId);

      await Promise.all([fetchBooks(), fetchReports(), getBorrowStatus().then(res => setBorrowedBookIds(res.data || []))]);

      toast.success('Book borrowed successfully!', toastOptions);
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to borrow book: ${err.message}`, toastOptions);
    } finally {
      setLoading(false);
    }
  };

  // Handle return book
  const handleReturn = async (bookId: string) => {
    if (!accessToken || role !== 'Member') {
      toast.error('Please log in as a member to return books', toastOptions);
      return;
    }

    try {
      setLoading(true);
      await returnBook(bookId);

      await Promise.all([fetchBooks(), fetchReports(), getBorrowStatus().then(res => setBorrowedBookIds(res.data || []))]);

      toast.success('Book returned successfully!', toastOptions);
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to return book: ${err.message}`, toastOptions);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks();
  };

  // Handle filter changes
  const handleFilterChange = (filterType: 'genre' | 'author', value: string) => {
    if (filterType === 'genre') {
      setSelectedGenre(value);
    } else {
      setSelectedAuthor(value);
    }
    setCurrentPage(1);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setSelectedAuthor('');
    setCurrentPage(1);
  };

  if (loading && books.length === 0) {
    return (
      <>
        <Navbar />
        <div className="text-center py-10">Loading...</div>
        <ToastContainer />
      </>
    );
  }

  if (error && books.length === 0) {
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
            <h1 className="text-4xl font-bold text-blue-900 mb-2">Nalanda Library</h1>
            {user ? (
              <>
                <p className="text-blue-600 text-lg font-medium">Welcome, {user.name}</p>
                <p className="text-gray-600 mt-2">Role: {role}</p>
              </>
            ) : (
              <p className="text-blue-600 text-lg font-medium">Welcome, Guest</p>
            )}
          </div>

          {/* Book Availability Summary */}
          {availability.totalBooks > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">Book Availability</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-100 rounded-lg text-center">
                  <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-xl font-semibold">{availability.totalBooks}</p>
                  <p>Total Books</p>
                </div>
                <div className="p-4 bg-red-100 rounded-lg text-center">
                  <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-xl font-semibold">{availability.borrowedBooks}</p>
                  <p>Borrowed Books</p>
                </div>
                <div className="p-4 bg-green-100 rounded-lg text-center">
                  <Book className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-xl font-semibold">{availability.availableBooks}</p>
                  <p>Available Books</p>
                </div>
              </div>
            </div>
          )}

          {/* Reports Row */}
          {(mostBorrowed.length > 0 || activeMembers.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Most Borrowed Books */}
              {mostBorrowed.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-blue-900 mb-4">Most Borrowed Books</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-blue-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Title</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Author</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Count</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mostBorrowed.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">{item.title}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">{item.author}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">{item.borrowCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Active Members */}
              {activeMembers.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-blue-900 mb-4">Active Members</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-blue-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Count</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {activeMembers.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">{item.name}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">{item.borrowCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Books Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900">All Books</h2>
              <div className="flex gap-4">
                {role === 'Admin' && (
                  <Link
                    to="/books"
                    className="py-2 px-4 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-all"
                  >
                    Manage Books
                  </Link>
                )}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="py-2 px-4 bg-gray-600 text-white rounded-lg shadow-sm hover:bg-gray-700 transition-all flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search books by title, author, or ISBN..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Search
                  </button>
                </div>
              </form>

              {showFilters && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                      <select
                        value={selectedGenre}
                        onChange={(e) => handleFilterChange('genre', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">All Genres</option>
                        {genres.map((genre) => (
                          <option key={genre} value={genre}>{genre}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                      <select
                        value={selectedAuthor}
                        onChange={(e) => handleFilterChange('author', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">All Authors</option>
                        {authors.map((author) => (
                          <option key={author} value={author}>{author}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={clearFilters}
                        className="w-full py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Books Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">ISBN</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Genre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Available</th>
                    {role === 'Member' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {books.map((book) => (
                    <tr key={book.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{book.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{book.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{book.isbn}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{book.genre}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {book.copies} / {book.totalCopies}
                      </td>
                      {role === 'Member' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          {borrowedBookIds.includes(book.id) ? (
                            <button
                              onClick={() => handleReturn(book.id)}
                              className="py-1 px-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                              disabled={loading}
                            >
                              {loading ? 'Returning...' : 'Return'}
                            </button>
                          ) : book.copies > 0 ? (
                            <button
                              onClick={() => handleBorrow(book.id)}
                              className="py-1 px-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                              disabled={loading}
                            >
                              {loading ? 'Borrowing...' : 'Borrow'}
                            </button>
                          ) : (
                            <span className="text-red-500">Unavailable</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * booksPerPage) + 1} to {Math.min(currentPage * booksPerPage, totalBooks)} of {totalBooks} books
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Homepage;