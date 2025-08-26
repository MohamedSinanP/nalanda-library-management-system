import { IUser, IUserModel } from "../../types/user";

export default interface IAuthService {
  createUser(data: IUser): Promise<{
    accessToken: string;
    refreshToken: string;
    user: IUserModel;
  }>;
  login(data: { email: string; password: string }): Promise<{
    accessToken: string;
    refreshToken: string;
    user: IUserModel;
  }>;
  rotateRefreshToken(oldRefreshToken: string): Promise<{ refreshToken: string, accessToken: string }>
  logout(userId: string): Promise<void>;
}


