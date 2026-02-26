import React from 'react'
import { userAuthStore } from '../../store/userStore'
import { X, User, Settings, LogOut, ChevronRight } from 'lucide-react'

function Profile({
    setActivePanel=()=>{},
}) {

    const {user} = userAuthStore()

  return (
      <div className="slide-in-panel flex flex-col h-full">
                            <div className="flex items-center justify-between px-5 pt-6 pb-4">
                                <span className="text-[15px] font-bold tracking-tight">My Profile</span>
                                <button onClick={() => setActivePanel(null)} className="text-[#4a4e6a] hover:text-[#818cf8] transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="panel-divider" />
                            <div className="flex flex-col items-center gap-3 px-5 pt-3 pb-5">
                                <div className="relative">
                                    <img src={user?.avtar || user?.avatar} alt={user?.username}
                                        className="w-20 h-20 rounded-full object-cover border-[3px]"
                                        style={{ borderColor: 'rgba(99,102,241,0.5)', boxShadow: '0 0 24px rgba(99,102,241,0.25)' }} />
                                    <div className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-[#22d3a0] border-2 border-[#0e1018]" />
                                </div>
                                <div className="text-center">
                                    <p className="text-[16px] font-bold text-[#f1f2f7] tracking-tight">{user?.username}</p>
                                    <p className="text-[12px] text-[#4a4e6a] mt-0.5">{user?.email}</p>
                                </div>
                                <div className="w-full mt-1 p-3 rounded-[12px] flex items-center gap-2"
                                    style={{ background: 'rgba(34,211,160,0.08)', border: '1px solid rgba(34,211,160,0.2)' }}>
                                    <div className="w-2 h-2 rounded-full bg-[#22d3a0]" />
                                    <span className="text-[12px] text-[#22d3a0] font-medium">Active now</span>
                                </div>
                            </div>
                            <div className="panel-divider" />
                            <div className="px-3 flex flex-col gap-0.5">
                                <div className="action-row">
                                    <User size={15} color="#6366f1" />
                                    <span>Edit Profile</span>
                                    <ChevronRight size={13} color="#4a4e6a" className="ml-auto" />
                                </div>
                                <div className="action-row">
                                    <Settings size={15} color="#6366f1" />
                                    <span>Account Settings</span>
                                    <ChevronRight size={13} color="#4a4e6a" className="ml-auto" />
                                </div>
                                <div className="action-row" style={{ color: '#f87171' }}>
                                    <LogOut size={15} color="#f87171" />
                                    <span>Sign Out</span>
                                </div>
                            </div>
                        </div>
  )
}

export default Profile