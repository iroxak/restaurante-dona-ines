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

// Auto-seed: on Vercel the DB is ephemeral (/tmp/), so we re-create users on each cold start
let seeded = false

export async function ensureSeeded() {
  if (seeded) return
  try {
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
  }
}