import { IUserModel } from "../types/user";

export class UserDTO {
  name: string;
  email: string;
  role: string;

  constructor(user: IUserModel) {
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
  }
}