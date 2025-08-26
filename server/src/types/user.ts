import mongoose, { Document } from "mongoose";

export enum UserRole {
  ADMIN = "Admin",
  MEMBER = "Member",
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  refreshToken?: string;
}
export interface IUserModel extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}