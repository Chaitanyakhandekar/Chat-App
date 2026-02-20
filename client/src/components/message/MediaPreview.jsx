import {
     Send,
     Plus ,
     X

} from 'lucide-react'
import React from 'react'
import { useChatStore } from '../../store/useChatStore'

function MediaPreview({
    isMedia,
    handleSend=()=>{}
}) {

    const {resetMediaFiles,currentChatId} = useChatStore()

  return (
    <div className="w-full h-full bg-gray-700">
        <div className="top w-full h-[85%] flex justify-center items-center relative">

            <div
             className="absolute top-20 left-8 cursor-pointer"
             onClick={()=>{
                resetMediaFiles(currentChatId)
             }}
             >
                <X size={24} className='text-gray-200' />
            </div>

            <div className="w-[80%] md:w-[30%] h-[60%]">
                <img 
                src="https://media.istockphoto.com/id/1550071750/photo/green-tea-tree-leaves-camellia-sinensis-in-organic-farm-sunlight-fresh-young-tender-bud.jpg?s=612x612&w=0&k=20&c=RC_xD5DY5qPH_hpqeOY1g1pM6bJgGJSssWYjVIvvoLw="
                 alt=""
                 className='w-full h-full object-fit'
                  />
            </div>

        </div>


        <div className="bottom w-full h-[15%] border-t border-gray-300 flex justify-center items-center gap-2">
            
            <div className="flex gap-2 items-center justify-  w-[50%] md:w-[60%] border-1 ">
               
               <div className="inner-scrollable flex gap-2 w-full justify-center  overflow-x-auto">
                 <PreviewBox url="https://media.istockphoto.com/id/1550071750/photo/green-tea-tree-leaves-camellia-sinensis-in-organic-farm-sunlight-fresh-young-tender-bud.jpg?s=612x612&w=0&k=20&c=RC_xD5DY5qPH_hpqeOY1g1pM6bJgGJSssWYjVIvvoLw="/>
                 <PreviewBox url="https://media.istockphoto.com/id/1550071750/photo/green-tea-tree-leaves-camellia-sinensis-in-organic-farm-sunlight-fresh-young-tender-bud.jpg?s=612x612&w=0&k=20&c=RC_xD5DY5qPH_hpqeOY1g1pM6bJgGJSssWYjVIvvoLw="/>
                 <PreviewBox url="https://media.istockphoto.com/id/1550071750/photo/green-tea-tree-leaves-camellia-sinensis-in-organic-farm-sunlight-fresh-young-tender-bud.jpg?s=612x612&w=0&k=20&c=RC_xD5DY5qPH_hpqeOY1g1pM6bJgGJSssWYjVIvvoLw="/>
                 <PreviewBox url="https://media.istockphoto.com/id/1550071750/photo/green-tea-tree-leaves-camellia-sinensis-in-organic-farm-sunlight-fresh-young-tender-bud.jpg?s=612x612&w=0&k=20&c=RC_xD5DY5qPH_hpqeOY1g1pM6bJgGJSssWYjVIvvoLw="/>
                 <PreviewBox url="https://media.istockphoto.com/id/1550071750/photo/green-tea-tree-leaves-camellia-sinensis-in-organic-farm-sunlight-fresh-young-tender-bud.jpg?s=612x612&w=0&k=20&c=RC_xD5DY5qPH_hpqeOY1g1pM6bJgGJSssWYjVIvvoLw="/>
                 <PreviewBox url="https://media.istockphoto.com/id/1550071750/photo/green-tea-tree-leaves-camellia-sinensis-in-organic-farm-sunlight-fresh-young-tender-bud.jpg?s=612x612&w=0&k=20&c=RC_xD5DY5qPH_hpqeOY1g1pM6bJgGJSssWYjVIvvoLw="/>
                 <PreviewBox url="https://media.istockphoto.com/id/1550071750/photo/green-tea-tree-leaves-camellia-sinensis-in-organic-farm-sunlight-fresh-young-tender-bud.jpg?s=612x612&w=0&k=20&c=RC_xD5DY5qPH_hpqeOY1g1pM6bJgGJSssWYjVIvvoLw="/>
               
                 
               </div>

            </div>
                <PreviewBox/>

            <button
            onClick={handleSend}
            className='w-10 h-10 md:w-10 md:h-10 border-1 rounded-md flex justify-center items-center bg-green-400'>
                <Send size={20} className='text-white h-[50%] w-[50%]'/>
            </button>

        </div>
    </div>
  )
  
}


const PreviewBox = function({
    url=null,
  }){
    return(
  <div className={`w-10 h-10 border-2 ${url ? "border-green-400" : ""} flex-shrink-0 flex justify-center items-center rounded-md `}>

        {
            url && 
            <img
                src={url} 
                alt=""
                className='object-fit w-full h-full'
                />
        }

        {
            !url &&
            <Plus size={21} className='text-white'/>
        }

        </div>
    )
  }

export default MediaPreview