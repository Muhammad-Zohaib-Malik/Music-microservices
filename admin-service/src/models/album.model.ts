import { sql } from "../config/db.js";
import logger from "../utils/logger.js"; // Import logger

export async function createAlbumsTable() {
  const [{ exists }] = await sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'albums'
    ) AS exists;
  `;

  if (!exists) {
    await sql`
      CREATE TABLE albums (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    logger.info("✅ Albums table created");
  }
}
