// main.js
const { app, BrowserWindow,ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  // Create a new browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, 
    webPreferences: {
    preload: path.join(__dirname, 'dist',"preload.js"),
      // For improved security: disable Node.js integration if your React code does not require it.
      nodeIntegration: false,
      contextIsolation: true,
    },
    
  });

  
  // Load your React build (the index.html in the "dist" folder).
  win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  
  ipcMain.on("window-control", (_, action) => {
    if (action === "minimize") win.minimize();
    else if (action === "maximize") win.isMaximized() ? win.unmaximize() : win.maximize();
    else if (action === "close") win.close();
  });
}

// When Electron is ready, create the window.
app.whenReady().then(createWindow);
 
// On macOS, re-create a window when the dock icon is clicked and there are no open windows.
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Quit the app when all windows are closed (except on macOS).
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
