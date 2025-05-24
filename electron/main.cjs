const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

let mainWindow; // 主窗口 - 用于显示我们的Vue页面
let browserWindow; // 浏览器窗口 - 用于显示小红书

function createWindows() {
  // 创建主窗口 - 显示我们的Vue页面
  mainWindow = new BrowserWindow({
    width: 600,
    height: 800,
    x: 0, // 设置窗口位置在左边
    y: 0,
    title: '小红书数据分析',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true
    }
  });

  // 创建浏览器窗口 - 显示小红书
  browserWindow = new BrowserWindow({
    width: 600,
    height: 800,
    x: 600, // 设置窗口位置在右边
    y: 0,
    title: '小红书浏览器',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // 加载小红书
  browserWindow.loadURL('https://www.xiaohongshu.com');

  // 开发环境加载本地服务器
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // 处理导航事件
  ipcMain.handle('browser-go-back', () => {
    if (browserWindow.webContents.canGoBack()) {
      browserWindow.webContents.goBack();
    }
  });

  ipcMain.handle('browser-go-forward', () => {
    if (browserWindow.webContents.canGoForward()) {
      browserWindow.webContents.goForward();
    }
  });

  ipcMain.handle('browser-refresh', () => {
    browserWindow.webContents.reload();
  });

  ipcMain.handle('browser-load-url', (event, url) => {
    browserWindow.webContents.loadURL(url);
  });

  // 获取导航状态
  ipcMain.handle('get-nav-state', () => {
    return {
      canGoBack: browserWindow.webContents.canGoBack(),
      canGoForward: browserWindow.webContents.canGoForward(),
      currentUrl: browserWindow.webContents.getURL()
    };
  });

  // 监听窗口关闭事件
  mainWindow.on('closed', () => {
    mainWindow = null;
    // 当主窗口关闭时，也关闭浏览器窗口
    if (browserWindow) {
      browserWindow.close();
      browserWindow = null;
    }
  });

  browserWindow.on('closed', () => {
    browserWindow = null;
  });
}

app.whenReady().then(() => {
  createWindows();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindows();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

