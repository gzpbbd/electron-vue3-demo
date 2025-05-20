export interface FileInfo {
  name: string;
  path: string;
  isDirectory: boolean;
}

export interface ElectronAPI {
  getDriveFiles: () => Promise<FileInfo[]>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
} 