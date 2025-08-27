import { BorrowRepository } from "../repositories/borrow.repository.js";
import { BookRepository } from "../repositories/book.repository.js";
import IReportService from "../interfaces/services/report.service.js";

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