import { db } from "../src/server/db";
import * as bcrypt from "bcrypt";

async function main() {
  const adminPassword = await bcrypt.hash("admin", 10);
  const petugasPassword = await bcrypt.hash("petugas", 10);

  await db.user.create({
    data: {
      name: "SUPER ADMIN",
      username: "admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  await db.user.create({
    data: {
      name: "PETUGAS",
      username: "petugas",
      password: petugasPassword,
      role: "PETUGAS",
    },
  });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
