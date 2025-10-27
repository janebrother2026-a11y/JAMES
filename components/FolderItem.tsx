import React from 'react';
import { Folder } from '../types';
import { FolderIcon, TrashIcon, PencilIcon } from './icons';

interface FolderItemProps {
  folder: Folder;
  onNavigate: (folderId: string) => void;
  onRequestDelete: (folder: Folder) => void;
  onRequestRename: (folder: Folder) => void;
  onSelect: (folder: Folder) => void;
  isSelected: boolean;
}

export const FolderItem: React.FC<FolderItemProps> = ({ folder, onNavigate, onRequestDelete, onRequestRename, onSelect, isSelected }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRequestDelete(folder);
  };
  
  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRequestRename(folder);
  };

  return (
    <div 
      className={`relative group transition-all duration-200 rounded-lg ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => onSelect(folder)}
      onDoubleClick={() => onNavigate(folder.id)}
    >
      <div
        className="w-full h-full flex flex-col items-center justify-center p-4 text-center rounded-lg bg-gray-800 hover:bg-blue-900/50 cursor-pointer"
      >
        <FolderIcon className="w-12 h-12 text-blue-400 group-hover:text-blue-300 mb-2 transition-colors" />
        <span className="text-sm text-gray-300 group-hover:text-white break-all w-full truncate">
          {folder.name}
        </span>
      </div>
      <button
        onClick={handleRename}
        className="absolute top-2 right-10 p-1.5 rounded-full bg-gray-700/50 text-gray-400 hover:bg-blue-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
        aria-label={`Rename ${folder.name}`}
      >
        <PencilIcon className="w-4 h-4" />
      </button>
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-700/50 text-gray-400 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
        aria-label={`Delete ${folder.name}`}
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
};