import React, { useState, useMemo, useCallback } from 'react';
import { StoredFile, Folder, Comment, FileProperty } from './types';
import { Header } from './components/Header';
import { FileSystemGrid } from './components/FileSystemGrid';
import { AddButton } from './components/AddButton';
import { CreateFolderModal } from './components/CreateFolderModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { RenameModal } from './components/RenameModal';
import { ImagePreviewModal } from './components/ImagePreviewModal';
import { DetailsPanel } from './components/DetailsPanel';
import { FolderIcon } from './components/icons';
import { VideoPreviewModal } from './components/VideoPreviewModal';

type SortKey = 'name' | 'size';
type SortOrder = 'asc' | 'desc';

const App: React.FC = () => {
  const [folders, setFolders] = useState<Record<string, Folder>>({
    'root': { id: 'root', name: 'Home', parentId: null, createdAt: Date.now() - 200000 },
    'docs': { id: 'docs', name: 'Documents', parentId: 'root', createdAt: Date.now() - 100000 },
  });

  const [files, setFiles] = useState<Record<string, StoredFile>>({
    'file1': { id: 'file1', name: 'Welcome.txt', type: 'text/plain', size: 1024, parentId: 'root', createdAt: Date.now() - 50000 },
    'img1': { id: 'img1', name: 'cat-photo.jpg', type: 'image/jpeg', size: 204800, url: 'https://picsum.photos/800/600', parentId: 'root', createdAt: Date.now() },
    'vid1': { id: 'vid1', name: 'ocean-waves.mp4', type: 'video/mp4', size: 15728640, url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', parentId: 'root', createdAt: Date.now() - 25000 },
  });

  const [comments, setComments] = useState<Record<string, Comment[]>>({
    'img1': [
      { id: 'c1', fileId: 'img1', text: 'This is a great photo!', createdAt: Date.now() - 60000 },
    ]
  });

  const [properties, setProperties] = useState<Record<string, FileProperty[]>>({
    'img1': [
        { id: 'p1', fileId: 'img1', text: 'Model: Imagen 4.0' },
    ]
  });

  const [path, setPath] = useState<string[]>(['root']);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<StoredFile | Folder | null>(null);
  const [itemToRename, setItemToRename] = useState<StoredFile | Folder | null>(null);
  const [previewImage, setPreviewImage] = useState<{url: string, name: string} | null>(null);
  const [previewVideo, setPreviewVideo] = useState<{url: string, name: string} | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [openedFiles, setOpenedFiles] = useState<Set<string>>(new Set());


  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const folderInputRef = React.useRef<HTMLInputElement>(null);

  const currentFolderId = path[path.length - 1];

  const breadcrumbs = useMemo(() => {
    return path.map(folderId => folders[folderId]);
  }, [path, folders]);

  const items = useMemo(() => {
    const childFolders = Object.values(folders).filter((f: Folder) => f.parentId === currentFolderId);
    const childFiles = Object.values(files).filter((f: StoredFile) => f.parentId === currentFolderId);
    
    const combinedItems = [...childFolders, ...childFiles];

    combinedItems.sort((a: StoredFile | Folder, b: StoredFile | Folder) => {
        const aIsFolder = !('size' in a);
        const bIsFolder = !('size' in b);

        if (aIsFolder && !bIsFolder) return -1;
        if (!aIsFolder && bIsFolder) return 1;

        let comparison = 0;
        if (sortKey === 'name') {
            comparison = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        } else if (sortKey === 'size') {
            if (aIsFolder && bIsFolder) {
                comparison = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
            } 
            else if (!aIsFolder && !bIsFolder) {
                comparison = a.size - b.size;
            }
        }

        return sortOrder === 'asc' ? comparison : -comparison;
    });

    return combinedItems;
  }, [folders, files, currentFolderId, sortKey, sortOrder]);

  const handleNavigate = (folderId: string) => {
    setPath([...path, folderId]);
    setSelectedItemId(null);
  };

  const handleNavigateToCrumb = (index: number) => {
    setPath(path.slice(0, index + 1));
    setSelectedItemId(null);
  };
  
  const handleNavigateBack = () => {
    if (path.length > 1) {
      setPath(path.slice(0, -1));
      setSelectedItemId(null);
    }
  };

  const handleCreateFolder = (name: string) => {
    if (name.trim() === '') return;
    const newId = `folder-${Date.now()}`;
    const newFolder: Folder = { id: newId, name, parentId: currentFolderId, createdAt: Date.now() };
    setFolders(prev => ({ ...prev, [newId]: newFolder }));
    setIsCreateModalOpen(false);
  };

  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    const newFiles: Record<string, StoredFile> = {};
    Array.from(uploadedFiles).forEach((file: File, index) => {
      const newId = `file-${Date.now()}-${index}`;
      const newFile: StoredFile = {
        id: newId,
        name: file.name,
        type: file.type,
        size: file.size,
        parentId: currentFolderId,
        url: (file.type.startsWith('image/') || file.type.startsWith('video/')) ? URL.createObjectURL(file) : undefined,
        createdAt: Date.now(),
      };
      newFiles[newId] = newFile;
    });

    setFiles(prev => ({ ...prev, ...newFiles }));
  };
  
  const triggerFileUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleUploadFolder = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    const filesArray = Array.from(uploadedFiles);
    
    const newFoldersToAdd: Record<string, Folder> = {};
    const newFilesToAdd: Record<string, StoredFile> = {};
    const pathToIdMap = new Map<string, string>();
    let folderCounter = 0;
    
    filesArray.forEach((file: File, fileIndex) => {
        const pathParts = (file as any).webkitRelativePath.split('/');
        const fileName = pathParts.pop();
        if (!fileName) return; 

        let parentIdForCurrentLevel = currentFolderId;

        for (let i = 0; i < pathParts.length; i++) {
            const currentSubPath = pathParts.slice(0, i + 1).join('/');
            
            if (pathToIdMap.has(currentSubPath)) {
                parentIdForCurrentLevel = pathToIdMap.get(currentSubPath)!;
            } else {
                const newFolderId = `folder-${Date.now()}-${folderCounter++}`;
                const newFolder: Folder = {
                    id: newFolderId,
                    name: pathParts[i],
                    parentId: parentIdForCurrentLevel,
                    createdAt: Date.now(),
                };
                newFoldersToAdd[newFolderId] = newFolder;
                pathToIdMap.set(currentSubPath, newFolderId);
                parentIdForCurrentLevel = newFolderId;
            }
        }

        const newFileId = `file-${Date.now()}-${fileIndex}`;
        const newFile: StoredFile = {
            id: newFileId,
            name: fileName,
            type: file.type,
            size: file.size,
            parentId: parentIdForCurrentLevel,
            url: (file.type.startsWith('image/') || file.type.startsWith('video/')) ? URL.createObjectURL(file) : undefined,
            createdAt: Date.now(),
        };
        newFilesToAdd[newFileId] = newFile;
    });

    setFolders(prev => ({ ...prev, ...newFoldersToAdd }));
    setFiles(prev => ({ ...prev, ...newFilesToAdd }));
    
    if (event.target) {
        event.target.value = '';
    }
  };

  const triggerFolderUpload = useCallback(() => {
    folderInputRef.current?.click();
  }, []);

  const handleRequestDelete = (item: StoredFile | Folder) => {
    setItemToDelete(item);
  };

  const handleCancelDelete = () => {
    setItemToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.id === selectedItemId) {
        setSelectedItemId(null);
    }
    
    if ('size' in itemToDelete) {
        setFiles(prevFiles => {
            const newFiles = { ...prevFiles };
            delete newFiles[itemToDelete.id];
            return newFiles;
        });
        setComments(prev => {
            const newComments = {...prev};
            delete newComments[itemToDelete.id];
            return newComments;
        });
        setProperties(prev => {
            const newProperties = {...prev};
            delete newProperties[itemToDelete.id];
            return newProperties;
        });
    } else {
        const foldersToDeleteQueue = [itemToDelete.id];
        const descendantFileIdsToDelete = new Set<string>();
        const descendantFolderIdsToDelete = new Set<string>([itemToDelete.id]);

        const allFolders = Object.values(folders);
        const allFiles = Object.values(files);

        while (foldersToDeleteQueue.length > 0) {
            const folderId = foldersToDeleteQueue.shift()!;
            
            allFolders.forEach((folder: Folder) => {
                if (folder.parentId === folderId) {
                    descendantFolderIdsToDelete.add(folder.id);
                    foldersToDeleteQueue.push(folder.id);
                }
            });

            allFiles.forEach((file: StoredFile) => {
                if (file.parentId === folderId) {
                    descendantFileIdsToDelete.add(file.id);
                }
            });
        }
        
        setFolders(prevFolders => {
            const newFolders = { ...prevFolders };
            descendantFolderIdsToDelete.forEach(id => delete newFolders[id]);
            return newFolders;
        });

        setFiles(prevFiles => {
            const newFiles = { ...prevFiles };
            descendantFileIdsToDelete.forEach(id => delete newFiles[id]);
            return newFiles;
        });

        setComments(prevComments => {
            const newComments = {...prevComments};
            descendantFileIdsToDelete.forEach(id => delete newComments[id]);
            return newComments;
        });

        setProperties(prevProperties => {
            const newProperties = {...prevProperties};
            descendantFileIdsToDelete.forEach(id => delete newProperties[id]);
            return newProperties;
        });
    }

    setItemToDelete(null);
  };

  const handleRequestRename = (item: StoredFile | Folder) => {
    setItemToRename(item);
  };

  const handleCancelRename = () => {
    setItemToRename(null);
  };
  
  const handleConfirmRename = (newName: string) => {
    if (!itemToRename || !newName.trim()) {
        setItemToRename(null);
        return;
    }

    if ('size' in itemToRename) { // It's a file
        setFiles(prev => ({
            ...prev,
            [itemToRename.id]: { ...prev[itemToRename.id], name: newName.trim() }
        }));
    } else { // It's a folder
        setFolders(prev => ({
            ...prev,
            [itemToRename.id]: { ...prev[itemToRename.id], name: newName.trim() }
        }));
    }
    
    setItemToRename(null);
  };

  const handleSortChange = (key: SortKey, order: SortOrder) => {
    setSortKey(key);
    setSortOrder(order);
  };

  const handleOpenFilePreview = (file: StoredFile) => {
    if (file.url) {
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
            // Mark as opened
            setOpenedFiles(prev => {
                const newSet = new Set(prev);
                newSet.add(file.id);
                return newSet;
            });

            // Open preview modal
            if (file.type.startsWith('image/')) {
              setPreviewImage({ url: file.url, name: file.name });
            } else if (file.type.startsWith('video/')) {
              setPreviewVideo({ url: file.url, name: file.name });
            }
        }
    }
  };
  
  const handleSelectItem = (item: StoredFile | Folder) => {
    setSelectedItemId(prevId => prevId === item.id ? null : item.id);
  };

  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null;
    return files[selectedItemId] || folders[selectedItemId] || null;
  }, [selectedItemId, files, folders]);

  const folderItemCount = useMemo(() => {
    if (selectedItem && !('size' in selectedItem)) {
      const folderId = selectedItem.id;
      // FIX: Add explicit types to filter callback parameters to resolve 'unknown' type issue.
      const childFiles = Object.values(files).filter((f: StoredFile) => f.parentId === folderId).length;
      const childFolders = Object.values(folders).filter((f: Folder) => f.parentId === folderId).length;
      return childFiles + childFolders;
    }
    return 0;
  }, [selectedItem, files, folders]);

  const handleAddComment = (fileId: string, text: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      fileId,
      text,
      createdAt: Date.now(),
    };
    setComments(prev => {
        const existingComments = prev[fileId] || [];
        return {
            ...prev,
            [fileId]: [...existingComments, newComment]
        }
    });
  };

  const handleAddProperty = (fileId: string, text: string) => {
    const newProperty: FileProperty = {
      id: `prop-${Date.now()}`,
      fileId,
      text,
    };
    setProperties(prev => {
        const existingProperties = prev[fileId] || [];
        return {
            ...prev,
            [fileId]: [...existingProperties, newProperty]
        }
    });
  };

  const selectedItemComments = useMemo(() => {
    if (selectedItem && 'size' in selectedItem) {
        return comments[selectedItem.id] || [];
    }
    return [];
  }, [selectedItem, comments]);

  const selectedItemProperties = useMemo(() => {
    if (selectedItem && 'size' in selectedItem) {
        return properties[selectedItem.id] || [];
    }
    return [];
  }, [selectedItem, properties]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
            <Header 
                breadcrumbs={breadcrumbs} 
                onNavigateBack={handleNavigateBack}
                onNavigateToCrumb={handleNavigateToCrumb}
                isRoot={path.length === 1}
                sortKey={sortKey}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
            />
            <main className="flex-grow p-4 md:p-8 overflow-y-auto">
                {items.length > 0 ? (
                <FileSystemGrid 
                    items={items} 
                    onNavigate={handleNavigate} 
                    onRequestDelete={handleRequestDelete} 
                    onRequestRename={handleRequestRename}
                    onSelectItem={handleSelectItem}
                    selectedItemId={selectedItemId}
                    openedFileIds={openedFiles}
                />
                ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 pt-20">
                    <FolderIcon className="w-24 h-24 text-gray-600" />
                    <p className="mt-4 text-xl">This folder is empty</p>
                    <p>Upload a file or create a new folder.</p>
                </div>
                )}
            </main>
        </div>

        <DetailsPanel 
          item={selectedItem}
          itemCount={folderItemCount}
          onClose={() => setSelectedItemId(null)}
          onOpenFilePreview={handleOpenFilePreview}
          onOpenFolder={handleNavigate}
          onRequestRename={handleRequestRename}
          isFileOpened={fileId => openedFiles.has(fileId)}
          comments={selectedItemComments}
          onAddComment={handleAddComment}
          properties={selectedItemProperties}
          onAddProperty={handleAddProperty}
        />
      </div>

      <AddButton 
        onAddFolder={() => setIsCreateModalOpen(true)} 
        onAddFile={triggerFileUpload} 
        onAddFolderUpload={triggerFolderUpload}
      />
      <CreateFolderModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateFolder}
      />
      <DeleteConfirmationModal
        isOpen={!!itemToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        item={itemToDelete}
      />
      <RenameModal
        isOpen={!!itemToRename}
        onClose={handleCancelRename}
        onConfirm={handleConfirmRename}
        item={itemToRename}
      />
      <ImagePreviewModal
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        imageUrl={previewImage?.url ?? null}
        imageName={previewImage?.name ?? null}
      />
      <VideoPreviewModal
        isOpen={!!previewVideo}
        onClose={() => setPreviewVideo(null)}
        videoUrl={previewVideo?.url ?? null}
        videoName={previewVideo?.name ?? null}
      />
      <input 
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleUploadFile}
        className="hidden"
      />
      <input 
        type="file"
        multiple
        ref={folderInputRef}
        onChange={handleUploadFolder}
        className="hidden"
        // @ts-ignore
        webkitdirectory=""
      />
    </div>
  );
};

export default App;
