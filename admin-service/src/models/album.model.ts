import { sql } from "../config/db.js";
import logger from "../utils/logger.js";

export async function createAlbumsTable() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS albums(
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      thumbnail VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    logger.info("✅ Albums table created");
  } catch (error) {
    logger.error("❌ Error creating albums table:", error);
  }
}
