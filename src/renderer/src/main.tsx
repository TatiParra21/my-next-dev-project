import './assets/main.css'

import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'

import App from './App'
import { app, BrowserWindow, ipcMain } from 'electron'

let mainWindow: BrowserWindow | null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  })
  mainWindow.loadFile('index.html')
}

app.whenReady().then(createWindow)

// Listen for requests to open OAuth popup
ipcMain.on('open-oauth-window', (event, url: string) => {
  const loginWindow = new BrowserWindow({
    width: 600,
    height: 800,
    webPreferences: { nodeIntegration: false, contextIsolation: true }
  })

  loginWindow.loadURL(url)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   
    <App />
    
  </StrictMode>
)
