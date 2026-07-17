import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";

// Fallback users for Vercel ephemeral SQLite (DB may not initialize)
const FALLBACK_USERS: Record<string, { password: string; role: string; id: string }> = {
  admin: { password: "$2b$10$pDZiz12kwkHRBTHYB.VuduwnpMrczWKdsCHqnh6XxwJJQqoK9OvV2", role: "admin", id: "fallback-admin" },
  matias: { password: "$2b$10$zSy0.vK4ADBQvYkRMBYFS.8PCIgmOsXrdeZm.QLLDJPrVt.hps06q", role: "user", id: "fallback-matias" },
  ines: { password: "$2b$10$ChGNKPVX6XzE.2p0cNEwweLSKP/jMzI.f3c36K0KsnzCI1qaqlrGm", role: "user", id: "fallback-ines" },
};

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Try database first, fallback to hardcoded users
    let user: { id: string; username: string; role: string; password: string } | null = null;

    try {
      const { db, ensureSeeded } = await import("@/lib/db");
      await ensureSeeded();
      const dbUser = await db.user.findUnique({ where: { username } });
      if (dbUser) {
        user = { id: dbUser.id, username: dbUser.username, role: dbUser.role, password: dbUser.password };
      }
    } catch {
      // DB not available — use fallback users
    }

    if (!user) {
      const fallback = FALLBACK_USERS[username];
      if (fallback) {
        user = { id: fallback.id, username, role: fallback.role, password: fallback.password };
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    session.userId = user.id;
    session.username = user.username;
    session.role = user.role;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({
      id: user.id,
      username: user.username,
      role: user.role,
    });
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}