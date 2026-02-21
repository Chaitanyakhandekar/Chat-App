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

    const {resetMediaFiles,currentChatId,mediaFiles,setCurrentFile,currentFile} = useChatStore()

  return (
    <div className="w-full h-full bg-gray-700">
        <div className="top w-full h-[85%] flex justify-center items-center relative">

            <div
             className="absolute top-20 left-8 cursor-pointer"
             onClick={()=>{
                resetMediaFiles(currentChatId)
                setCurrentFile(null)
             }}
             >
                <X size={24} className='text-gray-200' />
            </div>

            <div className="w-[80%] md:w-[30%] h-[60%]">
                <img 
                src={currentFile?.preview}
                 alt=""
                 className='w-full h-full object-fit'
                  />
            </div>

        </div>


        <div className="bottom w-full h-[15%] border-t border-gray-300 flex justify-center items-center gap-2">
            
            <div className="flex gap-2 items-center justify-  w-[50%] md:w-[60%] border-1 ">
               
               <div className="inner-scrollable flex gap-2 w-full justify-center  overflow-x-auto">

                {
                    mediaFiles[currentChatId] && mediaFiles[currentChatId].map((file,index)=>(
                          <PreviewBox file={file} key={file.preview} autoSelect={index===1}/>
                    ))
                }            
               
                 
               </div>

            </div>
                <PreviewBox key={"xhdsdskffdfdofdo"} classname={"border-2 "}/>

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
    file=null,
    key=null,
    classname,
    autoSelect=true
  }){

      const {resetMediaFiles,currentChatId,mediaFiles,setCurrentFile,currentFile} = useChatStore()

    const handlePreviewChange = (file)=>{
        setCurrentFile(file)
    }

    return(
  <div
  key={key}
  className={`w-10 h-10 border-1 ${currentFile?.preview === file?.preview || autoSelect ? "border-2 border-green-400" : "border-1"  , classname} flex-shrink-0 flex justify-center items-center rounded-md `}>

        {
            file && 
            <img
                onClick={()=>{handlePreviewChange(file)}}
                src={file?.preview} 
                alt=""
                className='object-cover w-full h-full rounded-md'
                />
        }

        {
            !file &&
            <Plus size={21} className='text-white'/>
        }

        </div>
    )
  }

export default MediaPreview