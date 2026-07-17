import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";

async function getDb() {
  const { db, ensureSeeded } = await import("@/lib/db");
  await ensureSeeded();
  return db;
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    if (!session.isLoggedIn || session.role !== "admin") return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    const { id } = await params;
    const { password } = await request.json();
    if (!password) return NextResponse.json({ error: "Contraseña requerida" }, { status: 400 });

    const db = await getDb();
    const user = await db.user.findUnique({ where: { id } });
    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    const hashedPassword = bcrypt.hashSync(password, 10);
    await db.user.update({ where: { id }, data: { password: hashedPassword } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    if (!session.isLoggedIn || session.role !== "admin") return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    const { id } = await params;
    const db = await getDb();
    const user = await db.user.findUnique({ where: { id } });
    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    if (user.role === "admin") return NextResponse.json({ error: "No se puede eliminar el administrador" }, { status: 400 });

    await db.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}