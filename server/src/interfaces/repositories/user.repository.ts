import { IUserModel } from "../../types/user";
import IBaseRepository from "./base.repository";

export default interface IUserRepository extends IBaseRepository<IUserModel> {
  findByEmail(email: string): Promise<IUserModel | null>;
  findByRefreshToken(token: string): Promise<IUserModel | null>;
}