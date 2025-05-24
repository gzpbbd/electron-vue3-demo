const { contextBridge, ipcRenderer } = require('electron')

// 暴露 API 到渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 浏览器控制
  browserGoBack: () => ipcRenderer.invoke('browser-go-back'),
  browserGoForward: () => ipcRenderer.invoke('browser-go-forward'),
  browserRefresh: () => ipcRenderer.invoke('browser-refresh'),
  browserLoadUrl: (url) => ipcRenderer.invoke('browser-load-url', url),
  getNavState: () => ipcRenderer.invoke('get-nav-state'),
  // 数据提取
  extractPageData: () => ipcRenderer.invoke('extract-page-data')
})

// 移除不必要的 DOMContentLoaded 事件监听器
  