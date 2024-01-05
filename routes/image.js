import express from "express";
import { getUserImageMetadata, postImage, deleteUserImage, deleteAllUserImages, getImage, putImage } from "../controllers/image.js";
import multer from "multer";

const imageRouter = (keycloak) => {
  const router = express.Router();

  // filename and placement
  const storage = multer.memoryStorage();

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

  router.post("", keycloak.protect(), upload.single("image"), postImage);
  router.put("", keycloak.protect(), upload.single("image"), putImage);
  router.get("", keycloak.protect(), getImage);
  router.get("/data", keycloak.protect(), getUserImageMetadata);
  router.delete("", keycloak.protect(), deleteUserImage);
  router.delete("/:patientId", keycloak.protect(), deleteAllUserImages);

  return router;
};

export default imageRouter;
