import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    participants: [
        { 
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
        
        }
    ],

    isGroupChat:{
        type: Boolean,
        default: false
    },

    groupName:{
        type:String,
    },

    admins:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],

    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    groupDescription:{
        type:String,
    },

    isPrivateGroup:{
        type:Boolean,
        default:false
    },

    lastMessage:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }
}, { timestamps: true });

export const Chat = mongoose.model("Chat", chatSchema);