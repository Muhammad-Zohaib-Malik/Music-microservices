import logger from "../utils/logger.js";
import { createAlbumsTable } from "./album.model.js";
import { createSongsTable } from "./song.model.js";

export async function initDB() {
  await createAlbumsTable();
  await createSongsTable();
  logger.info("✅ Database initialized successfully");
}
