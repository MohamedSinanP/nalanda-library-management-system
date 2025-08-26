// src/services/user.service.ts
import { UserRepository } from "../repositories/user.repository";
import IAuthService from "../interfaces/services/auth.service";
import { IUser } from "../types/user";
import bcrypt from "bcrypt";
import { JwtService } from "../utils/jwt";
import { StatusCode } from "../types/type";
import { HttpError } from "../utils/http.error";
import { UserDTO } from "../dtos/user.dto";

export class AuthService implements IAuthService {
  private _jwtService: JwtService;

  constructor(private _userRepo: UserRepository) {
    this._jwtService = new JwtService();
  }

  async createUser(data: IUser): Promise<{
    accessToken: string;
    refreshToken: string;
    user: UserDTO;
  }> {
    try {
      // check if email exists
      const existingUser = await this._userRepo.findByEmail(data.email);
      if (existingUser) throw new HttpError(StatusCode.CONFLICT, "Email already in use");

      // hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const role = data.role || "MEMBER";

      const userData = { ...data, password: hashedPassword, role };
      const user = await this._userRepo.create(userData);

      // generate tokens 
      const accessToken = await this._jwtService.generateAccessToken(user._id.toString(), user.role);
      const refreshToken = await this._jwtService.generateRefreshToken(user._id.toString(), user.role);
      await this._userRepo.update(String(user._id), { refreshToken });

      const userDto = new UserDTO(user);
      return { accessToken, refreshToken, user: userDto };
    } catch (err: any) {
      if (err instanceof HttpError) throw err;
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to create user", err);
    }
  }

  async login(data: { email: string; password: string }): Promise<{
    accessToken: string;
    refreshToken: string;
    user: UserDTO
  }> {
    try {
      const user = await this._userRepo.findByEmail(data.email);
      if (!user) throw new HttpError(StatusCode.UNAUTHORIZED, "Invalid email or password");

      const isMatch = await bcrypt.compare(data.password, user.password);
      if (!isMatch) throw new HttpError(StatusCode.UNAUTHORIZED, "Invalid email or password");

      // generate tokens
      const accessToken = await this._jwtService.generateAccessToken(user._id.toString(), user.role);
      const refreshToken = await this._jwtService.generateRefreshToken(user._id.toString(), user.role);
      await this._userRepo.update(String(user._id), { refreshToken });
      const userDto = new UserDTO(user);

      return { accessToken, refreshToken, user: userDto };
    } catch (err: any) {
      if (err instanceof HttpError) throw err;
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Login failed", err);
    }
  }

  async rotateRefreshToken(oldRefreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      const user = await this._userRepo.findByRefreshToken(oldRefreshToken);
      if (!user) throw new HttpError(StatusCode.UNAUTHORIZED, "Invalid refresh token");

      const payload = await this._jwtService.verifyRefreshToken(oldRefreshToken);
      if (!payload || payload.userId !== user._id.toString()) {
        throw new HttpError(StatusCode.UNAUTHORIZED, "Refresh token invalid or expired");
      }

      const newAccessToken = await this._jwtService.generateAccessToken(user._id.toString(), user.role);
      const newRefreshToken = await this._jwtService.generateRefreshToken(user._id.toString(), user.role);

      await this._userRepo.update(String(user._id), { refreshToken: newRefreshToken });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (err: any) {
      if (err instanceof HttpError) throw err;
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to rotate refresh token", err);
    }
  }

  async logout(userId: string): Promise<void> {
    try {
      const user = await this._userRepo.findById(userId);
      if (!user) throw new HttpError(StatusCode.NOT_FOUND, "User not found");

      await this._userRepo.update(userId, { refreshToken: undefined });
    } catch (err: any) {
      if (err instanceof HttpError) throw err;
      throw new HttpError(StatusCode.INTERNAL_SERVER_ERROR, "Logout failed", err);
    }
  }
}

const userRepo = new UserRepository();
export const userService = new AuthService(userRepo);
