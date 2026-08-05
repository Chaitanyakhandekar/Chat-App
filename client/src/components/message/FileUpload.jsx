import { Paperclip, Plus } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../../store/useChatStore'
import { useAssetsStore } from '../../store/useAssetsStore'

function FileUpload({
    UploadIcon = ""
}) {

    const fileInputRef = useRef(null)
    const { addMediaFile, currentChatId } = useChatStore()
    const { selectFile, toggleSlectFile } = useAssetsStore()

    const handleClick = () => {
        fileInputRef.current.click()
    }

    const handleChange = (e) => {
        const files = e.target.files

        Array.from(files).forEach((file) => {
            addMediaFile(currentChatId, {
                file,
                preview: URL.createObjectURL(file),
                progress: 0,
                uploading: true
            })
        })

        e.target.value = null
    }

    useEffect(() => {
        if (selectFile) {
            handleClick()
            toggleSlectFile(false)
        }
    }, [selectFile])

    return (
        <>
            {UploadIcon === "plus" ? (
                <button
                    type="button"
                    className="btn-icon w-8 h-8 rounded-md"
                    onClick={handleClick}
                >
                    <Plus size={18} />
                </button>
            ) : (
                <button
                    type="button"
                    className="btn-icon w-8 h-8 rounded-md"
                    onClick={handleClick}
                >
                    <Paperclip size={18} />
                </button>
            )}

            <input
                type="file"
                multiple
                className="hidden"
                onChange={handleChange}
                ref={fileInputRef}
            />
        </>
    )
}

export default FileUpload