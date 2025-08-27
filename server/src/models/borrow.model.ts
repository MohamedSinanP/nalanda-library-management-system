import { Schema, model } from "mongoose";
import { IBorrowModel } from "../types/borrow.js";

const borrowSchema = new Schema<IBorrowModel>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    borrowDate: { type: Date, default: Date.now },
    returnDate: { type: Date },
  },
  { timestamps: true }
);

export const Borrow = model<IBorrowModel>("Borrow", borrowSchema); 