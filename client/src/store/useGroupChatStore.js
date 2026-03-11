import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useGroupChatStore = create(
    devtools(
        (set)=>({
             groupChat:null,

            setGroupChat:(chat)=>{
                set({
                    groupChat:chat
                })
            },

            newGroupNotication:false,

            setNewGroupNotification:(value)=>{
                set({
                    newGroupNotication:value
                })
            },

            newGroupInfo:null,

            setNewGroupInfo:(info)=>{
                (set)=>({
                    newGroupInfo:info
                })
            },

            participants:[],

            addParticipant:(newParticipant)=>{
                set((state)=>({
                    participants:[...state.participants, newParticipant]
                }))
            },

            resetParticipant:()=>{
                (set)=>({
                    participants:[]
                })
            },

            currentGroupParticipants:[],

            setCurrentGroupParticipants:(participants=[])=>{
                set({
                    currentGroupParticipants:participants
                })
            },

            
        
        })
    )
)