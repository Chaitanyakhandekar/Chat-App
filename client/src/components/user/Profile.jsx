import React, { useState, useRef } from 'react'
import { userAuthStore } from '../../store/userStore'
import {
    X, User, LogOut, ChevronLeft,
    Camera, Check, Bell, Shield, Palette, Globe, Trash2
} from 'lucide-react'
import { userApi } from '../../api/user.api'
import { useNavigate } from 'react-router-dom'
import { socket } from '../../socket/socket'
import { SettingRow, Toggle } from '../ui/index.js'

function Profile({ setActivePanel = () => {} }) {

    const { user } = userAuthStore()
    const [view, setView] = useState('main') // 'main' | 'edit' | 'settings'

    return (
        <div className="flex flex-col h-[100dvh] bg-surface-800 animate-fade-in">
            {view === 'main' && <MainView user={user} setActivePanel={setActivePanel} setView={setView} />}
            {view === 'edit' && <EditProfileView user={user} setView={setView} />}
            {view === 'settings' && <AccountSettingsView user={user} setView={setView} />}
        </div>
    )
}

/* ─── MAIN VIEW ─────────────────────────────────── */
function MainView({ user, setActivePanel, setView }) {

    const { logout } = userAuthStore()
    const navigate = useNavigate()

    const handleSignOut = async () => {
        try {
            await userApi.logoutUser();
        } catch (error) {
            console.error("Logout API failed:", error);
        }
        logout();
        socket.disconnect();
        navigate('/login');
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-6 pb-4">
                <span className="text-md font-semibold tracking-tight text-text-primary">My Profile</span>
                <button onClick={() => setActivePanel(null)} className="btn-icon w-7 h-7">
                    <X size={15} />
                </button>
            </div>
            <div className="h-px bg-border mx-5" />

            {/* Avatar + info */}
            <div className="flex flex-col items-center gap-3 px-5 pt-5 pb-5">
                <div className="relative">
                    <img
                        src={user?.avtar || user?.avatar}
                        alt={user?.username}
                        className="w-20 h-20 rounded-full object-cover ring-2 ring-accent"
                    />
                    <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-success ring-2 ring-surface-800" />
                </div>
                <div className="text-center">
                    <p className="text-md font-semibold text-text-primary tracking-tight">{user?.username}</p>
                    <p className="text-xs text-text-muted mt-0.5">{user?.email}</p>
                </div>
                {/* Active badge */}
                <div className="w-full p-2.5 rounded-md flex items-center gap-2 bg-success/10 border border-success/20">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-xs text-success font-medium">Active now</span>
                </div>
            </div>
            <div className="h-px bg-border mx-5" />

            {/* Actions */}
            <div className="px-3 pt-3 flex flex-col gap-1 flex-1">
                <SettingRow
                    icon={User}
                    label="Edit Profile"
                    showChevron
                    onClick={() => setView('edit')}
                />

                {/* Sign out pushed to bottom */}
                <div className="mt-auto pt-4 pb-3">
                    <div className="h-px bg-border mb-3" />
                    <SettingRow
                        icon={LogOut}
                        label="Sign Out"
                        danger
                        onClick={handleSignOut}
                    />
                </div>
            </div>
        </div>
    )
}

