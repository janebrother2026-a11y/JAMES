import React from 'react';
import { StoredFile, Folder } from '../types';
import { CloseIcon, TrashIcon } from './icons';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: StoredFile | Folder | null;
}

const isFolder = (item: Folder | StoredFile): item is Folder => {
    return 'parentId' in item && (item as any).size === undefined;
};

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, item }) => {
  if (!isOpen || !item) return null;

  const isItemFolder = isFolder(item);

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm m-4 transform transition-all duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Confirm Deletion</h2>
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white" aria-label="Close modal">
                <CloseIcon />
            </button>
        </div>
        <div>
            <p className="text-gray-300">
                Are you sure you want to delete <span className="font-semibold text-white break-all">"{item.name}"</span>?
            </p>
            {isItemFolder && (
                <p className="mt-2 text-sm text-yellow-400 bg-yellow-900/50 p-3 rounded-md">
                    Warning: Deleting a folder will permanently delete all of its contents.
                </p>
            )}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
            <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button 
                type="button"
                onClick={onConfirm}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <TrashIcon className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
      </div>
    </div>
  );
};