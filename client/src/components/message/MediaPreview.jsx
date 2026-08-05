import {
    Send,
    X
} from 'lucide-react'
import React, { useEffect } from 'react'
import { useChatStore } from '../../store/useChatStore'
import FileUpload from './FileUpload'
import { Button, Input } from '../ui/index.js'

function MediaPreview({
    handleSend = () => { },
    message = "",
    setMessage
}) {

    const { resetMediaFiles, currentChatId, mediaFiles, setCurrentFile, currentFile } = useChatStore()

    return (
        <div className="relative flex flex-col w-full h-full bg-surface-900 overflow-hidden">
            {/* Main preview */}
            <div className="relative flex flex-1 items-center justify-center p-4">

                {/* Close btn */}
                <button
                    type="button"
                    className="btn-icon absolute top-4 left-4 z-10 w-9 h-9"
                    onClick={() => {
                        resetMediaFiles(currentChatId)
                        setCurrentFile(null)
                    }}
                    aria-label="Cancel media"
                >
                    <X size={18} />
                </button>

                {/* Image frame */}
                <div className="flex items-center justify-center max-h-[60vh] rounded-md overflow-hidden bg-surface-800 border border-border shadow-panel max-w-lg w-full">
                    <img src={currentFile?.preview} alt="" className="w-full h-full object-contain block" />
                </div>
            </div>

            {/* Bottom strip */}
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-4 border-t border-border bg-surface-800">
                {/* message input + send row */}
                <div className="flex items-center gap-3 w-full max-w-lg">
                    <div className="flex-1">
                        <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend(e, message)}
                            placeholder="Add a message…"
                        />
                    </div>

                    {/* Send */}
                    <Button
                        variant="primary"
                        size="icon"
                        className="flex-shrink-0"
                        onClick={(e) => handleSend(e, message)}
                        aria-label="Send"
                    >
                        <Send size={17} />
                    </Button>
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 items-center overflow-x-auto max-w-md py-1 custom-scroll">
                    {mediaFiles[currentChatId] && mediaFiles[currentChatId].map((file, index) => (
                        <PreviewBox file={file} key={file.preview} autoSelect={index} />
                    ))}
                    <PreviewBox key="add-more-media" />
                </div>
            </div>
        </div>
    )
}

const PreviewBox = function ({
    file = null,
    autoSelect = ""
}) {

    const { currentChatId, setCurrentFile, currentFile, removeMediaFile } = useChatStore()
    const [visible, setVisible] = React.useState(false)

    const handlePreviewChange = (file) => {
        setCurrentFile(file)
    }

    const handleRemoveMedia = () => {
        removeMediaFile(currentChatId, file)
    }

    useEffect(() => {
        if (autoSelect === 0) {
            setCurrentFile(file)
        }
    }, [])

    if (!file) {
        return (
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-sm border border-dashed border-border bg-surface-700 hover:border-accent hover:bg-accent-subtle transition-colors duration-150">
                <FileUpload UploadIcon="plus" />
            </div>
        )
    }

    return (
        <div
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            className={`relative flex-shrink-0 w-12 h-12 rounded-sm cursor-pointer transition-colors duration-150 border-2 ${
                currentFile?.preview === file?.preview
                    ? 'border-accent'
                    : 'border-transparent'
            }`}
        >
            {visible && (
                <button
                    type="button"
                    className="absolute -top-1.5 -right-1.5 z-20 flex items-center justify-center w-4 h-4 rounded-full bg-danger text-white border border-surface-900"
                    onClick={handleRemoveMedia}
                    aria-label="Remove media"
                >
                    <X size={10} strokeWidth={3} />
                </button>
            )}

            <img
                onClick={() => handlePreviewChange(file)}
                src={file?.preview}
                alt=""
                className="w-full h-full object-cover rounded-sm block"
            />
        </div>
    )
}

export default MediaPreview
