import express from "express";
import { getUserImages, newImage, deleteUserImage, deleteAllUserImages } from "../controllers/image.js";
import multer from "multer";

const router = express.Router();

 // filename and placement
 const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

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
router.get("/image", getUserImages);
router.delete("/image", deleteUserImage);
router.delete("/image/:patientId", deleteAllUserImages)

export default router;
