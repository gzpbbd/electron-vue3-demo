const { contextBridge, ipcRenderer } = require('electron')

// 暴露 API 到渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  getDriveFiles: () => ipcRenderer.invoke('get-drive-files')
})

// 移除不必要的 DOMContentLoaded 事件监听器
  