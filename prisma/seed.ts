import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const salt = bcrypt.genSaltSync(10);

  // Upsert admin
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: bcrypt.hashSync("DonaInes2026!", salt),
      role: "admin",
    },
  });

  // Upsert matias
  await prisma.user.upsert({
    where: { username: "matias" },
    update: {},
    create: {
      username: "matias",
      password: bcrypt.hashSync("Matias2026!", salt),
      role: "user",
    },
  });

  // Upsert ines
  await prisma.user.upsert({
    where: { username: "ines" },
    update: {},
    create: {
      username: "ines",
      password: bcrypt.hashSync("Ines2026!", salt),
      role: "user",
    },
  });

  console.log("✅ Usuarios creados: admin, matias, ines");
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });