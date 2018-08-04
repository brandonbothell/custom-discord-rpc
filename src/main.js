const { app, BrowserWindow, Menu, Tray } = require('electron')
const path = require('path')
const url = require('url')

let mainWindow
let appIcon

function createWindow() {
  app.setName('Custom RPC')
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
  appIcon.setToolTip('Custom Discord RPC')
  appIcon.setContextMenu(contextMenu)
  appIcon.addListener('double-click', () => {
    mainWindow.show()
  })

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
