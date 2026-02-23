import {
    Send,
    Plus,
    X
} from 'lucide-react'
import React, { useEffect } from 'react'
import { useChatStore } from '../../store/useChatStore'
import { useAssetsStore } from '../../store/useAssetsStore'
import FileUpload from './FileUpload'

function MediaPreview({
    isMedia,
    handleSend = () => { }
}) {

    const { resetMediaFiles, currentChatId, mediaFiles, setCurrentFile, currentFile } = useChatStore()
    const { selectFile, toggleSelectFile } = useAssetsStore()

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&display=swap');

                .mp-root {
                    width: 100%;
                    height: 100%;
                    background: #0a0b0f;
                    display: flex;
                    flex-direction: column;
                    font-family: 'Sora', sans-serif;
                    position: relative;
                    overflow: hidden;
                }

                /* subtle ambient glow behind image */
                .mp-root::before {
                    content: '';
                    position: absolute;
                    top: 20%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%);
                    pointer-events: none;
                    z-index: 0;
                }

                .mp-main {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    z-index: 1;
                }

                .mp-close-btn {
                    position: absolute;
                    top: 24px;
                    left: 24px;
                    width: 36px;
                    height: 36px;
                    background: rgba(255,255,255,0.07);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.18s, transform 0.15s;
                    z-index: 10;
                }

                .mp-close-btn:hover {
                    background: rgba(239,68,68,0.15);
                    border-color: rgba(239,68,68,0.3);
                    transform: scale(1.05);
                }

                .mp-img-frame {
                    width: min(480px, 80%);
                    max-height: 65vh;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.08);
                    box-shadow: 0 8px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.12);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #13151d;
                }

                .mp-img-frame img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    display: block;
                }

                /* ── BOTTOM STRIP ── */
                .mp-bottom {
                    height: 88px;
                    border-top: 1px solid rgba(255,255,255,0.06);
                    background: rgba(14,16,24,0.9);
                    backdrop-filter: blur(16px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    padding: 0 24px;
                    z-index: 1;
                }

                .mp-thumbs-scroll {
                    display: flex;
                    gap: 8px;
                    overflow-x: auto;
                    align-items: center;
                    max-width: 400px;
                    padding: 4px 2px;
                    scrollbar-width: none;
                }

                .mp-thumbs-scroll::-webkit-scrollbar { display: none; }

                /* ── SEND BTN ── */
                .mp-send-btn {
                    width: 44px;
                    height: 44px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border: none;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    flex-shrink: 0;
                    box-shadow: 0 4px 14px rgba(99,102,241,0.4);
                    transition: transform 0.15s, box-shadow 0.15s;
                }

                .mp-send-btn:hover {
                    transform: translateY(-2px) scale(1.04);
                    box-shadow: 0 6px 20px rgba(99,102,241,0.5);
                }

                .mp-send-btn:active { transform: scale(0.96); }

                /* ── PREVIEW BOX ── */
                .pb-wrap {
                    width: 52px;
                    height: 52px;
                    border-radius: 10px;
                    flex-shrink: 0;
                    position: relative;
                    cursor: pointer;
                    transition: transform 0.15s;
                    border: 2px solid transparent;
                    overflow: visible;
                }

                .pb-wrap:hover { transform: scale(1.06); }

                .pb-wrap.active {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 2px rgba(99,102,241,0.3);
                    border-radius: 10px;
                }

                .pb-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 8px;
                    display: block;
                }

                .pb-remove {
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    width: 18px;
                    height: 18px;
                    background: #ef4444;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 20;
                    border: 2px solid #0a0b0f;
                    opacity: 0;
                    transform: scale(0.7);
                    transition: opacity 0.15s, transform 0.15s;
                    pointer-events: none;
                }

                .pb-wrap:hover .pb-remove {
                    opacity: 1;
                    transform: scale(1);
                    pointer-events: all;
                }

                /* ── ADD MORE BOX ── */
                .pb-add {
                    width: 52px;
                    height: 52px;
                    border-radius: 10px;
                    flex-shrink: 0;
                    border: 1.5px dashed rgba(255,255,255,0.15);
                    background: rgba(255,255,255,0.04);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: border-color 0.18s, background 0.18s;
                }

                .pb-add:hover {
                    border-color: rgba(99,102,241,0.5);
                    background: rgba(99,102,241,0.08);
                }
            `}</style>

            <div className="mp-root">

                {/* Main preview area */}
                <div className="mp-main">

                    <div
                        className="mp-close-btn"
                        onClick={() => {
                            resetMediaFiles(currentChatId)
                            setCurrentFile(null)
                        }}
                    >
                        <X size={16} color="#e2e4f0" />
                    </div>

                    <div className="mp-img-frame">
                        <img src={currentFile?.preview} alt="" />
                    </div>
                </div>

                {/* Bottom strip */}
                <div className="mp-bottom">
                    <div className="mp-thumbs-scroll">
                        {mediaFiles[currentChatId] && mediaFiles[currentChatId].map((file, index) => (
                            <PreviewBox file={file} key={file.preview} autoSelect={index} />
                        ))}
                        <PreviewBox key={"xhdsdskffdfdofdo"} />
                    </div>

                    <button className="mp-send-btn" onClick={handleSend}>
                        <Send size={18} color="#fff" />
                    </button>
                </div>
            </div>
        </>
    )
}


const PreviewBox = function ({
    file = null,
    key = null,
    classname,
    autoSelect = ""
}) {

    const { resetMediaFiles, currentChatId, mediaFiles, setCurrentFile, currentFile, removeMediaFile } = useChatStore()
    const { selectFile, toggleSlectFile } = useAssetsStore()
    const [visible, setVisible] = React.useState(false)

    const handlePreviewChange = (file) => {
        setCurrentFile(file)
    }

    const handleRemoveMedia = () => {
        removeMediaFile(currentChatId, file)
    }

    useEffect(() => {
        console.log("INDEX :: ", autoSelect)
        if (autoSelect === 0) {
            setCurrentFile(file)
        }
    }, [])

    if (!file) {
        return (
            <div className="pb-add">
                <FileUpload UploadIcon={"plus"} />
            </div>
        )
    }

    return (
        <div
            key={key}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            className={`pb-wrap ${currentFile?.preview === file?.preview ? 'active' : ''}`}
        >
            {visible && (
                <div className="pb-remove" onClick={handleRemoveMedia}>
                    <X size={9} color="#fff" strokeWidth={3} />
                </div>
            )}

            <img
                onClick={() => handlePreviewChange(file)}
                src={file?.preview}
                alt=""
                className="pb-img"
            />
        </div>
    )
}

export default MediaPreview