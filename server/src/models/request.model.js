import mongoose, { mongo, Schema } from "mongoose";

const requestSchema = new Schema({

    type: {
        type: String,
        enum: ["NEW_CHAT", "NEW_GROUP"]
    },
    entityId: {
        type: mongoose.Types.ObjectId,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    },
    message: {
        type: String,
    },
    processedAt: {
        type: Date,
        default: Date.now()
    },
    sender: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

requestSchema.index(
    { sender: 1, receiver: 1, type: 1, status: 1 },
    { unique: true, partialFilterExpression: { status: "pending" } }
)
export const Request = mongoose.model("Request", requestSchema)