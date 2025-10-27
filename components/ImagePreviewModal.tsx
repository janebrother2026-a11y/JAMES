import React, { useEffect } from 'react';
import { CloseIcon, DownloadIcon } from './icons';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  imageName: string | null;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ isOpen, onClose, imageUrl, imageName }) => {
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
    
  if (!isOpen || !imageUrl) return null;

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
        className="relative p-4"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Image preview"
          className="max-w-screen-lg max-h-[90vh] object-contain rounded-lg shadow-2xl"
        />
      </div>
      <div className="absolute top-4 right-4 flex items-center space-x-3">
        <a
          href={imageUrl}
          download={imageName || 'image'}
          className="p-2 rounded-full text-white bg-black/50 hover:bg-black/75 transition-colors"
          aria-label="Download image"
          onClick={(e) => e.stopPropagation()}
        >
          <DownloadIcon className="w-8 h-8" />
        </a>
        <button
            onClick={onClose}
            className="p-2 rounded-full text-white bg-black/50 hover:bg-black/75 transition-colors"
            aria-label="Close image preview"
          >
            <CloseIcon className="w-8 h-8" />
          </button>
      </div>
    </div>
  );
};