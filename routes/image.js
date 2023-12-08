import express from "express";
import { getUserImageMetadata, newImage, deleteUserImage, deleteAllUserImages, getImage, postImage } from "../controllers/image.js";
import multer from "multer";

const router = express.Router();

 // filename and placement
 const storage = multer.memoryStorage()

// filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true); // picture is saved
  } else {
    cb(null, false); // not saved
  }
};

// preferences for the picture
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.post("/image", upload.single("image"), newImage);
router.put("/image", upload.single("image"), postImage);
router.get("/image", getImage)
router.get("/image_data", getUserImageMetadata);
router.delete("/image", deleteUserImage);
router.delete("/image/:patientId", deleteAllUserImages)

export default router;
