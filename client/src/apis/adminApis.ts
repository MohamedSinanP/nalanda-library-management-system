import type { BackendResponse, BookType, PaginatedBooksData } from '../types/type';
import api from './api';


export const getBooks = async (page: number, limit: number) => {
  try {
    const response = await api.get<BackendResponse<PaginatedBooksData>>('/book/admin-book', {
      params: { page, limit },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch books');
    }

    // Return the entire response so the component can access response.data.data
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch books');
  }
};

export const addBook = async (data: Partial<BookType>): Promise<BookType> => {
  try {
    const response = await api.post<BackendResponse<BookType>>('/book', data);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to add book');
    }

    // Return the book data directly (response.data.data contains the book)
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to add book');
  }
};

export const updateBook = async (id: string, data: Partial<BookType>): Promise<BookType> => {
  try {
    const response = await api.put<BackendResponse<BookType>>(`/book/${id}`, data);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update book');
    }

    // Return the updated book data directly
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to update book');
  }
};

export const deleteBook = async (id: string): Promise<boolean> => {
  try {
    const response = await api.delete<BackendResponse<null>>(`/book/${id}`);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete book');
    }

    return true;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to delete book');
  }
};