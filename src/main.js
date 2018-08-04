const { app, BrowserWindow, Menu, Tray } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')
const url = require('url')

let mainWindow
let appIcon

function createWindow() {
  autoUpdater.checkForUpdatesAndNotify()
  app.setName('Custom Discord RPC - ' + app.getVersion())
  mainWindow = new BrowserWindow({
    width: 640,
    height: 480,
    resizable: true,
    titleBarStyle: 'hidden',
    alwaysOnTop: true
  })

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click:  function(){
        mainWindow.show()
    } },
    { label: 'Quit', click:  function(){
        app.isQuiting = true;
        app.quit()
    } }
  ]);

  appIcon = new Tray(path.join(__dirname, 'images', 'macho.png'))
  appIcon.setToolTip('Custom Discord RPC' + app.getVersion())
  appIcon.setContextMenu(contextMenu)
  appIcon.addListener('double-click', () => {
    mainWindow.show()
  })

  mainWindow.setTitle('Custom Discord RPC - ' + app.getVersion())

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }))

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('minimize', function (event) {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('close', function (event) {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }

    return false;
  })

  mainWindow.on('page-title-updated', (event) => {
    event.preventDefault()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
