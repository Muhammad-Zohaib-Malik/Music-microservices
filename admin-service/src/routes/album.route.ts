import { Router } from "express";
import { isAdminAuth } from "../middleware/auth.middleware.js";
import {
  AddAlbum,
  AddSong,
  AddThumbnail,
  DeleteAlbum,
  DeleteSong,
} from "../controllers/album.controller.js";
import { upload } from "../middleware/multer.js";

const router = Router();

router.post("/album/new", isAdminAuth, upload.single("file"), AddAlbum);
router.post("/song/new", isAdminAuth, upload.single("file"), AddSong);
router.post("/song/:id", isAdminAuth, upload.single("file"), AddThumbnail);
router.delete("/album/:id", isAdminAuth, DeleteAlbum);
router.delete("/song/:id", isAdminAuth, DeleteSong);

export default router;
