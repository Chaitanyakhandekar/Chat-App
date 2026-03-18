import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({

    sender: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    entity: {
        type: mongoose.Types.ObjectId
    },
    type: {
        type: String,
        enum: ["group_add", "mention", "message", "admin_promote"]
    },
    isGroupNotification: {
        type: Boolean,
        default: false
    },
    isRead: {
        type: Boolean,
        default: false
    },
    content: {
        type: String,
        required: true
    },
    renderUrl: {
        type: String
    },
    readBy: [                // For shared notifications (group)
        {
            type: mongoose.Types.ObjectId,
            ref: "User"
        }
    ]

}, { timestamps: true })

export const Notification = mongoose.model("Notification", notificationSchema)