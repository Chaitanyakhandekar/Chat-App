import {Router} from 'express';
import { Chat } from '../models/chat.model.js';
import { Message } from '../models/message.model.js';
import { Notification } from '../models/notification.model.js';
import { Request } from '../models/request.model.js';

const router = Router();

router.get('/ping', (req, res) => {
    console.log("Received Ping Request")
    res.status(200).json({message: 'pong'});
});

router.get('/delete-all', async(req, res) => {
    await Notification.deleteMany({})
    await Chat.deleteMany({})
    await Message.deleteMany({})
    await Request.deleteMany({})
    res.status(200).json({message: 'Deleted All Data'});
});

export default router;