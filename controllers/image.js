import mongoose from "mongoose";
import {Patient} from "../models/image.js"
import fs from 'fs'
import image from "../routes/image.js";


export const newImage = async (req, res, next) => {
    try {
        const patientId = req.body.patientId;
        const description = req.body.description;
        const mimetype = req.file.mimetype;
        const data = req.file.buffer;

        const image = ({
            _id: new mongoose.Types.ObjectId(), description: description, data: data, contentType: mimetype
        });

        let patient = await Patient.findOne({patientId: patientId})

        if (!patient) {
            patient = new Patient({
                _id: new mongoose.Types.ObjectId(), patientId: patientId, images: []
            });
        }

        patient.images.push(image);
        await patient.save();

        res.json({message: "Image saved successfully"});
    } catch (error) {

        console.error("Error saveing image to db", error)
        res.status(500).json({message: "Failed to save image"})

        next(error)
    }
}


export const getUserImageMetadata = async (req, res, next) => {
    try {
        const patientId = req.query.patientId;
        let patient = await Patient.findOne({patientId: patientId});

        if (!patient || !patient.images || patient.images.length === 0) {
            return res.status(404).json({message: "No images for that user found"});
        }

        let imageArray = patient.images.map(image => {
            //const base64Image = image.data.toString('base64');
            return {
                imageId: image.id, description: image.description, contentType: image.contentType, //data: base64Image
            }
        })

        res.json({
            mongoId: patient.id, patientId: patientId, images: imageArray
        });
    } catch (error) {
        next(error)
    }
}

export const getImage = async (req, res, next) => {
    try {
        const imageId = req.query.imageId;
        const mongoId = req.query.mongoId;

        let patient = await Patient.findById(mongoId);
        if (patient) {
            let image = patient.images.id(imageId);
            if (image) {
                const base64Image = image.data.toString('base64');
                const contentType = image.contentType;
                return res.status(200).json({ description: image.description, contentType, base64Image });
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

}


export const deleteAllUserImages = async (req, res, next) => {
    try {
        const patientId = req.params.patientId
        let patient = await Patient.findOne({patientId: patientId});


        if (patient) {

            patient.images = []
            await patient.save()
            res.status(200).json({message: "All images deleted for user ", patientId})
        } else {
            res.status(404).json({message: "No images found for the user ", patientId})
        }


    } catch (error) {
        next(error)
    }
}

export const deleteUserImage = async (req, res, next) => {
    try {
        const mongoId = req.query.mongoId
        const imageId = req.query.imageId

        let patient = await Patient.findById(mongoId)

        if (patient && patient.images.length > 0) {
           patient.images.id(imageId).deleteOne();
           await patient.save();
           res.status(200).json({message: "Image deleted"})
        }
    } catch (error) {
        next(error)
    }
}




