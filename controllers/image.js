import mongoose from "mongoose";
import { Patient, Image } from "../models/image.js"
import fs from 'fs'


export const newImage = async (req, res, next) => {
    try {
        const patientId = req.body.patientId;
        const description = req.body.description;
        const mimetype = req.file.mimetype;
        const data = req.file.buffer;
        
        let image = new Image({
            _id: new mongoose.Types.ObjectId(),
            description: description,
            data: data,
            contentType: mimetype
        });

        let patient = await Patient.findOne({patientId: patientId})

        if (!patient){
            patient = new Patient({
                _id: new mongoose.Types.ObjectId(),
                patientId: patientId,
                images: []
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


export const getUserImages = async (req, res, next) => {
    try {
        const patientId = req.query.patientId;
        let patient = await Patient.findOne({patientId: patientId});

        if (!patient || !patient.images || patient.images.length === 0) {
            return res.status(404).json({ message: "No images for that user found" });
        }

        let imageArray = patient.images.map(image => {
            //const base64Image = image.data.toString('base64');
            return {
                imageId: image.id,
                description: image.description,
                contentType: image.contentType,
                //data: base64Image
            }
        })
        
        res.json({
            mongoId: patient.id,
            patientId: patientId,
            images: imageArray });
    } catch (error) {
        next(error)
    }
}

export const deleteAllUserImages = async (req, res, next) => {
    try {
        const patientId = req.params.patientId
        let userImages = await Patient.findOne({patientId: patientId});


        if (userImages && userImages.images.length > 0) {

            userImages.images = []
            await userImages.save();
            res.status(200).json({message: "All images deleted for user ", patientId})
        } else {
            res.status(404).json({message: "No images found for the user ", patientId })
        }


    } catch (error) {
        next(error)
    }
}

export const deleteUserImage = async (req, res, next) => {
    try {
        const patientId = req.query.patientId
        const imagePath = req.query.imagePath

        let userImages = await Image.findOne({patientId: patientId});

        if (userImages && imagePath.length > 0) {
            if (userImages.imagePath.includes(imagePath)) {
                userImages.imagePath = userImages.imagePath.filter(path => path !== imagePath)

                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({message: "Error deleting file"});
                        return;
                    }
                })

                await userImages.save();
                res.status(200).json({message: "Image deleted successfully"});
            } else {
                res.status(404).json({message: "Image path was not found for that user"})
            }
        }
    } catch (error) {
        next(error)
    }
}




