import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sql } from "../config/db.js";
import logger from "../utils/logger.js";

// Get all albums
export const getAllAlbum = asyncHandler(async (req, res) => {
  try {
    const albums = await sql`SELECT * FROM albums`;
    logger.info("Fetched all albums successfully");

    res.status(StatusCodes.OK).json(albums);
  } catch (error: any) {
    logger.error("Error fetching albums:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error fetching albums",
      error: error.message,
    });
  }
});

// Get all songs
export const getAllSongs = asyncHandler(async (req, res) => {
  try {
    const songs = await sql`SELECT * FROM songs`;
    logger.info("Fetched all songs successfully");

    res.status(StatusCodes.OK).json(songs);
  } catch (error: any) {
    logger.error("Error fetching songs:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error fetching songs",
      error: error.message,
    });
  }
});

// Get all songs of a specific album
export const getAllSongsOfAlbum = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const album = await sql`SELECT * FROM albums WHERE id = ${id}`;
    if (album.length === 0) {
      logger.warn(`No album found with ID: ${id}`);
      res.status(StatusCodes.NOT_FOUND).json({
        message: "No album found with this ID",
      });
      return;
    }

    const songs = await sql`SELECT * FROM songs WHERE album_id = ${id}`;
    logger.info(`Fetched songs for album ID: ${id}`);

    res.status(StatusCodes.OK).json({ songs, album: album[0] });
  } catch (error: any) {
    logger.error("Error fetching album songs:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error fetching album songs",
      error: error.message,
    });
  }
});

// Get a single song by ID
export const getSingleSong = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const song = await sql`SELECT * FROM songs WHERE id = ${id}`;
    if (song.length === 0) {
      logger.warn(`No song found with ID: ${id}`);
      res.status(StatusCodes.NOT_FOUND).json({
        message: "No song found with this ID",
      });
      return;
    }

    logger.info(`Fetched song with ID: ${id}`);
    res.status(StatusCodes.OK).json(song[0]);
  } catch (error: any) {
    logger.error("Error fetching song:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error fetching song",
      error: error.message,
    });
  }
});
