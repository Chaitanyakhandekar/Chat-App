import React from 'react'
import { useGroupChatStore } from '../store/useGroupChatStore'
import { chatApi } from '../api/chat.api'
import { useChatStore } from '../store/useChatStore'
import { requestApi } from '../api/request.api'

export const useRequest = () => {

    const { setNewGroupInfo, GroupInfo, newGroupNotication, setNewGroupNotification, participants, resetParticipant } = useGroupChatStore()
    const { universalInfo, updateNotificationsCount, incrementNotificationCount, setRequests, requests } = useChatStore()
    const [loading, setLoading] = React.useState(false)


    const createGroup = async (groupName, participants) => {
        setLoading(true)
        console.log("Creating Group with Data :: ", participants)
        const response = await chatApi.createGroupChat(groupName, participants)
    }

    const fetchRequests = async () => {
        setLoading(true)
        const response = await requestApi.getMyRequests()
        if (response.success) {
            setRequests(response.data)
            updateNotificationsCount(response.data.length)
        }
        setLoading(false)
    }

    const acceptRequest = async (requestId) => {
        const response = await requestApi;
    }


    return {

        loading,
        setLoading,
        createGroup,
        fetchRequests,
        acceptRequest
    }
}