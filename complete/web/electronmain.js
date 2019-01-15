"use strict";

// Require electron and node.js modules. Use ES6 style const declaration to store the
// Module names as these will not change.
const electron = require('electron');
const path=require('path');
const app=electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

// Store a reference to the mainWindow. Once this is created the application will not terminate
// until this is set (back) to null to free the pointer to the window (once it is closed)
let mainWindow=null;

// Function to create the application window
var createWindow=function() {
    
    let opts= {width: 800, height: 500};
    let fullURL='file://' + path.resolve(__dirname , 'index.html');
    
    // This is the key here -- this script is run before the html file is loaded
    // and can include node-style requires even if the rest of the window
    // has no node integration (turned off below nodeIntegration:false).
    let preload=  path.resolve(__dirname, 'electronpreload.js');
    
    // Create main window
    mainWindow=new BrowserWindow({width: opts.width,
     				  height: opts.height,
     				  show: true,
     				  webPreferences: {
     				      nodeIntegration: false,
     				      preload: preload,
     				  },
     				 });
    
    // Register callbacks
    mainWindow.setAutoHideMenuBar(true);
    mainWindow.setMenuBarVisibility(false);

    mainWindow.once('ready-to-show', () => { mainWindow.show(); });
    mainWindow.on('closed', () => { mainWindow = null;});
    
    // Load the URL to start
    mainWindow.loadURL(fullURL);
};

// This is boilerplate from electron examples. 
// Application level Callbacks
     // Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    createWindow();
});

