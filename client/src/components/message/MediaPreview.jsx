import {
     Send,
     Plus 

} from 'lucide-react'
import React from 'react'

function MediaPreview() {

  return (
    <div className="w-full h-full bg-gray-700">
        <div className="top w-full h-[85%]"></div>
        <div className="bottom w-full h-[15%] border-2 border-gray-300 flex justify-center items-center gap-2">
            
            <div className="flex gap-2 items-center  w-[50%] md:w-[60%] border-1 ">
               
               <div className="inner-scrollable flex gap-2 w-full  overflow-x-scroll">
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

            <button className='w-10 h-10 border-1 rounded-md flex justify-center items-center bg-green-400'>
                <Send size={20} className='text-white'/>
            </button>

        </div>
    </div>
  )
  
}


const PreviewBox = function({
    url=null,
  }){
    return(
  <div className={`w-10 h-10 md:w-20 md:h-20 border-2 ${url ? "border-green-400" : ""} flex-shrink-0 flex justify-center items-center rounded-md `}>

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