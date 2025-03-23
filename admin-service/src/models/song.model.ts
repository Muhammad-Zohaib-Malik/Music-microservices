import { sql } from "../config/db.js";
import logger from "../utils/logger.js"; // Import logger

export async function createSongsTable() {
  const [{ exists }] = await sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'songs'
    ) AS exists;
  `;

  if (!exists) {
    await sql`
      CREATE TABLE songs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(255),
        audio VARCHAR(255) NOT NULL,
        album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    logger.info("✅ Songs table created");
  }
}
