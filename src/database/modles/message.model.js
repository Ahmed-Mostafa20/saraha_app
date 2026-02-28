import mongoose , { Types } from 'mongoose'

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        min: 10,
        max: 600
    },
    reciverId: {
        type: Types.ObjectId,
        required: true,
        ref: "User"
    },
    date: {
        type: Date,
        default: Date.now
    },
    Image: {
        type: String,
    }
},
    {
        timestamps: true
    })

export const messageModel = mongoose.model("Message", messageSchema)