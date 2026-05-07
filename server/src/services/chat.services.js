import { Message } from "../models/message.model.js"
import { User } from "../models/user.model.js"
import { isChatExists } from "../utils/document existance check/chat.js"
import { isMessageExists } from "../utils/document existance check/message.js"
import { isUserExists } from "../utils/document existance check/user.js"
import { summarizeChat } from "./ai.service.js"
import { getMessagesForSummary } from "./message.service.js"

/**
 * @description Service for summarizing chat conversations using AI
 * @param {ObjectId} chatId 
 * @returns Structured summary of the chat 
 */
const summarizeChatService = async (chatId) => {
    // Fetch recent messages for the chat
    const messages = await getMessagesForSummary(chatId, 30); // Get last 30 messages
    // Call the AI summarization function
    const summary = await summarizeChat(messages);
    return summary;
}

export {
    summarizeChatService
}