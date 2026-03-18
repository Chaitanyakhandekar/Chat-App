import { X } from 'lucide-react'
import React from 'react'

function Notification({activePanel,setActivePanel,chatUsersInfo,newGroupNotication}) {

             return <div className="slide-in-panel flex flex-col h-full">
    
                <div className="flex items-center justify-between px-5 pt-6 pb-4">
                  <span className="text-[15px] font-bold">
                    Notifications
                  </span>
    
                  <button
                    onClick={() => setActivePanel(null)}
                  >
                    <X size={16}/>
                  </button>
                </div>
    
                <div className="panel-divider"/>
    
                <div className="flex-1 overflow-y-auto px-3 custom-scroll">
    
                  {Object.entries(chatUsersInfo)
                    .filter(([,c]) => c?.newMessages > 0)
                    .map(([chatId, info]) => {
    
                      const chat =
                        users?.find(
                          c => c._id === chatId
                        )
    
                      if(!chat) return null
    
                      const otherUser =
                        chat.participants[0]._id === user._id
                          ? chat.participants[1]
                          : chat.participants[0]
    
                      return (
                        <div
                          key={chatId}
                          className="notif-item unread"
                          onClick={() =>
                            setActivePanel(null)
                          }
                        >
    
                          <img
                            src={otherUser.avtar}
                            className="w-9 h-9 rounded-full"
                          />
    
                          <div>
                            {otherUser.username}
                          </div>
    
                        </div>
                      )
    
                    })}
    
                  {
                    newGroupNotication &&
                    <div className="notif-item unread">
                      <img
                        src={""}
                        className="w-9 h-9 rounded-full"
                      />
                      <div
                        className="text-sm font-medium text-[#c4c6e7]"
                      >
                        {"User1 Added you to "}
                      </div>
                    </div>
                  }
    
                </div>
    
              </div>
  
}

export default Notification