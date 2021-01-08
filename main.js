
const {app, BrowserWindow, session } = require('electron');
const path = require('path');

const createPrincipalView = () => {
    const win = new BrowserWindow({
        width: 800,
        height:600,
        webPreferences:{
            preload: path.join(__dirname,'preload.js'),
            nodeIntegration:true,
            enableRemoteModule:true
        }
    });
    win.loadURL(`file://${__dirname}/index.html`);
    const sesssion = session;
    console.log(sesssion.defaultSession);
    win.webContents.openDevTools();
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

app.whenReady().then(() => {
    if(BrowserWindow.getAllWindows().length === 0){
        createPrincipalView();
    }
});
