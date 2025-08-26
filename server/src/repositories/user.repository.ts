import IUserRepository from "../interfaces/repositories/user.repository";
import { User } from "../models/user.model";
import { IUserModel } from "../types/user";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<IUserModel> implements IUserRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUserModel | null> {
    return User.findOne({ email }).exec();
  }

  async findByRefreshToken(token: string): Promise<IUserModel | null> {
    return this.model.findOne({ refreshToken: token });
  }
}
