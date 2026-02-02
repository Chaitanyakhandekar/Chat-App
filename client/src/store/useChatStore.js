import {create} from "zustand"
import {devtools} from "zustand/middleware"

export const useChatStore = create(
    devtools(
        (set)=>({
            userMessages:{},

            addMessage:(chatId,message)=>(
                set((state)=>({
                    userMessages:{
                        ...state.userMessages,
                        [chatId]:[...(state.userMessages[chatId] || []),message]
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
            }
        })
    )
)