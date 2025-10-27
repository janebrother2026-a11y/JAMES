export interface StoredFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string; // For image previews
  parentId: string;
  createdAt: number;
}

export interface Folder {
  id:string;
  name: string;
  parentId: string | null;
  createdAt: number;
}

export interface Comment {
  id: string;
  fileId: string;
  text: string;
  createdAt: number;
}

export interface FileProperty {
  id: string;
  fileId: string;
  text: string;
}
