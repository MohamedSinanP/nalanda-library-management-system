import { Types } from "mongoose";
import IBookRepository from "../interfaces/repositories/book.repository";
import { Book } from "../models/book.model";
import { IBookModel } from "../types/book";
import { BaseRepository } from "./base.repository";
import { StatusCode } from "../types/type";
import { HttpError } from "../utils/http.error";

export class BookRepository extends BaseRepository<IBookModel> implements IBookRepository {
  constructor() {
    super(Book);
  }

  async findPaginated(
    page: number,
    limit: number,
    filters: { search?: string; genre?: string; author?: string }
  ): Promise<{ data: IBookModel[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { author: { $regex: filters.search, $options: "i" } },
        { genre: { $regex: filters.search, $options: "i" } },
      ];
    }

    if (filters.genre) {
      query.genre = { $regex: `^${filters.genre}$`, $options: "i" };
    }

    if (filters.author) {
      query.author = { $regex: `^${filters.author}$`, $options: "i" };
    }

    const finalQuery = Object.keys(query).length > 0 ? query : {};

    const data = await this.model.find(finalQuery).skip(skip).limit(limit);
    const total = await this.model.countDocuments(finalQuery);

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

  async findByAdminPaginated(
    adminId: string,
    page: number,
    limit: number,
    search?: string
  ): Promise<{ data: IBookModel[]; total: number }> {
    const query: any = {
      addedBy: new Types.ObjectId(adminId),
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { isbn: { $regex: search, $options: "i" } },
      ];
    }

    const total = await this.model.countDocuments(query);

    const data = await this.model
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return { data, total };
  }
  async getGenres(): Promise<string[]> {
    try {
      const genres = await Book.distinct('genre').exec();
      return genres.filter((genre): genre is string => typeof genre === 'string');
    } catch (err) {
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to fetch genres", err);
    }
  }

  async getAuthors(): Promise<string[]> {
    try {
      const authors = await Book.distinct('author').exec();
      return authors.filter((author): author is string => typeof author === 'string');
    } catch (err) {
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to fetch authors", err);
    }
  }
}
