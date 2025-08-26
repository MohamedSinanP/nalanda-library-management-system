
import { Document, Types } from "mongoose";

export interface IBorrow {
  user: Types.ObjectId;
  book: Types.ObjectId;
  borrowDate: Date;
  returnDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBorrowModel extends Document {
  user: Types.ObjectId;
  book: Types.ObjectId;
  borrowDate: Date;
  returnDate?: Date;
}