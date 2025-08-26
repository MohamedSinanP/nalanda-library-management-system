import { Schema, model } from "mongoose";
import { IUserModel, UserRole } from "../types/user";

const userSchema = new Schema<IUserModel>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.MEMBER },
    refreshToken: { type: String, required: false }
  },
  { timestamps: true }
);

export const User = model<IUserModel>("User", userSchema);