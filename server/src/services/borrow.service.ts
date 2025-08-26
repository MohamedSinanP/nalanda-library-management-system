import { BorrowRepository } from "../repositories/borrow.repository";
import { BookRepository } from "../repositories/book.repository";
import IBorrowService from "../interfaces/services/borrow.service";
import { HttpError } from "../utils/http.error";
import { StatusCode } from "../types/type";
import { Types } from "mongoose";
import { BorrowDTO } from "../dtos/borrow.dto";

export class BorrowService implements IBorrowService {
  constructor(
    private _borrowRepo: BorrowRepository,
    private _bookRepo: BookRepository
  ) { }

  async borrowBook(userId: string, bookId: string): Promise<BorrowDTO> {
    try {
      const book = await this._bookRepo.findById(bookId);
      if (!book) throw new HttpError(StatusCode.NOT_FOUND, "Book not found");
      if (book.copies <= 0)
        throw new HttpError(StatusCode.BAD_REQUEST, "No copies available");

      await this._bookRepo.update(bookId, { copies: book.copies - 1 });

      const borrowRecord = await this._borrowRepo.create({
        user: new Types.ObjectId(userId),
        book: new Types.ObjectId(bookId),
      });

      // Populate user and book
      const populatedBorrow = await this._borrowRepo.findById(String(borrowRecord._id), [
        { path: "user", select: "name email role" },
        { path: "book", select: "title author isbn publicationDate totalCopies copies createdAt updatedAt" },
      ]);

      return new BorrowDTO(populatedBorrow!);
    } catch (err: any) {
      if (err instanceof HttpError) throw err;
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to borrow book", err);
    }
  }

  async returnBook(userId: string, bookId: string): Promise<BorrowDTO> {
    try {
      const record = await this._borrowRepo.findActiveBorrow(userId, bookId);
      if (!record)
        throw new HttpError(StatusCode.NOT_FOUND, "No active borrow found");

      await this._borrowRepo.updateByFilter(
        { _id: record._id },
        { returnDate: new Date() }
      );

      // Increase book copies
      const book = await this._bookRepo.findById(bookId);
      if (book) await this._bookRepo.update(bookId, { copies: book.copies + 1 });

      // Fetch updated record with populated fields
      const updatedBorrow = await this._borrowRepo.findById(String(record._id), [
        { path: "user", select: "name email role" },
        { path: "book", select: "title author isbn publicationDate totalCopies copies createdAt updatedAt" },
      ]);

      return new BorrowDTO(updatedBorrow!);
    } catch (err: any) {
      if (err instanceof HttpError) throw err;
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to return book", err);
    }
  }

  async getBorrowHistory(userId: string): Promise<BorrowDTO[]> {
    try {
      const records = await this._borrowRepo.findAll(
        { user: userId },
        [
          { path: "user", select: "name email role" },
          { path: "book", select: "title author isbn publicationDate totalCopies copies createdAt updatedAt" },
        ]
      );

      return records.map((borrow) => new BorrowDTO(borrow));
    } catch (err: any) {
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to fetch borrow history", err);
    }
  }
  async getBorrowedBookIds(userId: string): Promise<string[]> {
    const borrows = await this._borrowRepo.getActiveBorrowsByUser(userId);
    return borrows.map(b => b.book.toString());
  }
}

const borrowRepo = new BorrowRepository();
const bookRepo = new BookRepository();
export const borrowService = new BorrowService(borrowRepo, bookRepo);
