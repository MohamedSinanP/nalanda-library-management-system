import { CompactEncrypt, compactDecrypt } from 'jose';

export interface IJwtService {
  generateAccessToken(userId: string, role: string): Promise<string>;
  generateRefreshToken(userId: string, role: string): Promise<string>;
  verifyAccessToken(token: string): Promise<{ userId: string; role: string }>;
  verifyRefreshToken(token: string): Promise<{ userId: string; role: string }>;
}

export class JwtService implements IJwtService {
  private readonly accessTokenSecret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET as string);
  private readonly refreshTokenSecret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET as string);

  async generateAccessToken(userId: string, role: string): Promise<string> {
    const payload = JSON.stringify({ userId, role, exp: Math.floor(Date.now() / 1000) + 60 * 15 });

    const jwe = await new CompactEncrypt(new TextEncoder().encode(payload))
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .encrypt(this.accessTokenSecret);

    return jwe;
  }

  async generateRefreshToken(userId: string, role: string): Promise<string> {
    const payload = JSON.stringify({ userId, role, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 });

    const jwe = await new CompactEncrypt(new TextEncoder().encode(payload))
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .encrypt(this.refreshTokenSecret);

    return jwe;
  }

  async verifyAccessToken(token: string): Promise<{ userId: string; role: string }> {
    try {
      const { plaintext } = await compactDecrypt(token, this.accessTokenSecret);
      const payload = JSON.parse(new TextDecoder().decode(plaintext));

      if (payload.exp && Date.now() / 1000 > payload.exp) {
        throw new Error('Access token expired');
      }

      return payload;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  async verifyRefreshToken(token: string): Promise<{ userId: string; role: string }> {
    try {
      const { plaintext } = await compactDecrypt(token, this.refreshTokenSecret);
      const payload = JSON.parse(new TextDecoder().decode(plaintext));

      if (payload.exp && Date.now() / 1000 > payload.exp) {
        throw new Error('Refresh token expired');
      }

      return payload;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
