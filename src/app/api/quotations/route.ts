import { NextRequest, NextResponse } from "next/server";
import { db, ensureSeeded } from "@/lib/db";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";

function generateFolio(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `DI${dd}${mm}${yyyy}`;
}

export async function GET() {
  try {
    await ensureSeeded();
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const quotations = await db.quotation.findMany({
      include: {
        createdBy: { select: { username: true } },
        items: { orderBy: { order: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(quotations);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureSeeded();
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { date, client, items, notes } = body;

    if (!date || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Fecha e items son requeridos" },
        { status: 400 }
      );
    }

    const folio = generateFolio(date);

    // Check if folio already exists and append a suffix
    const existing = await db.quotation.findMany({
      where: { folio: { startsWith: folio } },
      select: { folio: true },
    });

    const finalFolio = existing.length > 0 ? `${folio}-${existing.length + 1}` : folio;

    const quotation = await db.quotation.create({
      data: {
        folio: finalFolio,
        date,
        client: JSON.stringify(client || {}),
        status: "pendiente",
        notes: notes || "",
        createdById: session.userId,
        items: {
          create: items.map((item: { description: string; qty: number; price: number }, index: number) => ({
            description: item.description,
            qty: item.qty,
            price: Math.round(item.price),
            order: index,
          })),
        },
      },
      include: {
        createdBy: { select: { username: true } },
        items: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json(quotation, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}