import { Paperclip } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../../store/useChatStore'

function FileUpload() {

    const fileInputRef = useRef(null)
    const {addMediaFile, mediaFiles , currentChatId} = useChatStore()

    const handleClick = () =>{
        fileInputRef.current.click()
    }

    const handleChange = (e) =>{

        const file = e.target.files[0]

        addMediaFile(currentChatId,{
            file,
            preview:URL.createObjectURL(file),
            progress:0,
            uploading: true
        })
        console.log('File Selected :: ',e.target.files[0])
    }

    useEffect(()=>{
        console.log("Media Files :: ",mediaFiles)
    },[mediaFiles])

  return (
   <>

        <Paperclip
            className='absolute right-10 z-20 cursor-pointer'
            size={20}
            onClick={handleClick}
           />

        <input
            type="file"
            className='hidden'
            onChange={handleChange}
            ref={fileInputRef}
         />

   </>
  )
}

export default FileUpload