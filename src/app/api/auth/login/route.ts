import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db, ensureSeeded } from "@/lib/db";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    await ensureSeeded();
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { username } });

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
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Login error:', msg);
    return NextResponse.json(
      { error: "Error interno del servidor", debug: msg },
      { status: 500 }
    );
  }
}