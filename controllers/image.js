import mongoose from "mongoose";
import { Image } from "../models/image.js"
import multer from "multer";


export const newImage = async (req, res, next) => {

    // filename and placement
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, "./uploads/");
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

    try {
        const userId = req.body.userId;
        const filePath = req.file.path
        
        // if pictures from that user exists
        let image = await Image.findOne({userId: userId})

        if (image){
            image.imagePath.push(filePath)

        // if not, create a new object
        } else {
            image = new Image({
                _id: new mongoose.Types.ObjectId(),
                userId: userId,
                imagePath: [filePath]
            });
        }
        await image.save();
        upload.single("image") // saves the file to disk
        res.json({message: "Image saved successfully"});
    } catch (error) {
        next(error)
    }
}

export const getAllImages = (req, res, next) => {
    res.json({message: "GET all images"})
}

export const getUserImages = async (req, res, next) => {
    try {
        const userId = req.query.userId;
        let images = await Image.findOne({userId: userId});

        if (!images || !images.imagePath || images.imagePath.length === 0) {
            return res.status(404).json({ message: "No images for that user found" });
        }
        // returns the url for the image (not the image itself)
        const imageUrls = images.imagePath.map(path => `${req.protocol}://${req.get('host')}/${path}`);
        res.json({ 
            userId: userId,
            imageUrls: imageUrls });
    } catch (error) {
        next(error)
    }
}




