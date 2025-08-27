import IBorrowRepository from "../interfaces/repositories/borrow.repository.js";
import { Borrow } from "../models/borrow.model.js";
import { IBorrowModel } from "../types/borrow.js";
import { BaseRepository } from "./base.repository.js";

export class BorrowRepository extends BaseRepository<IBorrowModel> implements IBorrowRepository {
  constructor() {
    super(Borrow);
  }

  async findActiveBorrow(userId: string, bookId: string): Promise<IBorrowModel | null> {
    return this.model.findOne({ user: userId, book: bookId, returnDate: { $exists: false } });
  }

  async mostBorrowedBooks(limit = 10): Promise<
    Array<{ bookId: string; title: string; author: string; borrowCount: number }>
  > {
    const result = await this.model.aggregate([

      { $group: { _id: "$book", borrowCount: { $sum: 1 } } },

      { $sort: { borrowCount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },

      { $unwind: "$bookDetails" },

      {
        $project: {
          bookId: "$_id",
          title: "$bookDetails.title",
          author: "$bookDetails.author",
          borrowCount: 1,
          _id: 0,
        },
      },
    ]);

    return result;
  }

  async activeMembers(limit = 10): Promise<Array<{ userId: string; name: string; email: string; borrowCount: number }>> {
    const result = await this.model.aggregate([
      { $group: { _id: "$user", borrowCount: { $sum: 1 } } },
      { $sort: { borrowCount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          userId: "$_id",
          name: "$userDetails.name",
          email: "$userDetails.email",
          borrowCount: 1,
          _id: 0,
        },
      },
    ]);

    return result;
  }

  async countActiveBorrows(): Promise<number> {
    const count = await this.model.countDocuments({ returnDate: { $exists: false } });
    return count;
  }

  async getActiveBorrowsByUser(userId: string): Promise<IBorrowModel[]> {
    return Borrow.find({ user: userId, returnDate: null }).select("book");
  }
}
