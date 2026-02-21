import { Paperclip,Plus } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../../store/useChatStore'
import { useAssetsStore } from '../../store/useAssetsStore'

function FileUpload({
    UploadIcon=""

}) {

    const fileInputRef = useRef(null)
    const {addMediaFile, mediaFiles , currentChatId} = useChatStore()
    const {selectFile, toggleSlectFile} = useAssetsStore()

    const handleClick = () =>{
        fileInputRef.current.click()
    }

    const handleChange = (e) =>{

        const files = e.target.files

      Array.from(files).forEach((file)=>{

            console.log("FILE FOR URL :: ",file)

            addMediaFile(currentChatId,{
            file,
            preview:URL.createObjectURL(file),
            progress:0,
            uploading: true
        })

        })
        console.log('File Selected :: ',e.target.files)
        e.target.value = null
    }

    useEffect(()=>{
        console.log("Media Files :: ",mediaFiles)
    },[mediaFiles])

    useEffect(()=>{
        
        if(selectFile){
            handleClick()
            toggleSlectFile(false)
        }

    },[selectFile])

  return (
   <>

         {
            UploadIcon==="plus" ?
             (<Plus
                    size={21}
                    className='text-white cursor-pointer'
                    onClick={handleClick}
                        /> ) :

            <Paperclip
            className={`absolute right-10 z-20 cursor-pointer `}
            size={20}
            onClick={handleClick}
           />
         }

         
         

        <input
            type="file"
            multiple
            className='hidden'
            onChange={handleChange}
            ref={fileInputRef}
         />

   </>
  )
}

export default FileUpload