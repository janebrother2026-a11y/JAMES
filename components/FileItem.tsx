import React from 'react';
import { StoredFile } from '../types';
import { FileIcon, ImageIcon, TrashIcon, PdfFileIcon, VideoFileIcon, AudioFileIcon, TextFileIcon, PencilIcon } from './icons';

interface FileItemProps {
  file: StoredFile;
  onRequestDelete: (file: StoredFile) => void;
  onRequestRename: (file: StoredFile) => void;
  onSelect: (file: StoredFile) => void;
  isSelected: boolean;
  isOpened: boolean;
}

const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const FileItem: React.FC<FileItemProps> = ({ file, onRequestDelete, onRequestRename, onSelect, isSelected, isOpened }) => {

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRequestDelete(file);
  };
  
  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRequestRename(file);
  };

  const renderPreview = () => {
    const { type, url, name } = file;
    const iconClassName = "w-12 h-12 text-gray-500";

    if (type.startsWith('image/')) {
        if (url) {
            return <img src={url} alt={name} className="w-full h-full object-cover" />;
        }
        return <ImageIcon className={iconClassName} />;
    }
    if (type === 'application/pdf') {
        return <PdfFileIcon className={iconClassName} />;
    }
    if (type.startsWith('video/')) {
        const icon = <VideoFileIcon className={iconClassName} />;
        if (type === 'video/mp4' && isOpened) {
            return (
                <div className="relative w-full h-full flex items-center justify-center">
                    {icon}
                    <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-gray-700" title="Viewed"></div>
                </div>
            );
        }
        return icon;
    }
    if (type.startsWith('audio/')) {
        return <AudioFileIcon className={iconClassName} />;
    }
    if (type.startsWith('text/')) {
        return <TextFileIcon className={iconClassName} />;
    }

    return <FileIcon className={iconClassName} />;
  };

  const commonClasses = "flex flex-col rounded-lg bg-gray-800 overflow-hidden transition-all duration-200 cursor-pointer";

  return (
    <div 
      className={`relative group transition-all duration-200 rounded-lg ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => onSelect(file)}
    >
        <div className={`${commonClasses} hover:shadow-lg hover:shadow-blue-500/10`}>
            <div className="relative w-full aspect-square bg-gray-700 flex items-center justify-center">
                {renderPreview()}
            </div>
            <div className="p-3 text-left">
                <p className="text-sm text-gray-200 font-medium break-all w-full truncate" title={file.name}>
                {file.name}
                </p>
                <p className="text-xs text-gray-400">{formatBytes(file.size)}</p>
            </div>
        </div>
      <button
        onClick={handleRename}
        className="absolute top-2 right-10 p-1.5 rounded-full bg-gray-700/50 text-gray-400 hover:bg-blue-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
        aria-label={`Rename ${file.name}`}
      >
        <PencilIcon className="w-4 h-4" />
      </button>
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-700/50 text-gray-400 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
        aria-label={`Delete ${file.name}`}
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
};