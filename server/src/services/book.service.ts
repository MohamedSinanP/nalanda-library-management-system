// src/services/book.service.ts
import { BookRepository } from "../repositories/book.repository";
import IBookService from "../interfaces/services/book.service";
import { IBook, IBookModel } from "../types/book";
import { StatusCode } from "../types/type";
import { HttpError } from "../utils/http.error";

export class BookService implements IBookService {
  constructor(private bookRepo: BookRepository) { }

  async addBook(data: IBook): Promise<IBookModel> {
    try {
      const book = await this.bookRepo.create(data);
      return book;
    } catch (err) {
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to add book", err);
    }
  }

  async updateBook(id: string, data: Partial<IBook>): Promise<IBookModel> {
    try {
      const updatedBook = await this.bookRepo.update(id, data);
      if (!updatedBook) {
        throw new HttpError(StatusCode.NOT_FOUND, "Book not found");
      }
      return updatedBook;
    } catch (err) {
      if (err instanceof HttpError) throw err;
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to update book", err);
    }
  }

  async deleteBook(id: string): Promise<boolean> {
    try {
      const deleted = await this.bookRepo.delete(id);
      if (!deleted) {
        throw new HttpError(StatusCode.NOT_FOUND, "Book not found");
      }
      return deleted;
    } catch (err) {
      if (err instanceof HttpError) throw err;
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to delete book", err);
    }
  }

  async getBookById(id: string): Promise<IBookModel> {
    try {
      const book = await this.bookRepo.findById(id);
      if (!book) {
        throw new HttpError(StatusCode.NOT_FOUND, "Book not found");
      }
      return book;
    } catch (err) {
      if (err instanceof HttpError) throw err;
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to fetch book", err);
    }
  }

  async listBooks(
    page: number,
    limit: number,
    filter?: any
  ): Promise<{ data: IBookModel[]; total: number }> {
    try {
      const result = await this.bookRepo.findPaginated(page, limit, filter);
      return result;
    } catch (err) {
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to list books", err);
    }
  }
}

const bookRepo = new BookRepository();
export const bookService = new BookService(bookRepo);
