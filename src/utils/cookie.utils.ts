import { Response } from 'express';

export class CookieUtils {
  static setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60 * 1000, //15m
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, //7d
    });
  }

  static clearAuthCookies(res: Response) {
    res.clearCookie('accessToken', {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
    });

    res.clearCookie('refreshToken', {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
    });
  }
}
