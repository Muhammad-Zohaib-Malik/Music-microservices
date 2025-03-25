import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/asyncHandler.js";
import { v2 as cloudinary } from "cloudinary";
import { sql } from "../config/db.js";

export const AddAlbum = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const file = req.file;

  // Validate required fields
  if (!title || !description) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Title and Description are required",
    });
    return;
  }

  if (!file) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "No file uploaded",
    });
    return;
  }

  try {
    // Upload file to Cloudinary
    const cloud = await cloudinary.uploader.upload(file.path, {
      folder: "albums",
    });

    // Insert album into database
    const result = await sql`
      INSERT INTO albums (title, description, thumbnail) 
      VALUES (${title}, ${description}, ${cloud.secure_url}) 
      RETURNING *;
    `;

    res.status(StatusCodes.CREATED).json({
      message: "Album created successfully",
      album: result[0],
    });
  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to upload album",
      error: error.message,
    });
  }
});

export const AddSong = asyncHandler(async (req, res) => {
  const { title, description, album } = req.body;
  const file = req.file;

  if (!album) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Album ID is required",
    });
    return;
  }

  // Check if album exists
  const isAlbum = await sql`SELECT * FROM albums WHERE id = ${album}`;

  if (isAlbum.length === 0) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: "Album not found",
    });
    return;
  }

  if (!file) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "No file uploaded",
    });
    return;
  }

  try {
    // Upload file to Cloudinary
    const cloud = await cloudinary.uploader.upload(file.path, {
      folder: "songs",
      resource_type: "video",
    });

    // Insert song into database and return the newly created song
    const result = await sql`
      INSERT INTO songs (title, description, audio, album_id) 
      VALUES (${title}, ${description}, ${cloud.secure_url}, ${album}) 
      RETURNING *;
    `;

    res.status(StatusCodes.CREATED).json({
      message: "Song added successfully",
      song: result[0],
    });
  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to upload song",
      error: error.message,
    });
  }
});

export const AddThumbnail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const song = await sql`SELECT * FROM songs WHERE id = ${id}`;
  if (song.length === 0) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: "No song with this ID",
    });
    return;
  }

  const file = req.file;
  if (!file) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "No file to upload",
    });
    return;
  }

  try {
    const cloud = await cloudinary.uploader.upload(file.path, {
      folder: "Thumbnail",
      resource_type: "auto",
    });

    const result = await sql`
      UPDATE songs SET thumbnail = ${cloud.secure_url} WHERE id = ${id} RETURNING *
    `;

    res.status(StatusCodes.CREATED).json({
      message: "Thumbnail added successfully",
      song: result[0],
    });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error uploading thumbnail",
      error: error.message,
    });
  }
});

export const DeleteAlbum = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if album exists
  const isAlbum = await sql`SELECT * FROM albums WHERE id = ${id}`;
  if (isAlbum.length === 0) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: "No album with this ID",
    });
    return;
  }

  try {
    await sql`DELETE FROM songs WHERE album_id = ${id}`;

    await sql`DELETE FROM albums WHERE id = ${id}`;

    res.status(StatusCodes.OK).json({
      message: "Album and associated songs deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting album:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error deleting album",
      error: error.message,
    });
  }
});

export const DeleteSong = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const song = await sql`SELECT * FROM songs WHERE id = ${id}`;
  if (song.length === 0) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: "No song found with this ID",
    });
    return;
  }

  try {
    await sql`DELETE FROM songs WHERE id = ${id}`;

    res.status(StatusCodes.OK).json({
      message: "Song deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting song:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error deleting song",
      error: error.message,
    });
  }
});
