import { X } from 'lucide-react'
import React from 'react'
import { useChatStore } from '../../store/useChatStore'

function SingleFilePreview() {

    const { currentPreviewFile, setCurrentPreviewFile } = useChatStore()

    return (
        <div className="relative flex flex-col w-full h-full bg-surface-900 overflow-hidden">
            {/* Close btn */}
            <button
                type="button"
                className="btn-icon absolute top-4 left-4 z-10 w-9 h-9"
                onClick={() => setCurrentPreviewFile(null)}
                aria-label="Close preview"
            >
                <X size={18} />
            </button>

            {/* Image frame */}
            <div className="flex flex-1 items-center justify-center p-4">
                <div className="flex items-center justify-center max-h-[60vh] max-w-lg w-full rounded-md overflow-hidden bg-surface-800 border border-border shadow-panel">
                    <img src={currentPreviewFile} alt="" className="w-full h-full object-contain block" />
                </div>
            </div>
        </div>
    )
}

export default SingleFilePreview
