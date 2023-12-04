import mongoose from "mongoose"

const imageSchema = new Schema(
    {
        userId: Number,
        imageId: String
    }
)

const imageModel = mongoose.model('Images', imageSchema)