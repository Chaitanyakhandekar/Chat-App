import {create} from "zustand"
import {devtools} from "zustand/middleware"

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
                            newMessages:0,
                            online:false
                        }
                        
                        return acc;
                    },{})
                })
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

            setOnlineStatus:(userId)=>{
                
            }

        }),
        {name:"Chat Store"}
    )
)