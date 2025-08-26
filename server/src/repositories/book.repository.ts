import IBookRepository from "../interfaces/repositories/book.repository";
import { Book } from "../models/book.model";
import { IBookModel } from "../types/book";
import { BaseRepository } from "./base.repository";

export class BookRepository extends BaseRepository<IBookModel> implements IBookRepository {
  constructor() {
    super(Book);
  }

  async findPaginated(
    page: number,
    limit: number,
    search: string
  ): Promise<{ data: IBookModel[]; total: number }> {
    const skip = (page - 1) * limit;

    const searchQuery = search
      ? {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { author: { $regex: search, $options: "i" } },
          { genre: { $regex: search, $options: "i" } },
        ],
      }
      : {};

    const data = await this.model.find(searchQuery).skip(skip).limit(limit);
    const total = await this.model.countDocuments(searchQuery);

    return { data, total };
  }
  async countDocuments() {
    return await this.model.countDocuments();
  }
  async getBookAvailabilitySummary() {
    const result = await Book.aggregate([
      {
        $group: {
          _id: null,
          totalBooks: { $sum: "$totalCopies" },
          availableBooks: { $sum: "$copies" }
        }
      },
      {
        $project: {
          _id: 0,
          totalBooks: 1,
          availableBooks: 1,
          borrowedBooks: { $subtract: ["$totalBooks", "$availableBooks"] }
        }
      }
    ]);

    return result[0] || { totalBooks: 0, availableBooks: 0, borrowedBooks: 0 };
  }


}
