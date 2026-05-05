import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Untuk migrasi, kita gunakan DIRECT_URL sebagai url utama
    url: process.env.DIRECT_URL,
  },
});
