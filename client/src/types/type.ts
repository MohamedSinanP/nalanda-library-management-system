export type User = {
  name: string;
  email: string;
  role: 'Admin' | 'Member';
};

export type Auth = {
  user: User | null;
  accessToken: string | null;
};

export type UserFormData = {
  name: string;
  email: string;
  role: 'Admin' | 'Member';
  password: string;
}

////////////////// sign up types //////////////////////////

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'Member' | 'Admin';
}

export interface SignupErrors {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  server?: string;
}

export interface SignupApiResponse {
  success: boolean;
  data: {
    user?: User;
    accessToken: string;
  }
  message?: string;
}

// Define interfaces for form data, errors, and API response in Login Componenet
export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginErrors {
  email: string;
  password: string;
  server?: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    accessToken?: string;
    user?: User;
  }
  message?: string;
}


/////////////////// Book & Borrow realted Types //////////////////////////////////

export interface PaginatedBooksResponse {
  success: boolean;
  data: {
    data: BookType[];
    total: number;
  };
  message?: string;
}

export interface BookResponse {
  success: boolean;
  book?: BookType;
  message?: string;
}

export interface BackendResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface BookType {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publicationDate: string;
  genre: string;
  totalCopies: number;
  copies: number;
}

export interface PaginatedBooksData {
  data: BookType[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

// borrow related types
export interface BorrowType {
  id: string | number;
  book: BookType | string;
  borrowDate: string | Date;
  returnDate?: string | Date | null;
  createdAt: string | Date;
}



export interface PaginatedBooksResponse {
  books: BookType[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MostBorrowedBook {
  title: string;
  author: string;
  borrowCount: number;
}

export interface ActiveMember {
  name: string;
  email: string;
  borrowCount: number;
}

export interface BookAvailability {
  totalBooks: number;
  borrowedBooks: number;
  availableBooks: number;
}

export interface BorrowRecord {
  id: string;
  book: BookType;
  borrowDate: string;
  dueDate: string;
  createdAt: Date;
}