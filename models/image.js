import mongoose from "mongoose"
const { Schema } = mongoose


const imageSchema = new Schema ({
    description: String,
    data: Buffer,
    contentType: String   
})

const patientSchema = new Schema(
    {
        patientId: Number,
        images: [imageSchema]
    }
);

export const Patient = mongoose.model('Patient', patientSchema)
//export const Image = mongoose.model('Images', imageSchema, ) // i dont want this to appear in the db