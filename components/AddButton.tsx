
import React, { useState } from 'react';
import { PlusIcon, FolderIcon, FileIcon, FolderUploadIcon } from './icons';

interface AddButtonProps {
    onAddFolder: () => void;
    onAddFile: () => void;
    onAddFolderUpload: () => void;
}

export const AddButton: React.FC<AddButtonProps> = ({ onAddFolder, onAddFile, onAddFolderUpload }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOptionClick = (action: () => void) => {
        action();
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-20">
            {isOpen && (
                <div className="flex flex-col items-center mb-4 space-y-3">
                    <button
                        onClick={() => handleOptionClick(onAddFolder)}
                        className="flex items-center justify-center w-48 py-2 px-4 bg-gray-700 text-white rounded-lg shadow-lg hover:bg-gray-600 transition-all transform hover:scale-105"
                        aria-label="Create new folder"
                    >
                        <FolderIcon className="w-5 h-5 mr-3" />
                        <span>New Folder</span>
                    </button>
                    <button
                        onClick={() => handleOptionClick(onAddFile)}
                        className="flex items-center justify-center w-48 py-2 px-4 bg-gray-700 text-white rounded-lg shadow-lg hover:bg-gray-600 transition-all transform hover:scale-105"
                        aria-label="Upload file"
                    >
                       <FileIcon className="w-5 h-5 mr-3" />
                        <span>Upload File</span>
                    </button>
                     <button
                        onClick={() => handleOptionClick(onAddFolderUpload)}
                        className="flex items-center justify-center w-48 py-2 px-4 bg-gray-700 text-white rounded-lg shadow-lg hover:bg-gray-600 transition-all transform hover:scale-105"
                        aria-label="Upload folder"
                    >
                       <FolderUploadIcon className="w-5 h-5 mr-3" />
                        <span>Upload Folder</span>
                    </button>
                </div>
            )}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 transition-all transform hover:scale-110"
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-label="Add new item"
            >
                <PlusIcon className={`w-8 h-8 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
            </button>
        </div>
    );
};