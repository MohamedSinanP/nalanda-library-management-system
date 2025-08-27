import { UserDTO } from "../../dtos/user.dto.js";
import { IUser } from "../../types/user.js";

export default interface IAuthService {
  createUser(data: IUser): Promise<{
    accessToken: string;
    refreshToken: string;
    user: UserDTO;
  }>;
  login(data: { email: string; password: string }): Promise<{
    accessToken: string;
    refreshToken: string;
    user: UserDTO;
  }>;
  rotateRefreshToken(oldRefreshToken: string): Promise<{ refreshToken: string, accessToken: string }>
  logout(userId: string): Promise<void>;
}


