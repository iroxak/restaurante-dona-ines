// db.ts v2 — auto-create tables on ephemeral SQLite (Vercel /tmp/)
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// On Vercel, override DATABASE_URL to use /tmp (writable ephemeral storage)
if (process.env.VERCEL && !process.env.DATABASE_URL?.includes('/tmp/')) {
  process.env.DATABASE_URL = 'file:/tmp/custom.db'
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Auto-seed: on Vercel the DB is ephemeral (/tmp/), so we re-create tables + users on each cold start
let seeded = false

async function ensureTables() {
  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "username" TEXT NOT NULL,
      "password" TEXT NOT NULL,
      "role" TEXT NOT NULL DEFAULT 'user',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    )
  `)
  await db.$executeRawUnsafe(
    `CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username")`
  )
  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Quotation" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "folio" TEXT NOT NULL,
      "date" TEXT NOT NULL,
      "client" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'pendiente',
      "notes" TEXT NOT NULL DEFAULT '',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      "createdById" TEXT NOT NULL,
      FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
    )
  `)
  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "QuotationItem" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "description" TEXT NOT NULL,
      "qty" INTEGER NOT NULL,
      "price" INTEGER NOT NULL,
      "order" INTEGER NOT NULL DEFAULT 0,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "quotationId" TEXT NOT NULL,
      FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `)
}

export async function ensureSeeded() {
  if (seeded) return
  try {
    // First, ensure tables exist (critical for Vercel ephemeral SQLite)
    await ensureTables()

    const count = await db.user.count()
    if (count === 0) {
      const salt = bcrypt.genSaltSync(10)
      await db.user.createMany({
        data: [
          { username: 'admin', password: bcrypt.hashSync('DonaInes2026!', salt), role: 'admin' },
          { username: 'matias', password: bcrypt.hashSync('Matias2026!', salt), role: 'user' },
          { username: 'ines', password: bcrypt.hashSync('Ines2026!', salt), role: 'user' },
        ],
        skipDuplicates: true,
      })
      console.log('Auto-seed: users created')
    }
    seeded = true
  } catch (e) {
    console.error('Auto-seed failed:', e)
    // Reset flag so it retries on next request
    seeded = false
  }
}