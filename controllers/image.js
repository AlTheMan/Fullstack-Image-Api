import mongoose from "mongoose";
import { Patient } from "../models/image.js";

export const putImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const { patientId, description, imageId } = req.body;
    const { mimetype, buffer } = req.file;

    let patient = await Patient.findOne({ patientId });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    let image = patient.images.find((img) => img._id.toString() === imageId);

    if (image) {
      image.description = description;
      image.data = buffer;
      image.contentType = mimetype;
    } else {
      image = {
        _id: new mongoose.Types.ObjectId(),
        description: description,
        data: buffer,
        contentType: mimetype,
      };
      patient.images.push(image);
    }

    await patient.save();

    res.status(200).json({ message: "Image saved successfully" });
  } catch (error) {
    console.error("Error saving image to db", error);
    res.status(500).json({ message: "Failed to save image" });
  }
};

export const postImage = async (req, res, next) => {
  try {
    const patientId = req.body.patientId;
    const description = req.body.description;
    const mimetype = req.file.mimetype;
    const data = req.file.buffer;

    const image = {
      _id: new mongoose.Types.ObjectId(),
      description: description,
      data: data,
      contentType: mimetype,
    };

    console.log("Fetching patient...");
    let patient = await Patient.findOne({ patientId: patientId });

    if (!patient) {
      patient = new Patient({
        _id: new mongoose.Types.ObjectId(),
        patientId: patientId,
        images: [],
      });
    }

    patient.images.push(image);
    await patient.save();

    res.json({ message: "Image saved successfully" });
  } catch (error) {
    console.error("Error saveing image to db", error);
    res.status(500).json({ message: "Failed to save image" });

    next(error);
  }
};

export const getUserImageMetadata = async (req, res, next) => {
  try {
    const patientId = req.query.patientId;
    let patient = await Patient.findOne({ patientId: patientId });

    if (!patient || !patient.images || patient.images.length === 0) {
      return res.status(404).json({ message: "No images for that user found" });
    }

    let imageArray = patient.images.map((image) => {
      //const base64Image = image.data.toString('base64');
      return {
        imageId: image._id.toString(),
        description: image.description,
        contentType: image.contentType, //data: base64Image
      };
    });

    res.json({
      mongoId: patient._id.toString(),
      patientId: patientId,
      images: imageArray,
    });
  } catch (error) {
    next(error);
  }
};

export const getImage = async (req, res, next) => {
  try {
    const imageId = req.query.imageId;
    const mongoId = req.query.mongoId;

    let patient = await Patient.findOne({ _id: mongoId });
    if (patient) {
      let image = patient.images.find((img) => img._id.toString() === imageId);
      if (image) {
        const base64Image = image.data.toString("base64");
        const contentType = image.contentType;
        return res
          .status(200)
          .json({ description: image.description, contentType, base64Image });
      } else {
        return res.status(404).json({ message: "Image not found" });
      }
    } else {
      return res.status(404).json({ message: "Patient not found" });
    }
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const deleteAllUserImages = async (req, res, next) => {
  try {
    const patientId = req.params.patientId;
    let patient = await Patient.findOne({ patientId: patientId });

    if (patient) {
      patient.images = [];
      await patient.save();
      res
        .status(200)
        .json({ message: "All images deleted for user ", patientId });
    } else {
      res
        .status(404)
        .json({ message: "No images found for the user ", patientId });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteUserImage = async (req, res, next) => {
  try {
    const { imageId, patientId } = req.query;
    let patient = await Patient.findOne({ patientId: patientId });
    if (patient && patient.images.length > 0) {
      const imageIndex = patient.images.findIndex(
        (img) => img._id.toString() === imageId
      );

      if (imageIndex !== -1) {
        patient.images.splice(imageIndex, 1);
        await patient.save();
        res.status(200).json({ message: "Image deleted" });
      } else {
        // Image not found
        res.status(404).json({ message: "Image not found" });
      }
    } else {
      res.status(404).json({ message: "Patient or images not found" });
    }
  } catch (error) {
    console.error("Error deleting image: ", error);
    next(error);
  }
};
