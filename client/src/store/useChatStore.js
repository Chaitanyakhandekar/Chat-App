import {create} from "zustand"
import {devtools} from "zustand/middleware"
import { getTime } from "../services/getTime"

export const useChatStore = create(
    devtools(
        (set)=>({
            userMessages:{},

            setUserMessages:(chatId,messages)=>(
                set((state)=>({
                    userMessages:{
                        ...state.userMessages,
                        [chatId]:messages
                    }
                }))
            ),

            addMessage:(chatId,message)=>(
                set((state)=>({
                    userMessages:{
                        ...state.userMessages,
                        [chatId]:[
                            ...state.userMessages[chatId] || [],
                            message
                        ]
                    }
                }))
            ),

            replaceMessage:(chatId,tempId,message)=>{
                set((state)=>({
                    userMessages:{
                        ...state.userMessages,
                        [chatId]:[
                            state.userMessages[chatId].map((chat)=>(
                                chat._id  === tempId ? message : chat
                            ))
                        ]
                    }
                }))
            },

            removeMessage:(chatId,messageId)=>{
                set((state)=>({
                    userMessages:{
                        ...state.userMessages,
                        [chatId]: state.userMessages[chatId].filter(message=> message._id !== messageId)
                    }
                }))
            },

            updateSeenStatus:(chatId,messageId,seenStatus)=>{
                set((state)=>({
                    userMessages:{
                        ...state.userMessages,
                        [chatId]: state.userMessages[chatId].map((message)=>{
                            if(message._id === messageId){
                                message.status = seenStatus
                            }
                            return message
                        })
                    }
                }))
            },

            currentChatId:null,

            setCurrentChatId: (chatId)=>(
                set({
                    currentChatId:chatId
                })
            ),

            userChats: [],

            setUserChats: (chats)=>{
                set({
                    userChats:chats
                })
            },


            userSearch:[],

            setUserSearch:(users)=>{
                set({
                    userSearch:users
                })
            },

            chatUsersInfo:{},

            setChatUsersInfo:(chats)=>{
                set({
                    chatUsersInfo:chats.reduce((acc,chat)=>{
                        acc[chat._id] = {
                            typing:false,
                            newMessages: chat.unreadMessagesCount || 0,
                            online:false,
                            time:""
                        }
                        
                        return acc;
                    },{})
                })
            },

            incrementNewMessagesCount:(chatId,time=null)=>{
                set((state)=>({
                    chatUsersInfo:{
                        ...state.chatUsersInfo,
                        [chatId]:{
                            ...state.chatUsersInfo[chatId],
                            newMessages: state.chatUsersInfo[chatId].newMessages + 1,
                            time: time && getTime(time) || null
                        }
                    }
                }))
            },

            incrementNewMessagesCountByN:(chatId,count=0)=>{
                set((state)=>({
                    chatUsersInfo:{
                        ...state.chatUsersInfo,
                        [chatId]:{
                            ...state.chatUsersInfo[chatId],
                            newMessages: count,
                        }
                    }
                }))
            },

            resetNewMessagesCount:(chatId)=>{
                set((state)=>({
                    chatUsersInfo:{
                        ...state.chatUsersInfo,
                        [chatId]:{
                            ...state.chatUsersInfo[chatId],
                            newMessages:0
                        }
                    }
                }))
            },

            emitedTyping:false,

            toogleEmitedTyping:(value)=>{
                set((state)=>({
                    emitedTyping:value
                }))
            },

            setTypingStatus:(chatId,isTyping)=>{
                set((state)=>({
                    chatUsersInfo:{
                        ...state.chatUsersInfo,
                        [chatId]:{
                            ...state.chatUsersInfo[chatId],
                            typing:isTyping
                        }
                    }
                }))
            },

            onlineStatus:{},

            setOnlineStatus:(userId,status)=>{
                set((state)=>({
                    onlineStatus:{
                        ...state.onlineStatus,
                    [userId]: status
                    }
                }))
            },


            mediaFiles:{},

            currentFile:{},

            addMediaFile:(chatId,file)=>{
                set((state)=>({
                    mediaFiles: {
                        ...state.mediaFiles,
                        [chatId]:[
                            ...(state.mediaFiles[chatId]) || [],
                            file
                        ]
                    }
                }))
            },

            removeMediaFile:(chatId,file)=>{
                set(state=>({
                    mediaFiles:{
                        ...state.mediaFiles,
                        [chatId]:state.mediaFiles[chatId].filter(media=> media.preview !== file.preview)
                    }
                }))
            },

            resetMediaFiles:(chatId)=>{
                set(state=>({
                    mediaFiles:{
                        ...state.mediaFiles,
                        [chatId]:[]
                    }
                }))
            },

            setCurrentFile:(file)=>{
                set({
                    currentFile:file
                })
            }

            


        }),
        {name:"Chat Store"}
    )
)