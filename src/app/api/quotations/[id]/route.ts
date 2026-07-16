import { NextRequest, NextResponse } from "next/server";
import { db, ensureSeeded } from "@/lib/db";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureSeeded();
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { id } = await params;

    const quotation = await db.quotation.findUnique({
      where: { id },
      include: {
        createdBy: { select: { username: true } },
        items: { orderBy: { order: "asc" } },
      },
    });

    if (!quotation) {
      return NextResponse.json({ error: "Cotización no encontrada" }, { status: 404 });
    }

    return NextResponse.json(quotation);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureSeeded();
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { date, client, items, notes, status } = body;

    const existing = await db.quotation.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Cotización no encontrada" }, { status: 404 });
    }

    // Delete existing items and recreate
    await db.quotationItem.deleteMany({ where: { quotationId: id } });

    const updated = await db.quotation.update({
      where: { id },
      data: {
        date: date ?? existing.date,
        client: client !== undefined ? JSON.stringify(client) : existing.client,
        notes: notes !== undefined ? notes : existing.notes,
        status: status ?? existing.status,
        items: {
          create: (items || []).map(
            (item: { description: string; qty: number; price: number }, index: number) => ({
              description: item.description,
              qty: item.qty,
              price: Math.round(item.price),
              order: index,
            })
          ),
        },
      },
      include: {
        createdBy: { select: { username: true } },
        items: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureSeeded();
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { id } = await params;

    const quotation = await db.quotation.findUnique({
      where: { id },
      include: { createdBy: { select: { username: true } } },
    });

    if (!quotation) {
      return NextResponse.json({ error: "Cotización no encontrada" }, { status: 404 });
    }

    if (session.role !== "admin" && quotation.createdById !== session.userId) {
      return NextResponse.json(
        { error: "No tienes permiso para eliminar esta cotización" },
        { status: 403 }
      );
    }

    await db.quotation.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}