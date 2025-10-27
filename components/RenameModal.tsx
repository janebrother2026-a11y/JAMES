import React, { useState, useEffect } from 'react';
import { StoredFile, Folder } from '../types';
import { CloseIcon } from './icons';

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  item: StoredFile | Folder | null;
}

export const RenameModal: React.FC<RenameModalProps> = ({ isOpen, onClose, onConfirm, item }) => {
  const [name, setName] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && item) {
      setName(item.name);
      setTimeout(() => inputRef.current?.select(), 100);
    } else {
        setName('');
    }
  }, [isOpen, item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(name);
  };

  if (!isOpen) return null;

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
            <h2 className="text-xl font-bold text-white">Rename Item</h2>
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white" aria-label="Close modal">
                <CloseIcon />
            </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New name"
            className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="mt-6 flex justify-end space-x-3">
            <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button 
                type="submit"
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                disabled={!name.trim() || name.trim() === item?.name}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};