import mongoose, { Document, Types } from "mongoose";
import { IUserModel } from "./user";
import { IBookModel } from "./book";

export interface IBorrow {
  user: Types.ObjectId;
  book: Types.ObjectId;
  borrowDate: Date;
  returnDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBorrowModel extends Document {
  _id: mongoose.Types.ObjectId;
  user: IUserModel | Types.ObjectId;
  book: IBookModel | Types.ObjectId;
  borrowDate: Date;
  returnDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
