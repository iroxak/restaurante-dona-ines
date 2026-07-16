import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  userId: string;
  username: string;
  role: string;
  isLoggedIn: boolean;
}

export const sessionOptions = {
  password: "dona_ines_session_secret_key_2026_super_long_random_string",
  cookieName: "dona_ines_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
  },
};