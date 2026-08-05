import React, { useState } from 'react'
import {
    X, ChevronLeft, Camera, Crown, Shield, UserPlus, UserMinus,
    MoreVertical, Search, Bell, BellOff, LogOut, Trash2,
    Check, Copy, Link2, Users, Lock, Globe, ChevronRight,
    Image, FileText, Hash, Settings, Edit3
} from 'lucide-react'
import { useChatStore } from '../../store/useChatStore'
import { useGroupChatStore } from '../../store/useGroupChatStore'
import { useRef } from 'react'
import { useEffect } from 'react'
import { groupApi } from '../../api/group.api'
import { userAuthStore } from '../../store/userStore'
import Swal from "sweetalert2"
import { useGroup } from '../../hooks/useGroup'

// ─── Mock data ─────────────────────────────────────────────────────────────
const MOCK_MEMBERS = [
    { _id: '1', username: 'alexmontoya', avtar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', role: 'owner', online: true },
    { _id: '2', username: 'sarahkim', avtar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', role: 'admin', online: true },
    { _id: '3', username: 'devraj_p', avtar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev', role: 'member', online: false },
    { _id: '4', username: 'luna_west', avtar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luna', role: 'member', online: true },
    { _id: '5', username: 'marcus.t', avtar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus', role: 'member', online: false },
    { _id: '6', username: 'priya_s', avtar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya', role: 'member', online: true },
]

const MOCK_GROUP = {}

const CURRENT_USER_ID = '1'

// ─── Role Badge ────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => {
    if (role === 'owner') return (
        <span className="inline-flex items-center gap-[3px] text-2xs font-bold tracking-[0.4px] px-[7px] py-[2px] rounded-full bg-warning/15 text-warning border border-warning/25">
            <Crown size={9} strokeWidth={2.5} /> Owner
        </span>
    )
    if (role === 'admin') return (
        <span className="inline-flex items-center gap-[3px] text-2xs font-bold tracking-[0.4px] px-[7px] py-[2px] rounded-full bg-accent/15 text-accent-light border border-accent/30">
            <Shield size={9} strokeWidth={2.5} /> Admin
        </span>
    )
    return null
}

// ─── Toggle ────────────────────────────────────────────────────────────────
const Toggle = ({ on, toggle }) => (
    <div
        onClick={toggle}
        className={`relative w-9 h-5 rounded-full cursor-pointer flex-shrink-0 transition-all duration-200 ${on ? 'bg-accent' : 'bg-surface-600'
            }`}
    >
        <div className={`absolute top-[2px] left-[2px] w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-200 ${on ? 'translate-x-4' : 'translate-x-0'}`} />
    </div>
)

// ─── Shared sub-view header ────────────────────────────────────────────────
const SubHeader = ({ title, onBack, action }) => (
    <>
        <div className="flex items-center gap-3 px-5 pt-6 pb-4">
            <button
                onClick={onBack}
                className="w-7 h-7 flex items-center justify-center rounded-sm text-text-muted hover:text-accent-light hover:bg-surface-hover transition-all"
            >
                <ChevronLeft size={16} />
            </button>
            <span className="text-md font-bold tracking-tight text-text-primary">{title}</span>
            {action && <div className="ml-auto">{action}</div>}
        </div>
        <div className="h-px bg-border mx-5" />
    </>
)

// ─── Section label ─────────────────────────────────────────────────────────
const SectionLabel = ({ children, danger }) => (
    <p className={`text-2xs font-semibold tracking-[1px] uppercase px-3 pb-[5px] mt-[10px] ${danger ? 'text-danger' : 'text-text-muted'}`}>
        {children}
    </p>
)

// ─── Generic action row ────────────────────────────────────────────────────
const ActionRow = ({ onClick, iconBg, icon, label, sublabel, right, danger }) => (
    <div
        onClick={onClick}
        className={`flex items-center gap-[10px] px-3 py-[10px] rounded-md cursor-pointer transition-colors duration-150 ${danger ? 'hover:bg-danger/10' : 'hover:bg-surface-hover active:bg-accent/15'
            }`}
    >
        <div className={`w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0 ${iconBg || (danger ? 'bg-danger/10' : 'bg-accent/15')}`}>
            {icon}
        </div>
        <div className="flex flex-col min-w-0">
            <span className={`text-sm font-medium ${danger ? 'text-danger' : 'text-text-secondary'}`}>{label}</span>
            {sublabel && <span className={`text-xs font-normal ${danger ? 'text-danger/50' : 'text-text-muted'}`}>{sublabel}</span>}
        </div>
        {right && <div className="ml-auto flex-shrink-0">{right}</div>}
    </div>
)

// ═══════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════
function GroupInfo({ setActivePanel = () => { }, group = MOCK_GROUP, currentUserId = CURRENT_USER_ID }) {
    const [view, setView] = useState('main')
    const [mediaData, setMediaData] = useState(null)
    const [mediaLoading, setMediaLoading] = useState(false)
    const groupId = group?._id

    useEffect(() => {
        if (!groupId) return
        const fetchMedia = async () => {
            setMediaLoading(true)
            const res = await groupApi.getGroupMedia(groupId)
            if (res.success) {
                setMediaData(res.data)
            }
            setMediaLoading(false)
        }
        fetchMedia()
    }, [groupId])

    return (
        <div className="flex flex-col h-full w-full bg-surface-800">
            {view === 'main' && <MainView group={group} currentUserId={currentUserId} setView={setView} setActivePanel={setActivePanel} mediaData={mediaData} />}
            {view === 'members' && <MembersView group={group} currentUserId={currentUserId} setView={setView} />}
            {view === 'media' && <MediaView setView={setView} mediaData={mediaData} mediaLoading={mediaLoading} />}
            {view === 'edit' && <EditView group={group} setView={setView} />}
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN VIEW
// ═══════════════════════════════════════════════════════════════════════════
function MainView({ group, currentUserId, setView, setActivePanel, mediaData }) {
    const [muted, setMuted] = useState(false)
    const [copied, setCopied] = useState(false)
    const isOwner = currentUserId === CURRENT_USER_ID
    const { groupChat } = useGroupChatStore();
    const { leaveGroup, deleteGroup } = useGroup()

    const copyLink = () => {
        navigator.clipboard.writeText(`https://chat.app/invite/${groupChat._id}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleLeaveGroup = async () => {
        await leaveGroup(group?._id)
    }

    const handleDeleteGroup = async () => {
        await deleteGroup(group?._id)
    }

    return (
        <div className="flex flex-col h-full bg-surface-800">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-6 pb-4">
                <span className="text-md font-bold tracking-tight text-text-primary">Group Info</span>
                <button
                    onClick={() => setActivePanel(null)}
                    className="w-7 h-7 flex items-center justify-center rounded-sm text-text-muted hover:text-accent-light hover:bg-surface-hover transition-all"
                >
                    <X size={15} />
                </button>
            </div>
            <div className="h-px bg-border mx-5" />

            {/* Body */}
            <div className="flex-1 overflow-y-auto custom-scroll">

                {/* Avatar + info block */}
                <div className="flex flex-col items-center gap-3 px-5 pt-5 pb-4">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-lg overflow-hidden border-[2.5px] border-accent/50 shadow-panel">
                            <img src={groupChat?.groupPicture || group?.name} alt={group?.name} className="w-full h-full object-cover" />
                        </div>
                        {isOwner && (
                            <button
                                onClick={() => setView('edit')}
                                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-[1.5px] border-surface-800 bg-accent hover:scale-110 transition-transform"
                            >
                                <Camera size={11} color="#fff" />
                            </button>
                        )}
                    </div>

                    <div className="text-center">
                        <div className="flex items-center gap-2 justify-center">
                            <p className="text-lg font-bold text-text-primary tracking-tight">{group?.name}</p>
                            {isOwner && (
                                <button onClick={() => setView('edit')} className="text-text-muted hover:text-accent-light transition-colors">
                                    <Edit3 size={13} />
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">{group?.memberCount} members · Created {group?.createdAt}</p>
                    </div>

                    {group?.description && (
                        <p className="text-center text-xs text-text-dim leading-relaxed px-2">{group?.description}</p>
                    )}

                    {/* Privacy pill */}
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${group?.isPublic
                        ? 'bg-success/10 border-success/20'
                        : 'bg-accent/10 border-accent/20'
                        }`}>
                        {group?.isPublic
                            ? <Globe size={11} color="#22c55e" />
                            : <Lock size={11} color="#818cf8" />}
                        <span className={`text-xs font-semibold ${group?.isPublic ? 'text-success' : 'text-accent-light'}`}>
                            {group?.isPublic ? 'Public Group' : 'Private Group'}
                        </span>
                    </div>
                </div>

                {/* Quick stats */}
                <div className="px-4 mb-1">
                    <div className="flex gap-2">
                        {[
                            { label: 'Members', value: group?.memberCount, dest: 'members' },
                            { label: 'Photos', value: mediaData?.photos?.length || 0, dest: 'media' },
                            { label: 'Links', value: mediaData?.links?.length || 0, dest: 'media' },
                        ].map(s => (
                            <button
                                key={s.label}
                                onClick={() => s.dest && setView(s.dest)}
                                className="flex flex-col items-center gap-[3px] py-[10px] flex-1 rounded-md bg-surface-900 border border-border hover:bg-accent/15 hover:border-accent/25 transition-all duration-150 cursor-pointer"
                            >
                                <span className="text-lg font-bold text-accent-light">{s.value}</span>
                                <span className="text-2xs text-text-muted font-medium">{s.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-border mx-4 my-3" />

                {/* Navigation rows */}
                <div className="px-3">
                    {/* Members row (custom — needs avatar stack) */}
                    <div
                        onClick={() => setView('members')}
                        className="flex items-center gap-[10px] px-3 py-[10px] rounded-md cursor-pointer text-sm font-medium text-text-secondary hover:bg-surface-hover transition-colors"
                    >
                        <div className="w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0 bg-accent/15">
                            <Users size={13} color="#818cf8" />
                        </div>
                        <span>Members</span>
                        <div className="flex ml-auto mr-1 items-center">
                            {MOCK_MEMBERS.slice(0, 3).map((m, i) => (
                                <img
                                    key={m._id} src={m.avtar} alt=""
                                    className="w-5 h-5 rounded-full object-cover border border-surface-800"
                                    style={{ marginLeft: i > 0 ? '-6px' : 0, zIndex: 3 - i }}
                                />
                            ))}
                        </div>
                        <ChevronRight size={13} color="#5e647e" />
                    </div>

                    <ActionRow
                        onClick={() => setView('media')}
                        icon={<Image size={13} color="#818cf8" />}
                        label="Media & Files"
                        right={<ChevronRight size={13} color="#5e647e" />}
                    />

                    {isOwner && (
                        <ActionRow
                            onClick={() => setView('edit')}
                            icon={<Settings size={13} color="#818cf8" />}
                            label="Group Settings"
                            right={<ChevronRight size={13} color="#5e647e" />}
                        />
                    )}
                </div>

                <div className="h-px bg-border mx-4 my-3" />

                {/* Invite link */}
                <div className="px-4 mb-1">
                    <SectionLabel>Invite</SectionLabel>
                    <div className="flex items-center gap-2 p-2.5 rounded-md bg-surface-900 border border-border mt-1">
                        <div className="w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0 bg-accent/15">
                            <Link2 size={12} color="#818cf8" />
                        </div>
                        <p className="text-xs text-text-muted truncate flex-1">chat.app/invite/{group?._id}</p>
                        <button
                            onClick={copyLink}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs font-semibold transition-all border ${copied
                                ? 'bg-success/15 text-success border-success/25'
                                : 'bg-accent/15 text-accent-light border-accent/25 hover:bg-accent/25'
                                }`}
                        >
                            {copied ? <><Check size={10} /> Copied</> : <><Copy size={10} /> Copy</>}
                        </button>
                    </div>
                </div>

                <div className="h-px bg-border mx-4 my-3" />

                {/* Preferences */}
                <div className="px-3">
                    <SectionLabel>Preferences</SectionLabel>
                    <div className="flex items-center gap-[10px] px-3 py-[10px] rounded-md text-text-secondary">
                        <div className="w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0 bg-accent/15">
                            {muted ? <BellOff size={13} color="#818cf8" /> : <Bell size={13} color="#818cf8" />}
                        </div>
                        <div>
                            <p className="text-sm font-medium">Mute Notifications</p>
                            <p className="text-xs text-text-muted">Silence group messages</p>
                        </div>
                        <div className="ml-auto">
                            <Toggle on={muted} toggle={() => setMuted(p => !p)} />
                        </div>
                    </div>
                </div>

                <div className="h-px bg-border mx-4 my-3" />

                {/* Danger zone */}
                <div className="px-3 pb-5">
                    <SectionLabel danger>Danger Zone</SectionLabel>
                    <ActionRow
                        onClick={handleLeaveGroup}
                        danger
                        icon={<LogOut size={13} color="#ef4444" />}
                        label="Leave Group"
                        sublabel="You won't receive messages"
                    />
                    {isOwner && (
                        <ActionRow
                            onClick={handleDeleteGroup}
                            danger
                            icon={<Trash2 size={13} color="#ef4444" />}
                            label="Delete Group"
                            sublabel="Permanently remove for everyone"
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// MEMBERS VIEW
// ═══════════════════════════════════════════════════════════════════════════
function MembersView({ group, currentUserId, setView }) {
    const [members, setMembers] = useState(MOCK_MEMBERS)
    const [search, setSearch] = useState('')
    const [openMenu, setOpenMenu] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const { currentGroupParticipants, groupChat } = useGroupChatStore();
    const { user } = userAuthStore()
    const { onlineStatus } = useChatStore();

    const isOwner = currentUserId === CURRENT_USER_ID
    const currentRole = members.find(m => m._id === currentUserId)?.role || 'member'
    const canManage = isOwner || currentRole === 'admin'

    const handleRemove = (id) => { setMembers(p => p.filter(m => m._id !== id)); setOpenMenu(null) }

    const handleToggleAdmin = async (member) => {

        if (member.isAdmin) {
            await groupApi.unmarkMemberAsAdmin(groupChat._id, member._id)
        }
        else {
            await groupApi.markMemberAsAdmin(groupChat._id, member._id)
        }
        setOpenMenu(null)
    }

    return (
        <div className="flex flex-col h-full bg-surface-800">
            <SubHeader
                title={`Members · ${new Array(group?.participants).length}`}
                onBack={() => setView('main')}
                action={canManage && (
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="w-7 h-7 flex items-center justify-center rounded-sm bg-accent hover:scale-110 transition-transform"
                    >
                        <UserPlus size={13} color="#fff" />
                    </button>
                )}
            />

            {/* Search */}
            <div className="px-4 pt-3 pb-2 relative">
                <Search size={13} color="#5e647e" className="absolute left-7 top-[50%] -translate-y-[40%] pointer-events-none" />
                <input
                    className="w-full bg-surface-900 border border-border rounded-sm py-[9px] pl-8 pr-3 text-text-primary text-xs outline-none placeholder:text-text-muted focus:border-accent/40 focus:ring-2 focus:ring-accent/15 transition-all"
                    placeholder="Search members…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scroll px-3 pb-4 flex flex-col gap-0.5">
                {currentGroupParticipants?.map(member => {
                    const isSelf = member._id === currentUserId
                    const canAct = canManage && !isSelf && member?.role !== 'owner' || ""
                    const menuOpen = openMenu === member._id

                    return (
                        <div
                            key={member._id}
                            className="group/member flex items-center gap-[10px] px-3 py-[9px] rounded-md hover:bg-surface-hover transition-colors relative"
                        >
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <img src={member.avtar} alt="" className="w-9 h-9 rounded-full object-cover border border-border" />
                                {onlineStatus[member._id] && (
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success border-2 border-surface-800" />
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-sm font-semibold text-text-primary truncate">
                                        {member._id === user._id ? "you" : member.username}
                                    </span>
                                    <RoleBadge role={
                                        member._id === group?.ownerId ? 'owner' :
                                            member.isAdmin ? 'admin' :
                                                null
                                    } />
                                </div>
                                <span className="text-xs text-text-muted">{onlineStatus[member._id] ? 'Online' : 'Offline'}</span>
                            </div>

                            {/* Context menu trigger */}
                            {canAct && (
                                <div className="relative ml-auto flex-shrink-0">
                                    <button
                                        className={`w-7 h-7 flex items-center justify-center rounded-sm transition-all
                                            ${menuOpen
                                                ? 'bg-accent/15 text-accent-light'
                                                : 'text-text-muted opacity-0 group-hover/member:opacity-100'
                                            }`}
                                        onClick={e => { e.stopPropagation(); setOpenMenu(menuOpen ? null : member._id) }}
                                    >
                                        <MoreVertical size={14} />
                                    </button>

                                    {menuOpen && (
                                        <div className="absolute right-0 top-8 z-50 rounded-md overflow-hidden flex flex-col bg-surface-900 border border-border shadow-overlay min-w-[156px]">
                                            <button
                                                className="flex items-center gap-2.5 px-3 py-2.5 text-left text-xs text-text-secondary font-medium hover:bg-surface-hover transition-colors"
                                                onClick={e => { e.stopPropagation(); handleToggleAdmin(member) }}
                                            >
                                                {member.isAdmin
                                                    ? <><UserMinus size={13} color="#818cf8" /> Remove Admin</>
                                                    : <><Shield size={13} color="#818cf8" /> Make Admin</>}
                                            </button>
                                            {isOwner && (
                                                <button
                                                    className="flex items-center gap-2.5 px-3 py-2.5 text-left text-xs text-danger font-medium hover:bg-surface-hover transition-colors"
                                                    onClick={e => { e.stopPropagation(); handleRemove(member._id) }}
                                                >
                                                    <UserMinus size={13} /> Remove Member
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {showAddModal && (
                <AddMemberModal
                    onClose={() => setShowAddModal(false)}
                    onAdd={() => setShowAddModal(false)}
                    group={group}
                />
            )}
        </div>
    )
}

// ─── Add Member Modal ──────────────────────────────────────────────────────
function AddMemberModal({ onClose, onAdd, group }) {
    const [q, setQ] = useState('')
    const { groupChat } = useGroupChatStore();
    const SUGGESTIONS = [
        { _id: '99', username: 'kai_design', avtar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kai' },
        { _id: '100', username: 'nina.rx', avtar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nina' },
        { _id: '101', username: 'theo_dev', avtar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=theo' },
    ]
    const [results, setResults] = useState([])

    const getUsers = async () => {
        const users = await groupApi.getUserChatUsersExceptGroupMembers(groupChat._id)
        if (users.success) {
            setResults(users.data)

        }
    }

    const handleAddMember = async (userId, username) => {
        const res = await groupApi.addMemberToGroup(groupChat._id, userId)
        if (res.success) {
            onAdd()
            Swal.fire({
                icon: "success",
                title: `User Added to Group`,
                html: `<b>${username}</b> has been added to <b>${group?.name}</b>.`,
                confirmButtonText: "OK",
            });
        }
    }

    useEffect(() => {
        getUsers()
    }, [])



    return (
        <div className="absolute inset-0 z-50 flex flex-col bg-background/95 overflow-hidden">
            <SubHeader title="Add Members" onBack={onClose} />

            <div className="px-4 pt-3 pb-2 relative">
                <Search size={13} color="#5e647e" className="absolute left-7 top-[50%] -translate-y-[40%] pointer-events-none" />
                <input
                    className="w-full bg-surface-900 border border-border rounded-sm py-[9px] pl-8 pr-3 text-text-primary text-xs outline-none placeholder:text-text-muted focus:border-accent/40 transition-all"
                    placeholder="Search users…"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                />
            </div>

            <div className="flex-1 overflow-y-auto px-3">
                {results?.map(u => (
                    <div key={u._id} className="flex items-center gap-[10px] px-3 py-[9px] rounded-md hover:bg-surface-hover transition-colors">
                        <img src={u.avtar} alt="" className="w-9 h-9 rounded-full object-cover border border-border" />
                        <span className="text-sm font-semibold text-text-primary flex-1">{u.username}</span>
                        <button
                            onClick={() => { handleAddMember(u._id, u.username) }}
                            className="px-2.5 py-1 rounded-sm text-xs font-semibold bg-accent text-white shadow-panel hover:opacity-85 transition-opacity"
                        >
                            Add
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// MEDIA VIEW
// ═══════════════════════════════════════════════════════════════════════════
function MediaView({ setView, mediaData, mediaLoading }) {
    const [tab, setTab] = useState('photos')
    const tabs = [
        { id: 'photos', label: 'Photos', Icon: Image },
        { id: 'files', label: 'Files', Icon: FileText },
        { id: 'links', label: 'Links', Icon: Hash },
    ]

    const photos = mediaData?.photos || []
    const links = mediaData?.links || []

    return (
        <div className="flex flex-col h-full bg-surface-800">
            <SubHeader title="Media & Files" onBack={() => setView('main')} />

            {/* Tabs */}
            <div className="flex gap-1 px-4 pt-3 pb-2">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold transition-all border ${tab === t.id
                            ? 'bg-accent/20 text-accent-light border-accent/30'
                            : 'bg-transparent text-text-muted border-transparent hover:text-accent-light'
                            }`}
                    >
                        <t.Icon size={11} /> {t.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto custom-scroll px-4 pb-4">
                {mediaLoading ? (
                    <div className="flex items-center justify-center h-full text-sm text-text-muted">Loading...</div>
                ) : tab === 'photos' && (
                    photos.length > 0 ? (
                        <div className="grid grid-cols-3 gap-1.5 mt-1">
                            {photos.map((photo, i) => (
                                <div key={photo.public_id || i} className="rounded-sm overflow-hidden aspect-square cursor-pointer border border-border hover:scale-[1.04] hover:opacity-85 transition-all duration-150">
                                    <img src={photo.url} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-sm text-text-muted gap-2">
                            <Image size={24} color="#5e647e" />
                            No photos shared yet
                        </div>
                    )
                )}

                {tab === 'files' && (
                    <div className="flex flex-col items-center justify-center h-40 text-sm text-text-muted gap-2 mt-1">
                        <FileText size={24} color="#5e647e" />
                        No files shared yet
                    </div>
                )}

                {tab === 'links' && (
                    links.length > 0 ? (
                        <div className="flex flex-col gap-2 mt-1">
                            {links.map((link, i) => (
                                <a
                                    key={link.messageId + String(i)}
                                    href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 rounded-md bg-surface-900 border border-border hover:bg-accent/15 hover:border-accent/25 transition-all"
                                >
                                    <div className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 bg-success/10">
                                        <Link2 size={14} color="#22c55e" />
                                    </div>
                                    <p className="text-xs font-medium text-accent-light truncate flex-1">{link.url}</p>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-sm text-text-muted gap-2 mt-1">
                            <Hash size={24} color="#5e647e" />
                            No links shared yet
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// EDIT GROUP VIEW
// ═══════════════════════════════════════════════════════════════════════════
function EditView({ group, setView }) {
    const { groupChat, setGroupChat } = useGroupChatStore();
    const [name, setName] = useState(groupChat?.groupName || group?.name)
    const [desc, setDesc] = useState(groupChat?.groupDescription || group?.groupDescription)
    const [saved, setSaved] = useState(false)
    const [file, setFile] = useState(null);
    const fileRef = useRef(null)

    const handleSave = async () => {
        if (file) {
            const formData = new FormData();
            formData.append("groupPicture", file);
            const uploadRes = await groupApi.uploadGroupPicture(groupChat._id, formData);
            setGroupChat({ ...groupChat, groupPicture: uploadRes.data.groupPicture })
        }
        await groupApi.updateGroupChat(groupChat._id, name, desc);
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    const handleFileClick = () => {
        fileRef.current.click();
    }

    return (
        <div className="flex flex-col h-full bg-surface-800">
            <SubHeader title="Group Settings" onBack={() => setView('main')} />

            <div className="flex-1 overflow-y-auto custom-scroll px-5 pt-4 pb-4 flex flex-col gap-4">

                {/* Avatar */}
                <div className="flex flex-col items-center gap-2">
                    <div className="relative cursor-pointer group/avatar">
                        <div className="w-20 h-20 rounded-lg overflow-hidden border-[2.5px] border-accent/50 shadow-panel group-hover/avatar:opacity-70 transition-opacity">
                            <img src={groupChat && !file ? groupChat?.groupPicture : groupChat && file ? URL.createObjectURL(file) : ""} alt="" className="w-full h-full object-cover" />
                            <input
                                ref={fileRef}
                                onChange={(e) => {
                                    setFile(e.target.files[0])
                                }}
                                className='hidden'
                                type="file" />
                        </div>
                        <div
                            onClick={handleFileClick}
                            className="absolute inset-0 rounded-lg flex items-center justify-center bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                            <Camera size={18} color="#fff" />
                        </div>
                    </div>
                    <span className="text-xs text-text-muted">Tap to change group photo</span>
                </div>

                {/* Fields */}
                <div className="flex flex-col gap-3">
                    <div>
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-[0.8px] mb-1.5 block">Group Name</label>
                        <input
                            className="w-full bg-surface-900 border border-border rounded-sm px-3 py-[10px] text-text-primary text-sm outline-none placeholder:text-text-muted focus:border-accent/45 focus:ring-2 focus:ring-accent/15 transition-all"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Group name"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-[0.8px] mb-1.5 block">Description</label>
                        <textarea
                            className="w-full bg-surface-900 border border-border rounded-sm px-3 py-[10px] text-text-primary text-sm outline-none placeholder:text-text-muted focus:border-accent/45 focus:ring-2 focus:ring-accent/15 transition-all resize-none leading-relaxed"
                            rows={3}
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                            placeholder="What's this group about?"
                        />
                    </div>
                </div>
            </div>

            {/* Save button */}
            <div className="px-5 pb-5 pt-2">
                <div className="h-px bg-border mb-4" />
                <button
                    onClick={handleSave}
                    className={`w-full py-2.5 rounded-md text-white text-sm font-semibold tracking-wide border-none cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-px active:scale-[0.97] ${saved
                        ? 'bg-success shadow-panel'
                        : 'bg-accent shadow-panel'
                        }`}
                >
                    {saved ? <><Check size={15} /> Saved!</> : 'Save Changes'}
                </button>
            </div>
        </div>
    )
}

export default GroupInfo
