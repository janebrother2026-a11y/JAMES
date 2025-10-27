import React, { useState } from 'react';
import { StoredFile, Folder, Comment, FileProperty } from '../types';
import { CloseIcon, FileIcon, FolderIcon, ImageIcon, PdfFileIcon, TextFileIcon, VideoFileIcon, AudioFileIcon, PencilIcon } from './icons';

interface DetailsPanelProps {
  item: StoredFile | Folder | null;
  itemCount: number; // For folders
  onClose: () => void;
  onOpenFilePreview: (file: StoredFile) => void;
  onOpenFolder?: (folderId: string) => void;
  onRequestRename?: (item: StoredFile | Folder) => void;
  isFileOpened?: (fileId: string) => boolean;
  comments?: Comment[];
  onAddComment?: (fileId: string, text: string) => void;
  properties?: FileProperty[];
  onAddProperty?: (fileId: string, text: string) => void;
}

const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const formatTimeAgo = (timestamp: number): string => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - timestamp) / 1000);
  
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "just now";
};

const renderIcon = (item: StoredFile | Folder) => {
    const iconClassName = "w-16 h-16 text-gray-400";
    
    if ('size' in item) { // It's a file
        const { type } = item;
        if (type.startsWith('image/')) return <ImageIcon className={iconClassName} />;
        if (type === 'application/pdf') return <PdfFileIcon className={iconClassName} />;
        if (type.startsWith('video/')) return <VideoFileIcon className={iconClassName} />;
        if (type.startsWith('audio/')) return <AudioFileIcon className={iconClassName} />;
        if (type.startsWith('text/')) return <TextFileIcon className={iconClassName} />;
        return <FileIcon className={iconClassName} />;
    } else { // It's a folder
        return <FolderIcon className={iconClassName} />;
    }
}

