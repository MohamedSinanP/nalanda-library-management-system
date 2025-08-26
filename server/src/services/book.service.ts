// src/services/book.service.ts
import { BookRepository } from "../repositories/book.repository";
import IBookService from "../interfaces/services/book.service";
import { IBook, IBookModel } from "../types/book";
import { StatusCode } from "../types/type";
import { HttpError } from "../utils/http.error";
import { BookDTO } from "../dtos/book.dto";
import { Types } from "mongoose";

export class BookService implements IBookService {
  constructor(private _bookRepo: BookRepository) { }

  async addBook(data: IBook, userId: string): Promise<BookDTO> {
    try {
      const book = await this._bookRepo.create({
        ...data,
        addedBy: new Types.ObjectId(userId)
      });
      return new BookDTO(book);
    } catch (err) {
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to add book", err);
    }
  }

  async updateBook(id: string, data: Partial<IBook>): Promise<BookDTO> {
    try {
      // If addedBy exists and is a string, convert it to ObjectId
      const updateData: Partial<IBookModel> = {
        ...data,
        addedBy: data.addedBy ? new Types.ObjectId(data.addedBy) : undefined,
      };

      const updatedBook = await this._bookRepo.update(id, updateData);
      if (!updatedBook) {
        throw new HttpError(StatusCode.NOT_FOUND, "Book not found");
      }

      return new BookDTO(updatedBook);
    } catch (err) {
      if (err instanceof HttpError) throw err;
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to update book", err);
    }
  }

  async deleteBook(id: string): Promise<boolean> {
    try {
      const deleted = await this._bookRepo.delete(id);
      if (!deleted) {
        throw new HttpError(StatusCode.NOT_FOUND, "Book not found");
      }
      return deleted;
    } catch (err) {
      if (err instanceof HttpError) throw err;
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to delete book", err);
    }
  }

  async getBookById(id: string): Promise<BookDTO> {
    try {
      const book = await this._bookRepo.findById(id);
      if (!book) {
        throw new HttpError(StatusCode.NOT_FOUND, "Book not found");
      }
      return new BookDTO(book);
    } catch (err) {
      if (err instanceof HttpError) throw err;
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to fetch book", err);
    }
  }

  async listBooks(
    page: number,
    limit: number,
    filters: { search?: string; genre?: string; author?: string }
  ): Promise<{ books: BookDTO[]; total: number }> {
    try {
      const result = await this._bookRepo.findPaginated(page, limit, filters);
      const data = result.data.map((book) => new BookDTO(book));
      return { books: data, total: result.total };
    } catch (err) {
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to list books", err);
    }
  }

  async listBooksByAdmin(
    adminId: string,
    page: number,
    limit: number,
    search?: string
  ): Promise<{ data: BookDTO[]; total: number }> {
    try {
      const result = await this._bookRepo.findByAdminPaginated(adminId, page, limit, search);
      const data = result.data.map((book) => new BookDTO(book));
      return { data, total: result.total };
    } catch (err) {
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to list books by admin", err);
    }
  }

  async getGenres(): Promise<string[]> {
    try {
      return await this._bookRepo.getGenres();
    } catch (err) {
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to fetch genres", err);
    }
  }

  async getAuthors(): Promise<string[]> {
    try {
      return await this._bookRepo.getAuthors();
    } catch (err) {
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to fetch authors", err);
    }
  }
}

const bookRepo = new BookRepository();
export const bookService = new BookService(bookRepo);
