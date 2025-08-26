import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash } from 'lucide-react';
import type { RootState } from '../redux/store';
import { setAuth } from '../redux/slices/authSlice';
import Navbar from '../components/Navbar';
import { getBooks, addBook, updateBook, deleteBook } from '../apis/adminApis';

interface BookType {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publicationDate: string;
  genre: string;
  totalCopies: number;
  copies: number;
}

interface FormErrors {
  title?: string;
  author?: string;
  isbn?: string;
  publicationDate?: string;
  genre?: string;
  totalCopies?: string;
  copies?: string;
}

const AdminBookManagement = () => {
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [books, setBooks] = useState<BookType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BookType>>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean;
    bookId: string | null;
    bookTitle: string;
  }>({ show: false, bookId: null, bookTitle: '' });
  const observer = useRef<IntersectionObserver | null>(null);

  // Redirect non-admins
  useEffect(() => {
    if (user?.role !== 'Admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch books with pagination
  const fetchBooks = useCallback(async (pageNum: number) => {
    if (!accessToken || loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await getBooks(pageNum, 10);

      if (pageNum === 1) {
        // First page - replace books
        setBooks(data.data || []);
      } else {
        // Subsequent pages - append books
        setBooks(prevBooks => [...prevBooks, ...(data.data || [])]);
      }

      setTotalBooks(data.total || 0);

      // Check if we have more data to load
      const loadedCount = pageNum === 1 ? (data.data?.length || 0) : books.length + (data.data?.length || 0);
      setHasMore(loadedCount < (data.total || 0));

    } catch (err: any) {
      if (err.message?.includes('401')) {
        dispatch(setAuth({ user: null, accessToken: null }));
        navigate('/login');
      } else {
        setError(err.message || 'Failed to fetch books');
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, dispatch, navigate, loading, hasMore, books.length]);

  // Initial fetch
  useEffect(() => {
    if (accessToken && user?.role === 'Admin') {
      setPage(1);
      setBooks([]);
      setHasMore(true);
      fetchBooks(1);
    }
  }, [accessToken, user?.role]);

  // Handle page changes for infinite scrolling
  useEffect(() => {
    if (page > 1) {
      fetchBooks(page);
    }
  }, [page]);

  // Intersection observer for infinite scrolling
  const lastBookElementRef = useCallback((node: HTMLTableRowElement | null) => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let valid = true;

    if (!formData.title?.trim()) {
      errors.title = 'Title is required';
      valid = false;
    }
    if (!formData.author?.trim()) {
      errors.author = 'Author is required';
      valid = false;
    }
    if (!formData.isbn?.trim()) {
      errors.isbn = 'ISBN is required';
      valid = false;
    } else if (!/^\d{10,13}$/.test(formData.isbn.replace(/\D/g, ''))) {
      errors.isbn = 'ISBN must be 10 or 13 digits';
      valid = false;
    }
    if (!formData.publicationDate) {
      errors.publicationDate = 'Publication date is required';
      valid = false;
    }
    if (!formData.genre?.trim()) {
      errors.genre = 'Genre is required';
      valid = false;
    }

    // Fix number validation - check for null, undefined, empty string, or NaN
    const totalCopies = Number(formData.totalCopies);
    if (isNaN(totalCopies) || totalCopies < 0) {
      errors.totalCopies = 'Total copies must be a non-negative number';
      valid = false;
    }

    // For editing mode, validate available copies
    if (editingId) {
      const copies = Number(formData.copies);
      if (isNaN(copies) || copies < 0) {
        errors.copies = 'Available copies must be a non-negative number';
        valid = false;
      } else if (!isNaN(totalCopies) && copies > totalCopies) {
        errors.copies = 'Available copies cannot exceed total copies';
        valid = false;
      }
    }

    setFormErrors(errors);
    return valid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'copies' || name === 'totalCopies' ? (value === '' ? '' : Number(value)) : value,
    });
    setFormErrors({ ...formErrors, [name]: '' });
  };

  const handleAddOrUpdate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      const payload = {
        title: formData.title!,
        author: formData.author!,
        isbn: formData.isbn!,
        publicationDate: formData.publicationDate!,
        genre: formData.genre!,
        totalCopies: formData.totalCopies!,
        copies: editingId ? formData.copies! : formData.totalCopies!,
      };

      if (editingId) {
        const updatedBook = await updateBook(editingId, payload);
        setBooks(books.map((book) => (book.id === editingId ? updatedBook : book)));
      } else {
        const newBook = await addBook(payload);
        setBooks([newBook, ...books]);
        setTotalBooks(prev => prev + 1);
      }

      // Reset form
      setFormData({});
      setEditingId(null);
      setFormErrors({});
    } catch (err: any) {
      if (err.message?.includes('401')) {
        dispatch(setAuth({ user: null, accessToken: null }));
        navigate('/login');
      } else {
        setError(err.message || 'Failed to save book');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book: BookType) => {
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publicationDate: new Date(book.publicationDate).toISOString().split('T')[0],
      genre: book.genre,
      totalCopies: book.totalCopies,
      copies: book.copies,
    });
    setEditingId(book.id);
    setFormErrors({});
  };

  const handleDelete = (id: string) => {
    // Find the book to get its title for the confirmation message
    const bookToDelete = books.find(book => book.id === id);
    const bookTitle = bookToDelete ? bookToDelete.title : 'this book';

    // Show confirmation modal
    setDeleteConfirmation({
      show: true,
      bookId: id,
      bookTitle: bookTitle
    });
  };

  const confirmDelete = async () => {
    const { bookId } = deleteConfirmation;
    if (!bookId) return;

    try {
      setLoading(true);
      setError(null);
      await deleteBook(bookId);
      setBooks(books.filter((book) => book.id !== bookId));
      setTotalBooks(prev => prev - 1);
    } catch (err: any) {
      if (err.message?.includes('401')) {
        dispatch(setAuth({ user: null, accessToken: null }));
        navigate('/login');
      } else {
        setError(err.message || 'Failed to delete book');
      }
    } finally {
      setLoading(false);
      setDeleteConfirmation({ show: false, bookId: null, bookTitle: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, bookId: null, bookTitle: '' });
  };

  const handleCancelEdit = () => {
    setFormData({});
    setEditingId(null);
    setFormErrors({});
  };

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="text-red-500 text-center py-10">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />
      <div className="p-8">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-900">Manage Books</h1>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Home
            </button>
          </div>

          {/* Book Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                placeholder="Title"
                className={`p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 ${formErrors.title ? 'border-red-500' : 'border-blue-200'}`}
                disabled={loading}
              />
              {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
            </div>
            <div>
              <input
                type="text"
                name="author"
                value={formData.author || ''}
                onChange={handleInputChange}
                placeholder="Author"
                className={`p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 ${formErrors.author ? 'border-red-500' : 'border-blue-200'}`}
                disabled={loading}
              />
              {formErrors.author && <p className="text-red-500 text-sm mt-1">{formErrors.author}</p>}
            </div>
            <div>
              <input
                type="text"
                name="isbn"
                value={formData.isbn || ''}
                onChange={handleInputChange}
                placeholder="ISBN"
                className={`p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 ${formErrors.isbn ? 'border-red-500' : 'border-blue-200'}`}
                disabled={loading}
              />
              {formErrors.isbn && <p className="text-red-500 text-sm mt-1">{formErrors.isbn}</p>}
            </div>
            <div>
              <input
                type="date"
                name="publicationDate"
                value={formData.publicationDate || ''}
                onChange={handleInputChange}
                className={`p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 ${formErrors.publicationDate ? 'border-red-500' : 'border-blue-200'}`}
                disabled={loading}
              />
              {formErrors.publicationDate && <p className="text-red-500 text-sm mt-1">{formErrors.publicationDate}</p>}
            </div>
            <div>
              <input
                type="text"
                name="genre"
                value={formData.genre || ''}
                onChange={handleInputChange}
                placeholder="Genre"
                className={`p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 ${formErrors.genre ? 'border-red-500' : 'border-blue-200'}`}
                disabled={loading}
              />
              {formErrors.genre && <p className="text-red-500 text-sm mt-1">{formErrors.genre}</p>}
            </div>
            <div>
              <input
                type="number"
                name="totalCopies"
                value={formData.totalCopies ?? ''}
                onChange={handleInputChange}
                placeholder="Total Copies"
                min="0"
                className={`p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 ${formErrors.totalCopies ? 'border-red-500' : 'border-blue-200'}`}
                disabled={loading}
              />
              {formErrors.totalCopies && <p className="text-red-500 text-sm mt-1">{formErrors.totalCopies}</p>}
            </div>
            {editingId && (
              <div>
                <input
                  type="number"
                  name="copies"
                  value={formData.copies ?? ''}
                  onChange={handleInputChange}
                  placeholder="Available Copies"
                  min="0"
                  className={`p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 ${formErrors.copies ? 'border-red-500' : 'border-blue-200'}`}
                  disabled={loading}
                />
                {formErrors.copies && <p className="text-red-500 text-sm mt-1">{formErrors.copies}</p>}
              </div>
            )}
            <div className={editingId ? 'flex gap-2' : 'col-span-2'}>
              <button
                onClick={handleAddOrUpdate}
                className={`${editingId ? 'flex-1' : 'w-full'} py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={loading}
              >
                {editingId ? 'Update Book' : 'Add Book'}
              </button>
              {editingId && (
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Total Copies</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Available Copies</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {books.map((book, index) => (
                  <tr
                    key={book.id}
                    ref={index === books.length - 1 ? lastBookElementRef : null}
                    className={editingId === book.id ? 'bg-blue-50' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{book.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{book.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{book.isbn}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{book.genre}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{book.totalCopies}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{book.copies}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                        disabled={loading}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        disabled={loading}
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Loading and Status Messages */}
          {loading && <div className="text-center py-4">Loading more books...</div>}
          {!hasMore && books.length > 0 && (
            <div className="text-center py-4 text-gray-600">All books loaded ({totalBooks} total)</div>
          )}
          {books.length === 0 && !loading && (
            <div className="text-center py-4 text-gray-600">No books found</div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-blue-900 mb-2">Delete Book</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold text-blue-900">"{deleteConfirmation.bookTitle}"</span>?
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookManagement;