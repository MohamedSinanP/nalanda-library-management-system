import { BookDTO } from "../../dtos/book.dto.js";
import { IBook } from "../../types/book.js";

export default interface IBookService {
  addBook(data: IBook, userId: string): Promise<BookDTO>;
  updateBook(id: string, data: Partial<IBook>): Promise<BookDTO | null>;
  deleteBook(id: string): Promise<Boolean | null>;
  getBookById(id: string): Promise<BookDTO | null>;
  listBooks(page: number, limit: number, filter?: any): Promise<{ books: BookDTO[]; total: number }>;
  listBooksByAdmin(adminId: string, page: number, limit: number, search?: string): Promise<{ data: BookDTO[]; total: number }>;
  getGenres(): Promise<string[]>;
  getAuthors(): Promise<string[]>;
}
