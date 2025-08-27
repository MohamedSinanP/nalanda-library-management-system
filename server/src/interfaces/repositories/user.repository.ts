import { IUserModel } from "../../types/user.js";
import IBaseRepository from "./base.repository.js";

export default interface IUserRepository extends IBaseRepository<IUserModel> {
  findByEmail(email: string): Promise<IUserModel | null>;
  findByRefreshToken(token: string): Promise<IUserModel | null>;
}