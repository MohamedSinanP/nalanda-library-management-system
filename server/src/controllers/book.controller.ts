import { NextFunction, Request, Response } from "express";
import { bookService } from "../services/book.service";
import { IBookController } from "../interfaces/controllers/book.controller";
import IBookService from "../interfaces/services/book.service";
import { HttpResponse } from "../utils/http.response";
import { StatusCode } from "../types/type";
import { HttpError } from "../utils/http.error";

export class BookController implements IBookController {
  constructor(private bookService: IBookService) { }

  async addBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body;
      const book = await this.bookService.addBook(data);
      res.status(StatusCode.CREATED).json(HttpResponse.created(book, "Book added successfully"));
    } catch (err) {
      next(err);
    }
  }

  async updateBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedBook = await this.bookService.updateBook(id, data);

      if (!updatedBook) throw new HttpError(StatusCode.NOT_FOUND, "Book not found");

      res.status(StatusCode.OK).json(HttpResponse.success(updatedBook, "Book updated successfully"));
    } catch (err) {
      next(err);
    }
  }

  async deleteBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.bookService.deleteBook(id);

      if (!deleted) throw new HttpError(StatusCode.NOT_FOUND, "Book not found");

      res.status(StatusCode.OK).json(HttpResponse.success(null, "Book deleted successfully"));
    } catch (err) {
      next(err);
    }
  }

  async listBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search?.toString() || "";

      const result = await this.bookService.listBooks(page, limit, search);
      res.status(StatusCode.OK).json(HttpResponse.success(result, "Books fetched successfully"));
    } catch (err) {
      next(err);
    }
  }
}

export const bookController = new BookController(bookService);