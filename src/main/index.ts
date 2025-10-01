import { app, shell, BrowserWindow, ipcMain, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'), // ✅ preload for bridge
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  }

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/**
 * Handle Google Login popup
 */
ipcMain.on('open-google-login', (event, url) => {
  const loginWindow = new BrowserWindow({
    width: 600,
    height: 800,
    autoHideMenuBar: false, // keep menu visible
    webPreferences: {
      nodeIntegration: false
    }
  })

  // Create custom menu
  const menu = Menu.buildFromTemplate([
    {
      label: 'Navigation',
      submenu: [
        {
          label: 'Back',
          accelerator: 'Alt+Left',
          click: () => {
            if (loginWindow.webContents.canGoBack()) {
              loginWindow.webContents.goBack()
            }
          }
        },
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => loginWindow.reload()
        },
        {
          label: 'Exit Login',
          accelerator: 'Esc',
          click: () => loginWindow.close()
        }
      ]
    }
  ])
  loginWindow.setMenu(menu)

  // Always start with a fresh session
  loginWindow.webContents.session.clearStorageData().then(() => {
    loginWindow.loadURL(url)
  })

  loginWindow.on('closed', () => {
    console.log('Google login popup closed')
  })
})
