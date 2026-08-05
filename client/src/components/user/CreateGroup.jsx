import React from 'react'
import { X, Search } from 'lucide-react'
import { userAuthStore } from '../../store/userStore'
import { useGroupChatStore } from '../../store/useGroupChatStore'
import { useGroup } from '../../hooks/useGroup'
import { useNavigate } from 'react-router-dom'

function CreateGroup({
    setActivePanel = () => { },
    users = [],
}) {

    const { user } = userAuthStore()
    const [groupName, setGroupName] = React.useState("")
    const { participants, addParticipant, resetParticipant } = useGroupChatStore()
    const { createGroup } = useGroup()
    const navigate = useNavigate()

    const handleCreateGroup = async () => {
        await createGroup(groupName, participants)
        setActivePanel("chats")
        navigate("/")
    }

    React.useEffect(() => {
        resetParticipant()
    }, [])

    return (
        <div className="flex flex-col h-full bg-surface-800 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-5 pb-3">
                <span className="text-md font-semibold text-text-primary tracking-tight">New Group</span>
                <button onClick={() => setActivePanel(null)} className="btn-icon w-7 h-7">
                    <X size={15} />
                </button>
            </div>
            <div className="h-px bg-border mx-4 mb-3" />

            <div className="px-4 flex flex-col gap-4 pb-4 flex-1 overflow-y-auto custom-scroll">
                <div>
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-text-muted mb-1.5 block">Group Name</label>
                    <input
                        onChange={(e) => setGroupName(e.target.value)}
                        value={groupName}
                        type="text"
                        placeholder="e.g. Design Team"
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-text-muted mb-1.5 block">Add Members</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted" size={14} />
                        <input
                            type="text"
                            placeholder="Search users…"
                            className="input-field pl-8"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1 items-start">
                    {users?.slice(0, 8).map(chat => {
                        if (chat.isGroupChat) return null
                        const u = chat.participants[0]._id === user._id ? chat.participants[1] : chat.participants[0]
                        return (
                            <label key={chat._id} className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-surface-hover cursor-pointer transition-colors duration-150">
                                <input
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            addParticipant(u._id)
                                        }
                                    }}
                                    type="checkbox"
                                    className="w-4 h-4 accent-accent rounded flex-shrink-0 cursor-pointer"
                                />
                                <img src={u?.avtar} alt="" className="w-7 h-7 rounded-full object-cover ring-1 ring-border" />
                                <span className="text-sm font-medium text-text-secondary truncate">{u?.username}</span>
                            </label>
                        )
                    })}
                </div>
            </div>

            <div className="p-4 pt-2">
                <button
                    onClick={handleCreateGroup}
                    disabled={!groupName.trim()}
                    className="btn-primary w-full h-10 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Create Group
                </button>
            </div>
        </div>
    )
}

export default CreateGroup