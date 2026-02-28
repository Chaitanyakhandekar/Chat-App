import React, { useState, useRef } from 'react'
import {
    X, ChevronLeft, Camera, Crown, Shield, UserPlus, UserMinus,
    MoreVertical, Search, Bell, BellOff, LogOut, Trash2,
    Check, Copy, Link2, Users, Lock, Globe, ChevronRight,
    Image, FileText, Hash, Settings, Edit3, Star
} from 'lucide-react'

// ─── Mock data (replace with real store/props) ─────────────────────────────
const MOCK_MEMBERS = [
    { _id: '1', username: 'alexmontoya', avtar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', role: 'owner', online: true },
    { _id: '2', username: 'sarahkim', avtar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', role: 'admin', online: true },
    { _id: '3', username: 'devraj_p', avtar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev', role: 'member', online: false },
    { _id: '4', username: 'luna_west', avtar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luna', role: 'member', online: true },
    { _id: '5', username: 'marcus.t', avtar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus', role: 'member', online: false },
    { _id: '6', username: 'priya_s', avtar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya', role: 'member', online: true },
]

const MOCK_GROUP = {
    _id: 'g1',
    name: 'Design Systems Team',
    description: 'Crafting pixel-perfect interfaces and scalable design tokens. 🎨',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=group1',
    createdAt: 'Jan 12, 2025',
    memberCount: 6,
    isPublic: false,
    media: [
        'https://picsum.photos/seed/a/80/80',
        'https://picsum.photos/seed/b/80/80',
        'https://picsum.photos/seed/c/80/80',
        'https://picsum.photos/seed/d/80/80',
        'https://picsum.photos/seed/e/80/80',
        'https://picsum.photos/seed/f/80/80',
    ]
}

const CURRENT_USER_ID = '1' // simulate owner

// ─── Helpers ───────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => {
    if (role === 'owner') return (
        <span className="gi-badge gi-badge-owner"><Crown size={9} strokeWidth={2.5} /> Owner</span>
    )
    if (role === 'admin') return (
        <span className="gi-badge gi-badge-admin"><Shield size={9} strokeWidth={2.5} /> Admin</span>
    )
    return null
}

// ─── Main Component ────────────────────────────────────────────────────────
function GroupInfo({ setActivePanel = () => { }, group = MOCK_GROUP, currentUserId = CURRENT_USER_ID }) {
    const [view, setView] = useState('main') // 'main' | 'members' | 'media' | 'edit'

    return (
        <>
            <style>{`
                /* ── Animations ── */
                .gi-slide { animation: giSlideIn 0.22s cubic-bezier(0.16,1,0.3,1); }
                .gi-sub   { animation: giSubSlide 0.2s cubic-bezier(0.16,1,0.3,1); }
                @keyframes giSlideIn  { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
                @keyframes giSubSlide { from { opacity:0; transform:translateX(10px);  } to { opacity:1; transform:translateX(0); } }

                /* ── Base row ── */
                .gi-row {
                    display:flex; align-items:center; gap:10px;
                    padding:10px 12px; border-radius:10px; cursor:pointer;
                    font-size:13.5px; font-weight:500; color:#c4c6d8;
                    transition:background 0.15s;
                }
                .gi-row:hover  { background:rgba(255,255,255,0.05); }
                .gi-row:active { background:rgba(99,102,241,0.1); }

                /* ── Divider ── */
                .gi-divider { height:1px; background:rgba(255,255,255,0.06); margin:4px 0; }

                /* ── Input ── */
                .gi-input {
                    width:100%; background:#1a1d28; border:1px solid rgba(255,255,255,0.06);
                    border-radius:10px; padding:10px 12px; color:#f1f2f7; font-size:13px;
                    outline:none; transition:border-color .2s, box-shadow .2s;
                    font-family:'Sora',sans-serif;
                }
                .gi-input:focus  { border-color:rgba(99,102,241,.45); box-shadow:0 0 0 3px rgba(99,102,241,.12); }
                .gi-input::placeholder { color:#4a4e6a; }

                /* ── Section label ── */
                .gi-section {
                    font-size:10px; font-weight:600; letter-spacing:1px;
                    text-transform:uppercase; color:#4a4e6a;
                    padding:0 12px 5px; margin-top:10px;
                }

                /* ── Badges ── */
                .gi-badge {
                    display:inline-flex; align-items:center; gap:3px;
                    font-size:9.5px; font-weight:700; letter-spacing:.4px;
                    padding:2px 7px; border-radius:20px;
                }
                .gi-badge-owner { background:rgba(250,204,21,.13); color:#fbbf24; border:1px solid rgba(250,204,21,.25); }
                .gi-badge-admin { background:rgba(99,102,241,.15);  color:#818cf8; border:1px solid rgba(99,102,241,.28); }

                /* ── Member card ── */
                .gi-member {
                    display:flex; align-items:center; gap:10px;
                    padding:9px 12px; border-radius:11px;
                    cursor:pointer; position:relative;
                    transition:background .15s;
                }
                .gi-member:hover { background:rgba(255,255,255,0.04); }
                .gi-member:hover .gi-member-actions { opacity:1; pointer-events:all; }
                .gi-member-actions {
                    opacity:0; pointer-events:none;
                    display:flex; gap:4px;
                    margin-left:auto; flex-shrink:0;
                    transition:opacity .15s;
                }
                .gi-member-btn {
                    display:flex; align-items:center; justify-content:center;
                    width:26px; height:26px; border-radius:8px; border:none; cursor:pointer;
                    font-size:11px; font-weight:600; transition:all .15s;
                }

                /* ── Stat chip ── */
                .gi-stat {
                    display:flex; flex-direction:column; align-items:center; gap:3px;
                    padding:10px 0; flex:1; border-radius:12px;
                    background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05);
                    cursor:pointer; transition:all .15s;
                }
                .gi-stat:hover { background:rgba(99,102,241,0.08); border-color:rgba(99,102,241,0.2); }

                /* ── Save btn ── */
                .gi-save:hover { box-shadow:0 4px 18px rgba(99,102,241,.5) !important; transform:translateY(-1px); }
                .gi-save:active { transform:scale(0.97); }

                /* ── Media thumb ── */
                .gi-media-thumb {
                    border-radius:8px; overflow:hidden; aspect-ratio:1; cursor:pointer;
                    transition:transform .15s, opacity .15s;
                    border:1px solid rgba(255,255,255,0.06);
                }
                .gi-media-thumb:hover { transform:scale(1.04); opacity:.85; }

                /* ── Toggle ── */
                .gi-toggle { width:36px; height:20px; border-radius:20px; position:relative; cursor:pointer; transition:background .2s; flex-shrink:0; }
                .gi-toggle-thumb { position:absolute; top:2px; left:2px; width:16px; height:16px; border-radius:50%; background:#fff; transition:transform .2s; box-shadow:0 1px 4px rgba(0,0,0,.3); }
                .gi-toggle-thumb.on { transform:translateX(16px); }

                /* ── Search ── */
                .gi-search { background:#141720; border:1px solid rgba(255,255,255,0.07); border-radius:10px; padding:9px 12px 9px 34px; color:#f1f2f7; font-size:12.5px; outline:none; font-family:'Sora',sans-serif; transition:border-color .2s, box-shadow .2s; }
                .gi-search:focus { border-color:rgba(99,102,241,.4); box-shadow:0 0 0 3px rgba(99,102,241,.1); }
                .gi-search::placeholder { color:#4a4e6a; }

                /* ── Scrollbar ── */
                .gi-scroll { scrollbar-width:thin; scrollbar-color:#1a1d28 transparent; }
                .gi-scroll::-webkit-scrollbar { width:3px; }
                .gi-scroll::-webkit-scrollbar-thumb { background:#1a1d28; border-radius:4px; }
            `}</style>

            <div className="gi-slide flex flex-col h-full">
                {view === 'main'    && <MainView    group={group} currentUserId={currentUserId} setView={setView} setActivePanel={setActivePanel} />}
                {view === 'members' && <MembersView group={group} currentUserId={currentUserId} setView={setView} />}
                {view === 'media'   && <MediaView   group={group} setView={setView} />}
                {view === 'edit'    && <EditView    group={group} setView={setView} />}
            </div>
        </>
    )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN VIEW
═══════════════════════════════════════════════════════════════════════════ */
function MainView({ group, currentUserId, setView, setActivePanel }) {
    const [muted,   setMuted]   = useState(false)
    const [copied,  setCopied]  = useState(false)
    const isOwner = currentUserId === CURRENT_USER_ID

    const copyInviteLink = () => {
        navigator.clipboard.writeText(`https://chat.app/invite/${group._id}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const Toggle = ({ on, toggle }) => (
        <div className="gi-toggle" style={{ background: on ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.1)' }} onClick={toggle}>
            <div className={`gi-toggle-thumb ${on ? 'on' : ''}`} />
        </div>
    )

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-6 pb-4">
                <span className="text-[15px] font-bold tracking-tight text-[#f1f2f7]">Group Info</span>
                <button onClick={() => setActivePanel(null)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-[#4a4e6a] hover:text-[#818cf8] hover:bg-white/[0.05] transition-all">
                    <X size={15} />
                </button>
            </div>
            <div className="gi-divider mx-5" />

            <div className="flex-1 overflow-y-auto gi-scroll">
                {/* Group avatar + info */}
                <div className="flex flex-col items-center gap-3 px-5 pt-5 pb-4">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-[2.5px] flex items-center justify-center"
                            style={{ borderColor: 'rgba(99,102,241,0.45)', boxShadow: '0 0 28px rgba(99,102,241,0.2)', background: 'linear-gradient(135deg,#1a1d28,#0e1018)' }}>
                            <img src={group.avatar} alt={group.name} className="w-full h-full object-cover" />
                        </div>
                        {isOwner && (
                            <button onClick={() => setView('edit')}
                                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-[1.5px] border-[#0e1018] cursor-pointer transition-all hover:scale-110"
                                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                                <Camera size={11} color="#fff" />
                            </button>
                        )}
                    </div>
                    <div className="text-center">
                        <div className="flex items-center gap-2 justify-center">
                            <p className="text-[16px] font-bold text-[#f1f2f7] tracking-tight">{group.name}</p>
                            {isOwner && (
                                <button onClick={() => setView('edit')} className="text-[#4a4e6a] hover:text-[#818cf8] transition-colors">
                                    <Edit3 size={13} />
                                </button>
                            )}
                        </div>
                        <p className="text-[11.5px] text-[#4a4e6a] mt-0.5">{group.memberCount} members · Created {group.createdAt}</p>
                    </div>
                    {group.description && (
                        <p className="text-center text-[12px] text-[#6b7099] leading-relaxed px-2">{group.description}</p>
                    )}

                    {/* Privacy pill */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                        style={{ background: group.isPublic ? 'rgba(34,211,160,0.08)' : 'rgba(99,102,241,0.08)', border: `1px solid ${group.isPublic ? 'rgba(34,211,160,0.2)' : 'rgba(99,102,241,0.2)'}` }}>
                        {group.isPublic ? <Globe size={11} color="#22d3a0" /> : <Lock size={11} color="#818cf8" />}
                        <span className="text-[11px] font-semibold" style={{ color: group.isPublic ? '#22d3a0' : '#818cf8' }}>
                            {group.isPublic ? 'Public Group' : 'Private Group'}
                        </span>
                    </div>
                </div>

                {/* Quick stats */}
                <div className="px-4 mb-1">
                    <div className="flex gap-2">
                        <div className="gi-stat" onClick={() => setView('members')}>
                            <span className="text-[18px] font-bold text-[#818cf8]">{group.memberCount}</span>
                            <span className="text-[10px] text-[#4a4e6a] font-medium">Members</span>
                        </div>
                        <div className="gi-stat" onClick={() => setView('media')}>
                            <span className="text-[18px] font-bold text-[#818cf8]">{group.media?.length || 0}</span>
                            <span className="text-[10px] text-[#4a4e6a] font-medium">Media</span>
                        </div>
                        <div className="gi-stat">
                            <span className="text-[18px] font-bold text-[#818cf8]">24</span>
                            <span className="text-[10px] text-[#4a4e6a] font-medium">Files</span>
                        </div>
                    </div>
                </div>

                <div className="gi-divider mx-4 my-3" />

                {/* Members preview */}
                <div className="px-3">
                    <div className="gi-row" onClick={() => setView('members')}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(99,102,241,0.15)' }}>
                            <Users size={13} color="#818cf8" />
                        </div>
                        <span>Members</span>
                        {/* Avatar stack */}
                        <div className="flex ml-auto mr-1 items-center">
                            {MOCK_MEMBERS.slice(0, 3).map((m, i) => (
                                <img key={m._id} src={m.avtar} alt=""
                                    className="w-5 h-5 rounded-full object-cover border border-[#0e1018]"
                                    style={{ marginLeft: i > 0 ? '-6px' : 0, zIndex: 3 - i }} />
                            ))}
                        </div>
                        <ChevronRight size={13} color="#4a4e6a" />
                    </div>

                    <div className="gi-row" onClick={() => setView('media')}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(99,102,241,0.15)' }}>
                            <Image size={13} color="#818cf8" />
                        </div>
                        <span>Media & Files</span>
                        <ChevronRight size={13} color="#4a4e6a" className="ml-auto" />
                    </div>

                    {isOwner && (
                        <div className="gi-row" onClick={() => setView('edit')}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ background: 'rgba(99,102,241,0.15)' }}>
                                <Settings size={13} color="#818cf8" />
                            </div>
                            <span>Group Settings</span>
                            <ChevronRight size={13} color="#4a4e6a" className="ml-auto" />
                        </div>
                    )}
                </div>

                <div className="gi-divider mx-4 my-3" />

                {/* Invite link */}
                <div className="px-4 mb-1">
                    <div className="gi-section">Invite</div>
                    <div className="flex items-center gap-2 p-2.5 rounded-[10px] mt-1"
                        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(99,102,241,0.12)' }}>
                            <Link2 size={12} color="#818cf8" />
                        </div>
                        <p className="text-[11px] text-[#4a4e6a] truncate flex-1">chat.app/invite/{group._id}</p>
                        <button onClick={copyInviteLink}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-[7px] text-[11px] font-semibold transition-all"
                            style={{ background: copied ? 'rgba(34,211,160,0.15)' : 'rgba(99,102,241,0.15)', color: copied ? '#22d3a0' : '#818cf8', border: `1px solid ${copied ? 'rgba(34,211,160,0.25)' : 'rgba(99,102,241,0.25)'}` }}>
                            {copied ? <><Check size={10} /> Copied</> : <><Copy size={10} /> Copy</>}
                        </button>
                    </div>
                </div>

                <div className="gi-divider mx-4 my-3" />

                {/* Notifications */}
                <div className="px-3">
                    <div className="gi-section">Preferences</div>
                    <div className="gi-row" style={{ cursor: 'default' }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(99,102,241,0.15)' }}>
                            {muted ? <BellOff size={13} color="#818cf8" /> : <Bell size={13} color="#818cf8" />}
                        </div>
                        <div>
                            <p className="text-[13px]">Mute Notifications</p>
                            <p className="text-[11px] text-[#4a4e6a] font-normal">Silence group messages</p>
                        </div>
                        <div className="ml-auto">
                            <Toggle on={muted} toggle={() => setMuted(p => !p)} />
                        </div>
                    </div>
                </div>

                <div className="gi-divider mx-4 my-3" />

                {/* Danger zone */}
                <div className="px-3 pb-5">
                    <div className="gi-section" style={{ color: '#f87171' }}>Danger Zone</div>
                    <div className="gi-row" style={{ color: '#f87171' }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(248,113,113,0.1)' }}>
                            <LogOut size={13} color="#f87171" />
                        </div>
                        <div>
                            <p className="text-[13px] font-medium">Leave Group</p>
                            <p className="text-[11px] text-[#f87171]/50 font-normal">You won't receive messages</p>
                        </div>
                    </div>
                    {isOwner && (
                        <div className="gi-row" style={{ color: '#f87171' }}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ background: 'rgba(248,113,113,0.1)' }}>
                                <Trash2 size={13} color="#f87171" />
                            </div>
                            <div>
                                <p className="text-[13px] font-medium">Delete Group</p>
                                <p className="text-[11px] text-[#f87171]/50 font-normal">Permanently remove for everyone</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MEMBERS VIEW
═══════════════════════════════════════════════════════════════════════════ */
function MembersView({ group, currentUserId, setView }) {
    const [members, setMembers] = useState(MOCK_MEMBERS)
    const [search, setSearch] = useState('')
    const [openMenu, setOpenMenu] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const isOwner = currentUserId === CURRENT_USER_ID
    const currentUserRole = members.find(m => m._id === currentUserId)?.role || 'member'
    const canManage = isOwner || currentUserRole === 'admin'

    const filtered = members.filter(m => m.username.toLowerCase().includes(search.toLowerCase()))

    const handleRemove = (id) => {
        setMembers(prev => prev.filter(m => m._id !== id))
        setOpenMenu(null)
    }
    const handleMakeAdmin = (id) => {
        setMembers(prev => prev.map(m => m._id === id ? { ...m, role: m.role === 'admin' ? 'member' : 'admin' } : m))
        setOpenMenu(null)
    }

    return (
        <div className="gi-sub flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 pt-6 pb-3">
                <button onClick={() => setView('main')}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-[#4a4e6a] hover:text-[#818cf8] hover:bg-white/[0.05] transition-all">
                    <ChevronLeft size={16} />
                </button>
                <span className="text-[15px] font-bold tracking-tight text-[#f1f2f7]">Members · {members.length}</span>
                {canManage && (
                    <button onClick={() => setShowAddModal(true)}
                        className="ml-auto w-7 h-7 flex items-center justify-center rounded-lg transition-all hover:scale-110"
                        style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                        <UserPlus size={13} color="#fff" />
                    </button>
                )}
            </div>
            <div className="gi-divider mx-5" />

            {/* Search */}
            <div className="px-4 pt-3 pb-2 relative">
                <Search size={13} color="#4a4e6a" className="absolute left-7 top-1/2 -translate-y-1/2 mt-1.5 pointer-events-none" />
                <input
                    className="gi-search w-full"
                    placeholder="Search members…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto gi-scroll px-3 pb-4 flex flex-col gap-0.5">
                {filtered.map(member => {
                    const isCurrentUser = member._id === currentUserId
                    const isSelf = isCurrentUser
                    const canAct = canManage && !isSelf && member.role !== 'owner'
                    const isMenuOpen = openMenu === member._id

                    return (
                        <div key={member._id} className="gi-member" onClick={() => canAct && setOpenMenu(isMenuOpen ? null : member._id)}>
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <img src={member.avtar} alt="" className="w-9 h-9 rounded-full object-cover border border-white/[0.07]" />
                                {member.online && (
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#22d3a0] border-2 border-[#0e1018]" />
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[13px] font-semibold text-[#f1f2f7] truncate">
                                        {member.username}{isSelf ? ' (you)' : ''}
                                    </span>
                                    <RoleBadge role={member.role} />
                                </div>
                                <span className="text-[11px] text-[#4a4e6a]">{member.online ? 'Online' : 'Offline'}</span>
                            </div>

                            {/* Action menu */}
                            {canAct && (
                                <div className="relative ml-auto flex-shrink-0">
                                    <button
                                        className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                                        style={{ background: isMenuOpen ? 'rgba(99,102,241,0.15)' : 'transparent', color: isMenuOpen ? '#818cf8' : '#4a4e6a' }}
                                        onClick={e => { e.stopPropagation(); setOpenMenu(isMenuOpen ? null : member._id) }}>
                                        <MoreVertical size={14} />
                                    </button>

                                    {isMenuOpen && (
                                        <div className="absolute right-0 top-8 z-50 rounded-[12px] overflow-hidden flex flex-col"
                                            style={{ background: '#1a1d28', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', minWidth: '156px' }}>
                                            <button
                                                className="flex items-center gap-2.5 px-3 py-2.5 text-left text-[12.5px] text-[#c4c6d8] font-medium hover:bg-white/[0.05] transition-colors"
                                                onClick={e => { e.stopPropagation(); handleMakeAdmin(member._id) }}>
                                                {member.role === 'admin'
                                                    ? <><UserMinus size={13} color="#818cf8" /> Remove Admin</>
                                                    : <><Shield size={13} color="#818cf8" /> Make Admin</>
                                                }
                                            </button>
                                            {isOwner && (
                                                <button
                                                    className="flex items-center gap-2.5 px-3 py-2.5 text-left text-[12.5px] font-medium hover:bg-white/[0.05] transition-colors"
                                                    style={{ color: '#f87171' }}
                                                    onClick={e => { e.stopPropagation(); handleRemove(member._id) }}>
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

            {/* Add member modal overlay */}
            {showAddModal && <AddMemberModal onClose={() => setShowAddModal(false)} onAdd={(user) => { setMembers(p => [...p, { ...user, role: 'member', online: false }]); setShowAddModal(false) }} />}
        </div>
    )
}

/* ── Add Member Modal ─────────────────────────────────────────────── */
function AddMemberModal({ onClose, onAdd }) {
    const [q, setQ] = useState('')
    const SUGGESTIONS = [
        { _id: '99', username: 'kai_design', avtar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kai' },
        { _id: '100', username: 'nina.rx', avtar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nina' },
        { _id: '101', username: 'theo_dev', avtar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=theo' },
    ]
    const results = SUGGESTIONS.filter(u => u.username.includes(q))

    return (
        <div className="absolute inset-0 z-50 flex flex-col rounded-[inherit] overflow-hidden"
            style={{ background: 'rgba(10,11,15,0.92)', backdropFilter: 'blur(12px)' }}>
            <div className="flex items-center gap-3 px-5 pt-6 pb-4">
                <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#4a4e6a] hover:text-[#818cf8] hover:bg-white/[0.05] transition-all">
                    <ChevronLeft size={16} />
                </button>
                <span className="text-[15px] font-bold tracking-tight text-[#f1f2f7]">Add Members</span>
            </div>
            <div className="gi-divider mx-5" />

            <div className="px-4 pt-3 pb-2 relative">
                <Search size={13} color="#4a4e6a" className="absolute left-7 top-1/2 -translate-y-1/2 mt-1.5 pointer-events-none" />
                <input className="gi-search w-full" placeholder="Search users…" value={q} onChange={e => setQ(e.target.value)} />
            </div>

            <div className="flex-1 overflow-y-auto gi-scroll px-3">
                {results.map(u => (
                    <div key={u._id} className="gi-member">
                        <img src={u.avtar} alt="" className="w-9 h-9 rounded-full object-cover border border-white/[0.07]" />
                        <span className="text-[13px] font-semibold text-[#f1f2f7] flex-1">{u.username}</span>
                        <button onClick={() => onAdd(u)}
                            className="px-2.5 py-1 rounded-[8px] text-[11.5px] font-semibold transition-all hover:opacity-85"
                            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', boxShadow: '0 3px 10px rgba(99,102,241,0.35)' }}>
                            Add
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MEDIA VIEW
═══════════════════════════════════════════════════════════════════════════ */
function MediaView({ group, setView }) {
    const [tab, setTab] = useState('photos')
    const tabs = [{ id: 'photos', label: 'Photos', icon: Image }, { id: 'files', label: 'Files', icon: FileText }, { id: 'links', label: 'Links', icon: Hash }]

    return (
        <div className="gi-sub flex flex-col h-full">
            <div className="flex items-center gap-3 px-5 pt-6 pb-4">
                <button onClick={() => setView('main')} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#4a4e6a] hover:text-[#818cf8] hover:bg-white/[0.05] transition-all">
                    <ChevronLeft size={16} />
                </button>
                <span className="text-[15px] font-bold tracking-tight text-[#f1f2f7]">Media & Files</span>
            </div>
            <div className="gi-divider mx-5" />

            {/* Tabs */}
            <div className="flex gap-1 px-4 pt-3 pb-2">
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-semibold transition-all"
                        style={{
                            background: tab === t.id ? 'linear-gradient(135deg,rgba(99,102,241,0.25),rgba(139,92,246,0.15))' : 'transparent',
                            color: tab === t.id ? '#818cf8' : '#4a4e6a',
                            border: `1px solid ${tab === t.id ? 'rgba(99,102,241,0.3)' : 'transparent'}`
                        }}>
                        <t.icon size={11} /> {t.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto gi-scroll px-4 pb-4">
                {tab === 'photos' && (
                    <div className="grid grid-cols-3 gap-1.5 mt-1">
                        {group.media?.map((src, i) => (
                            <div key={i} className="gi-media-thumb">
                                <img src={src} alt="" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                )}
                {tab === 'files' && (
                    <div className="flex flex-col gap-2 mt-1">
                        {['design_system_v2.fig', 'component_spec.pdf', 'assets.zip'].map((f, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-[11px]"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'rgba(99,102,241,0.15)' }}>
                                    <FileText size={14} color="#818cf8" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[12.5px] font-semibold text-[#f1f2f7] truncate">{f}</p>
                                    <p className="text-[11px] text-[#4a4e6a]">{(Math.random() * 10 + 1).toFixed(1)} MB</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {tab === 'links' && (
                    <div className="flex flex-col gap-2 mt-1">
                        {['figma.com/design/abc', 'notion.so/team/specs', 'github.com/org/repo'].map((l, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-[11px]"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'rgba(34,211,160,0.1)' }}>
                                    <Link2 size={14} color="#22d3a0" />
                                </div>
                                <p className="text-[12px] font-medium text-[#818cf8] truncate flex-1">{l}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════════════════
   EDIT GROUP VIEW
═══════════════════════════════════════════════════════════════════════════ */
function EditView({ group, setView }) {
    const [name, setName]     = useState(group.name)
    const [desc, setDesc]     = useState(group.description)
    const [isPublic, setPublic] = useState(group.isPublic)
    const [saved, setSaved]   = useState(false)

    const handleSave = () => {
        // call API here: groupApi.updateGroup({ name, desc, isPublic })
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    return (
        <div className="gi-sub flex flex-col h-full">
            <div className="flex items-center gap-3 px-5 pt-6 pb-4">
                <button onClick={() => setView('main')} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#4a4e6a] hover:text-[#818cf8] hover:bg-white/[0.05] transition-all">
                    <ChevronLeft size={16} />
                </button>
                <span className="text-[15px] font-bold tracking-tight text-[#f1f2f7]">Group Settings</span>
            </div>
            <div className="gi-divider mx-5" />

            <div className="flex-1 overflow-y-auto gi-scroll px-5 pt-4 pb-4 flex flex-col gap-4">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-2">
                    <div className="relative cursor-pointer group">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-[2.5px] transition-opacity group-hover:opacity-70"
                            style={{ borderColor: 'rgba(99,102,241,0.45)', boxShadow: '0 0 24px rgba(99,102,241,0.2)' }}>
                            <img src={group.avatar} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ background: 'rgba(0,0,0,0.5)' }}>
                            <Camera size={18} color="#fff" />
                        </div>
                    </div>
                    <span className="text-[11px] text-[#4a4e6a]">Tap to change group photo</span>
                </div>

                {/* Fields */}
                <div className="flex flex-col gap-3">
                    <div>
                        <label className="text-[11px] font-semibold text-[#4a4e6a] uppercase tracking-[0.8px] mb-1.5 block">Group Name</label>
                        <input className="gi-input" value={name} onChange={e => setName(e.target.value)} placeholder="Group name" />
                    </div>
                    <div>
                        <label className="text-[11px] font-semibold text-[#4a4e6a] uppercase tracking-[0.8px] mb-1.5 block">Description</label>
                        <textarea className="gi-input resize-none" rows={3} value={desc} onChange={e => setDesc(e.target.value)}
                            placeholder="What's this group about?" style={{ lineHeight: '1.5' }} />
                    </div>

                    {/* Visibility toggle */}
                    <div className="flex items-center justify-between p-3 rounded-[11px]"
                        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                                style={{ background: 'rgba(99,102,241,0.15)' }}>
                                {isPublic ? <Globe size={13} color="#818cf8" /> : <Lock size={13} color="#818cf8" />}
                            </div>
                            <div>
                                <p className="text-[13px] text-[#c4c6d8] font-medium">{isPublic ? 'Public Group' : 'Private Group'}</p>
                                <p className="text-[11px] text-[#4a4e6a]">{isPublic ? 'Anyone can join' : 'Invite only'}</p>
                            </div>
                        </div>
                        <div className="gi-toggle"
                            style={{ background: isPublic ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.1)' }}
                            onClick={() => setPublic(p => !p)}>
                            <div className={`gi-toggle-thumb ${isPublic ? 'on' : ''}`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Save */}
            <div className="px-5 pb-5 pt-2">
                <div className="gi-divider mb-4" />
                <button onClick={handleSave}
                    className="gi-save w-full py-2.5 rounded-[11px] text-white text-sm font-semibold tracking-wide border-none cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
                    style={{ background: saved ? 'linear-gradient(135deg,#22d3a0,#16a37f)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
                    {saved ? <><Check size={15} /> Saved!</> : 'Save Changes'}
                </button>
            </div>
        </div>
    )
}

export default GroupInfo