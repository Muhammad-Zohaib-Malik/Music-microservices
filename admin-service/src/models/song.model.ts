import { sql } from "../config/db.js";
import logger from "../utils/logger.js";

export async function createSongsTable() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS songs(
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      thumbnail VARCHAR(255),
      audio VARCHAR(255) NOT NULL,
      album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    logger.info("✅ Songs table created");
  } catch (error) {
    logger.error("❌ Error creating songs table:", error);
  }
}
