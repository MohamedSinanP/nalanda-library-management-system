import type { ActiveMember, BackendResponse, BookAvailability, BorrowRecord, MostBorrowedBook, PaginatedBooksResponse } from '../types/type';
import api from './api';

// Get all books with pagination and optional filtering
export const getBooks = async (page: number = 1, limit: number = 10, filters?: {
  genre?: string;
  author?: string;
  search?: string;
}) => {
  try {
    const params: any = { page, limit };

    if (filters?.genre) params.genre = filters.genre;
    if (filters?.author) params.author = filters.author;
    if (filters?.search) params.search = filters.search;

    const response = await api.get<BackendResponse<PaginatedBooksResponse>>('/book', {
      params,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch books');
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch books');
  }
};

// Get most borrowed books
export const getMostBorrowedBooks = async (limit: number = 10) => {
  try {
    const response = await api.get<BackendResponse<MostBorrowedBook[]>>('/report/most-borrowed', {
      params: { limit },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch most borrowed books');
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch most borrowed books');
  }
};

// Get active members
export const getActiveMembers = async (limit: number = 10) => {
  try {
    const response = await api.get<BackendResponse<ActiveMember[]>>('/report/active-members', {
      params: { limit },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch active members');
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch active members');
  }
};

// Get book availability summary
export const getBookAvailability = async () => {
  try {
    const response = await api.get<BackendResponse<BookAvailability>>('/report/book-availability');

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch book availability');
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch book availability');
  }
};

// Borrow a book
export const borrowBook = async (bookId: string) => {
  try {
    const response = await api.post<BackendResponse<BorrowRecord>>(`/borrow/borrow/${bookId}`, {
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to borrow book');
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to borrow book');
  }
};

// Return a book
export const returnBook = async (bookId: string) => {
  try {
    const response = await api.post<BackendResponse<BorrowRecord>>(`/borrow/return/${bookId}`, {

    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to return book');
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to return book');
  }
};

// Get user's borrow history
export const getBorrowHistory = async () => {
  try {
    const response = await api.get<BackendResponse<BorrowRecord[]>>('/borrow/history');

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch borrow history');
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch borrow history');
  }
};

export const getBorrowStatus = async () => {
  try {
    const response = await api.get<BackendResponse<string[]>>('/borrow/status');

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch genres');
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch genres');
  }
};

// Get available genres for filtering
export const getGenres = async () => {
  try {
    const response = await api.get<BackendResponse<string[]>>('/book/genres');
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch genres');
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch genres');
  }
};

// Get available authors for filtering
export const getAuthors = async () => {
  try {
    const response = await api.get<BackendResponse<string[]>>('/book/authors');
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch authors');
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch authors');
  }
};
export const getBorrowedHistory = async () => {
  try {
    const response = await api.get<BackendResponse<string[]>>('/borrow/history');
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch authors');
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch authors');
  }
};