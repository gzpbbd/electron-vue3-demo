export interface FileInfo {
  name: string;
  path: string;
  isDirectory: boolean;
}

export interface NavState {
  canGoBack: boolean;
  canGoForward: boolean;
  currentUrl: string;
}

export interface ElectronAPI {
  getDriveFiles: () => Promise<FileInfo[]>;
  browserGoBack: () => Promise<void>;
  browserGoForward: () => Promise<void>;
  browserRefresh: () => Promise<void>;
  browserLoadUrl: (url: string) => Promise<void>;
  getNavState: () => Promise<NavState>;
  extractPageData: () => Promise<any>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
} 