/* ─── EDIT PROFILE VIEW ──────────────────────────── */
function EditProfileView({ user, setView }) {
    const [name, setName] = useState(user?.name || user?.username || '')
    const [username, setUsername] = useState(user?.username || '')
    const [bio, setBio] = useState(user?.bio || '')
    const [saved, setSaved] = useState(false)
    const [file, setFile] = useState(null)
    const fileRef = useRef(null)

    const handleSave = async () => {
        const updatedData = { name, username, bio }

        let avatarUpdate;
        if(file){
            avatarUpdate = await userApi.updateAvatar(file)
            if(avatarUpdate.success){
                user.avtar = avatarUpdate.data.avtar
            }
        }

        const response = await userApi.updateProfile(updatedData)

        if (response.success) {
            setSaved(true)
        } else {
            alert("Error saving profile changes. Please try again.")
        }
    }

    return (
        <div className="flex flex-col h-full animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 pt-6 pb-4">
                <button onClick={() => setView('main')} className="btn-icon w-7 h-7">
                    <ChevronLeft size={16} />
                </button>
                <span className="text-md font-semibold tracking-tight text-text-primary">Edit Profile</span>
            </div>
            <div className="h-px bg-border mx-5" />

            <div className="flex-1 overflow-y-auto px-5 pt-5 pb-4 flex flex-col gap-5 custom-scroll">
                {/* Avatar upload */}
                <div className="flex flex-col items-center gap-2">
                    <div className="relative cursor-pointer group" onClick={() => fileRef.current?.click()}>
                        <img
                            src={file ? URL.createObjectURL(file) : (user?.avtar || user?.avatar)}
                            alt={user?.username}
                            className="w-20 h-20 rounded-full object-cover ring-2 ring-accent transition-opacity group-hover:opacity-75"
                        />
                        <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                            <Camera size={18} className="text-white" />
                        </div>
                        <input
                            ref={fileRef}
                            onChange={(e)=>{
                                setFile(e.target.files[0])
                            }}
                            type="file"
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                    <span className="text-xs text-text-muted">Click to change photo</span>
                </div>

                {/* Fields */}
                <div className="flex flex-col gap-3">
                    <div>
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 block">Display Name</label>
                        <input
                            className="input-field"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Your display name"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 block">Username</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">@</span>
                            <input
                                className="input-field pl-7"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="username"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 block">Bio</label>
                        <textarea
                            className="input-field h-auto py-2.5 resize-none"
                            rows={3}
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            placeholder="Write something about yourself…"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 block">Email</label>
                        <input
                            className="input-field opacity-50 cursor-not-allowed"
                            value={user?.email || ''}
                            readOnly
                        />
                        <p className="text-[11px] text-text-muted mt-1 ml-1">Email cannot be changed</p>
                    </div>
                </div>
            </div>

            {/* Save btn */}
            <div className="px-5 pb-5 pt-2">
                <div className="h-px bg-border mb-4" />
                <button
                    onClick={handleSave}
                    className={`btn-primary w-full h-10 ${saved ? '!bg-success hover:!bg-success' : ''}`}
                >
                    {saved ? <><Check size={15} /> Saved!</> : 'Save Changes'}
                </button>
            </div>
        </div>
    )
}

/* ─── ACCOUNT SETTINGS VIEW ─────────────────────── */
function AccountSettingsView({ setView }) {
    const [notifications, setNotifications] = useState(true)
    const [sounds, setSounds] = useState(true)
    const [readReceipts, setReadReceipts] = useState(true)
    const [onlineVisible, setOnlineVisible] = useState(true)

    return (
        <div className="flex flex-col h-full animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 pt-6 pb-4">
                <button onClick={() => setView('main')} className="btn-icon w-7 h-7">
                    <ChevronLeft size={16} />
                </button>
                <span className="text-md font-semibold tracking-tight text-text-primary">Account Settings</span>
            </div>
            <div className="h-px bg-border mx-5" />

            <div className="flex-1 overflow-y-auto px-3 pb-4 custom-scroll">
                {/* Notifications */}
                <p className="text-[10px] font-semibold tracking-wider uppercase text-text-muted px-3 pt-3 pb-1">Notifications</p>
                <SettingRow
                    icon={Bell}
                    label="Push Notifications"
                    sublabel="New messages & activity"
                    right={<Toggle on={notifications} onChange={() => setNotifications(p => !p)} label="Push Notifications" />}
                />
                <SettingRow
                    icon={Palette}
                    label="Message Sounds"
                    sublabel="Play sound on new message"
                    right={<Toggle on={sounds} onChange={() => setSounds(p => !p)} label="Message Sounds" />}
                />

                {/* Privacy */}
                <p className="text-[10px] font-semibold tracking-wider uppercase text-text-muted px-3 pt-3 pb-1">Privacy</p>
                <SettingRow
                    icon={Shield}
                    label="Read Receipts"
                    sublabel="Show when you've read messages"
                    right={<Toggle on={readReceipts} onChange={() => setReadReceipts(p => !p)} label="Read Receipts" />}
                />
                <SettingRow
                    icon={Globe}
                    label="Online Status"
                    sublabel="Show when you're active"
                    right={<Toggle on={onlineVisible} onChange={() => setOnlineVisible(p => !p)} label="Online Status" />}
                />

                {/* Danger zone */}
                <p className="text-[10px] font-semibold tracking-wider uppercase text-danger px-3 pt-3 pb-1">Danger Zone</p>
                <SettingRow
                    icon={Trash2}
                    label="Delete Account"
                    sublabel="This action is irreversible"
                    danger
                />
            </div>
        </div>
    )
}

export default Profile