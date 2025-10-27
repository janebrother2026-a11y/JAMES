import React, { useEffect } from 'react';
import { CloseIcon, DownloadIcon } from './icons';

interface VideoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string | null;
  videoName: string | null;
}

export const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({ isOpen, onClose, videoUrl, videoName }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
    
  if (!isOpen || !videoUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
      <div
        className="relative p-4 w-full max-w-4xl"
        onClick={e => e.stopPropagation()}
      >
        <video
          src={videoUrl}
          controls
          autoPlay
          className="w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        >
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="absolute top-4 right-4 flex items-center space-x-3">
        <a
          href={videoUrl}
          download={videoName || 'video'}
          className="p-2 rounded-full text-white bg-black/50 hover:bg-black/75 transition-colors"
          aria-label="Download video"
          onClick={(e) => e.stopPropagation()}
        >
          <DownloadIcon className="w-8 h-8" />
        </a>
        <button
            onClick={onClose}
            className="p-2 rounded-full text-white bg-black/50 hover:bg-black/75 transition-colors"
            aria-label="Close video preview"
          >
            <CloseIcon className="w-8 h-8" />
          </button>
      </div>
    </div>
  );
};