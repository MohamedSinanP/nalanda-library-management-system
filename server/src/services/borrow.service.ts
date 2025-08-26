// src/services/borrow.service.ts
import { BorrowRepository } from "../repositories/borrow.repository";
import { BookRepository } from "../repositories/book.repository";
import IBorrowService from "../interfaces/services/borrow.service";
import { IBorrowModel } from "../types/borrow";
import { HttpError } from "../utils/http.error";
import { StatusCode } from "../types/type";
import { Types } from "mongoose";

export class BorrowService implements IBorrowService {
  constructor(
    private borrowRepo: BorrowRepository,
    private bookRepo: BookRepository
  ) { }

  async borrowBook(userId: string, bookId: string): Promise<IBorrowModel> {
    try {
      const book = await this.bookRepo.findById(bookId);
      if (!book) throw new HttpError(StatusCode.NOT_FOUND, "Book not found");
      if (book.copies <= 0)
        throw new HttpError(StatusCode.BAD_REQUEST, "No copies available");

      await this.bookRepo.update(bookId, { copies: book.copies - 1 });

      return await this.borrowRepo.create({
        user: new Types.ObjectId(userId),
        book: new Types.ObjectId(bookId),
      });
    } catch (err: any) {
      if (err instanceof HttpError) throw err;
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to borrow book", err);
    }
  }

  async returnBook(userId: string, bookId: string): Promise<IBorrowModel | null> {
    try {
      const record = await this.borrowRepo.findActiveBorrow(userId, bookId);
      if (!record)
        throw new HttpError(StatusCode.NOT_FOUND, "No active borrow found");

      await this.borrowRepo.updateByFilter(
        { _id: record._id },
        { returnDate: new Date() }
      );

      // Increase book copies
      const book = await this.bookRepo.findById(bookId);
      if (book) await this.bookRepo.update(bookId, { copies: book.copies + 1 });

      // Fetch updated record with populate
      return await this.borrowRepo.findById(String(record._id), [
        { path: "book", select: "title author isbn" },
      ]);
    } catch (err: any) {
      if (err instanceof HttpError) throw err;
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to return book", err);
    }
  }

  async getBorrowHistory(userId: string): Promise<IBorrowModel[]> {
    try {
      return await this.borrowRepo.findAll(
        { user: userId },
        [{ path: "book", select: "title author isbn" }]
      );
    } catch (err: any) {
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to fetch borrow history", err);
    }
  }
}

const borrowRepo = new BorrowRepository();
const bookRepo = new BookRepository();
export const borrowService = new BorrowService(borrowRepo, bookRepo);
