import { IBookModel } from "../../types/book";
import IBaseRepository from "./base.repository";

export default interface IBookRepository extends IBaseRepository<IBookModel> {
  findPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ data: IBookModel[]; total: number }>;

  countDocuments(): Promise<number>;

  getBookAvailabilitySummary(): Promise<{
    totalBooks: number;
    availableBooks: number;
    borrowedBooks: number;
  }>;
}
