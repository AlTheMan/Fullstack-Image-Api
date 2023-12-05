import mongoose from "mongoose"
const { Schema } = mongoose

const imageSchema = new Schema(
    {
        userId: Number,
        imagePath: [String]
    }
);

export const Image = mongoose.model('Images', imageSchema)