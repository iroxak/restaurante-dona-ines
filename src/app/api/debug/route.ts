import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { db, ensureSeeded } = await import("@/lib/db");
    await ensureSeeded();
    const count = await db.user.count();
    return NextResponse.json({ ok: true, userCount: count, dbWorking: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : "";
    return NextResponse.json({ ok: false, error: msg, stack: stack?.split("\n").slice(0, 5) });
  }
}