const PropertiesSection: React.FC<{
    fileId: string;
    properties: FileProperty[];
    onAddProperty: (fileId: string, text: string) => void;
}> = ({ fileId, properties, onAddProperty }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newPropertyText, setNewPropertyText] = useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (isAdding) {
            inputRef.current?.focus();
        }
    }, [isAdding]);

    const handleSave = () => {
        if (newPropertyText.trim()) {
            onAddProperty(fileId, newPropertyText.trim());
            setNewPropertyText('');
            setIsAdding(false);
        }
    };

    const handleCancel = () => {
        setNewPropertyText('');
        setIsAdding(false);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    return (
        <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-base font-semibold text-white mb-4">Properties</h3>
            <div className="space-y-2">
                {properties.map(prop => (
                    <div key={prop.id} className="bg-gray-700/50 px-3 py-1.5 rounded-md">
                        <p className="text-sm text-gray-200 whitespace-pre-wrap break-words">{prop.text}</p>
                    </div>
                ))}
            </div>

            {isAdding ? (
                <div className="mt-4">
                    <input
                        ref={inputRef}
                        type="text"
                        value={newPropertyText}
                        onChange={(e) => setNewPropertyText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g., Model: Gemini Pro"
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="mt-2 flex justify-end space-x-2">
                        <button onClick={handleCancel} className="px-3 py-1 text-sm rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSave} disabled={!newPropertyText.trim()} className="px-3 py-1 text-sm rounded-md bg-blue-600 hover:bg-blue-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mt-4">
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full text-center py-2 px-4 bg-gray-600/50 text-gray-300 rounded-lg hover:bg-gray-600 hover:text-white transition-colors text-sm"
                    >
                        Add
                    </button>
                </div>
            )}
        </div>
    );
}

const CommentSection: React.FC<{
    fileId: string;
    comments: Comment[];
    onAddComment: (fileId: string, text: string) => void;
}> = ({ fileId, comments, onAddComment }) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment(fileId, newComment.trim());
            setNewComment('');
        }
    };

    return (
        <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-base font-semibold text-white mb-4">Comments</h3>
            <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                {comments.length > 0 ? (
                    comments.slice().sort((a,b) => b.createdAt - a.createdAt).map(comment => (
                        <div key={comment.id} className="bg-gray-700/50 p-3 rounded-lg">
                            <p className="text-sm text-gray-200 whitespace-pre-wrap break-words">{comment.text}</p>
                            <p className="text-xs text-gray-400 mt-1.5 text-right">{formatTimeAgo(comment.createdAt)}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No comments yet.</p>
                )}
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full h-20 p-2 bg-gray-900 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    required
                />
                <button
                    type="submit"
                    className="mt-2 w-full py-2 px-4 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    disabled={!newComment.trim()}
                >
                    Comment
                </button>
            </form>
        </div>
    );
}

export const DetailsPanel: React.FC<DetailsPanelProps> = ({ item, itemCount, onClose, onOpenFilePreview, onOpenFolder, onRequestRename, isFileOpened, comments, onAddComment, properties, onAddProperty }) => {
  const isOpen = !!item;
  const isPreviewable = item && 'url' in item && (item.type?.startsWith('image/') || item.type?.startsWith('video/'));
  const isFolder = item && !('size' in item);
  const isFile = item && 'size' in item;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/30 z-20 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-gray-800 border-l border-gray-700 shadow-2xl z-30 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {item && (
          <div className="flex flex-col h-full text-gray-300">
            <header className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Details</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700" aria-label="Close details panel">
                <CloseIcon className="w-5 h-5" />
              </button>
            </header>
            
            <div className="flex-grow p-6 overflow-y-auto">
                <div className="flex flex-col items-center text-center">
                    {renderIcon(item)}
                    <div className="flex items-center justify-center mt-4 w-full">
                        <p className="text-lg font-medium text-white break-all max-w-[calc(100%-2rem)]" title={item.name}>{item.name}</p>
                        {onRequestRename && (
                            <button 
                                onClick={() => onRequestRename(item)}
                                className="ml-2 p-1.5 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white flex-shrink-0" 
                                aria-label={`Rename ${item.name}`}
                            >
                                <PencilIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {isPreviewable && (
                    <div className="mt-6">
                        <button 
                            onClick={() => onOpenFilePreview(item as StoredFile)}
                            className="w-full text-center py-2 px-4 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
                        >
                            Preview
                        </button>
                    </div>
                )}

                {isFolder && onOpenFolder && (
                    <div className="mt-6">
                        <button 
                            onClick={() => onOpenFolder(item.id)}
                            className="w-full text-center py-2 px-4 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
                        >
                            Open Folder
                        </button>
                    </div>
                )}
                
                <div className="mt-8 space-y-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Type</span>
                        <span className="font-medium text-white">{ 'size' in item ? item.type : 'Folder'}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-400">{ 'size' in item ? 'Size' : 'Contains'}</span>
                        <span className="font-medium text-white">
                            {'size' in item ? formatBytes(item.size) : `${itemCount} items`}
                        </span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-400">Created</span>
                        <span className="font-medium text-white">{formatDate(item.createdAt)}</span>
                    </div>
                    { 'size' in item && isFileOpened && (
                        <div className="flex justify-between">
                            <span className="text-gray-400">Status</span>
                            <span className={`font-medium ${isFileOpened(item.id) ? 'text-blue-400' : 'text-white'}`}>
                                {isFileOpened(item.id) ? 'Viewed' : 'Not Viewed'}
                            </span>
                        </div>
                    )}
                </div>
                {isFile && properties && onAddProperty && (
                    <PropertiesSection 
                        fileId={item.id}
                        properties={properties}
                        onAddProperty={onAddProperty}
                    />
                )}
                {isFile && comments && onAddComment && (
                    <CommentSection 
                        fileId={item.id}
                        comments={comments}
                        onAddComment={onAddComment}
                    />
                )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
