import { BorrowRepository } from "../repositories/borrow.repository";
import { UserRepository } from "../repositories/user.repository";
import { BookRepository } from "../repositories/book.repository";
import IReportService from "../interfaces/services/report.service";

export class ReportService implements IReportService {
  constructor(
    private _borrowRepo: BorrowRepository,
    private _bookRepo: BookRepository
  ) { }

  async mostBorrowedBooks(limit = 10) {
    return this._borrowRepo.mostBorrowedBooks(limit);
  }

  async activeMembers(limit = 10) {
    return this._borrowRepo.activeMembers(limit);
  }

  async bookAvailabilitySummary() {
    return await this._bookRepo.getBookAvailabilitySummary();
  }
}

const borrowRepo = new BorrowRepository();
const bookRepo = new BookRepository();
export const reportService = new ReportService(borrowRepo, bookRepo);