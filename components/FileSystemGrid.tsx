import React from 'react';
import { StoredFile, Folder } from '../types';
import { FolderItem } from './FolderItem';
import { FileItem } from './FileItem';

interface FileSystemGridProps {
  items: (Folder | StoredFile)[];
  onNavigate: (folderId: string) => void;
  onRequestDelete: (item: StoredFile | Folder) => void;
  onRequestRename: (item: StoredFile | Folder) => void;
  onSelectItem: (item: StoredFile | Folder) => void;
  selectedItemId: string | null;
  openedFileIds: Set<string>;
}

const isFolder = (item: Folder | StoredFile): item is Folder => {
  return 'parentId' in item && (item as any).size === undefined;
};


export const FileSystemGrid: React.FC<FileSystemGridProps> = ({ items, onNavigate, onRequestDelete, onRequestRename, onSelectItem, selectedItemId, openedFileIds }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {items.map(item =>
        isFolder(item) ? (
          <FolderItem 
            key={item.id} 
            folder={item} 
            onNavigate={onNavigate} 
            onRequestDelete={onRequestDelete} 
            onRequestRename={onRequestRename}
            onSelect={onSelectItem}
            isSelected={item.id === selectedItemId}
          />
        ) : (
          <FileItem 
            key={item.id} 
            file={item} 
            onRequestDelete={onRequestDelete}
            onRequestRename={onRequestRename}
            onSelect={onSelectItem}
            isSelected={item.id === selectedItemId}
            isOpened={openedFileIds.has(item.id)}
          />
        )
      )}
    </div>
  );
};