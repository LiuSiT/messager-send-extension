'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const path = require("path")
const fs = require("fs")
const child_process = require('child_process');
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let win;

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 600,
    height: 610,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

let chromeProcess = null;
// 接收渲染进程发过来的消息
ipcMain.on('new-message', function(event, arg) {
  console.log('渲染线程发过来的消息:', arg)
  switch (arg.code) {
    case 'openChrome':
      chromeProcess = openChrome();

      win.webContents.send("fromMain", {});
      //发送给渲染进程也可以这样做
      // event.sender.send('new-message', {code: 'reply', {}})
      break;
    case 'closeChrome':
      closeChrome(chromeProcess)
      break;
  }
})

function moveMouse() {
  // Move the mouse across the screen as a sine wave.
  var robot = require("robotjs");

  // Speed up the mouse.
  robot.setMouseDelay(2);

  var twoPI = Math.PI * 2.0;
  var screenSize = robot.getScreenSize();
  var height = (screenSize.height / 2) - 10;
  var width = screenSize.width;

  for (var x = 0; x < width; x++)
  {
    let y = height * Math.sin((twoPI * x) / width) + height;
    robot.moveMouse(x, y);
  }
}

function openChrome() {
  let exec_path = null;
  let user_data_dir;
  let username;
  switch(process.platform) {
    case 'darwin':
      exec_path = '"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"'
      user_data_dir = `/Users/${username}/Library/Application Support/Google/Chrome`
      break;
    case 'win32':
      let exec_path_list = [`C:/Users/{username}/AppData/Local/Google/Chrome/Application/chrome.exe`,
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe']
      for( let i = 0; i < exec_path_list.length; i ++){
        fs.exists(exec_path_list[i], function(exists) {
          if(exists) {
            exec_path = '"' + exec_path_line + '"'
            user_data_dir = `C:/Users/${username}/AppData/Local/Google/Chrome/User Data`
          }
        })
      }
      break;
  }
  if (exec_path == null) {
    console.log("没有找到chrome浏览器!")
    return
  }
  let profile_arg;
  let use_user_data_dir;
  if (profile_dir == null) {
    use_user_data_dir = user_data_dir + '/' + profile_dir
    profile_arg = ` --profile-directory="${profile_dir}"`
  }  else {
    use_user_data_dir = user_data_dir + '/Default'
    profile_arg = ''
    fs.exists(use_user_data_dir, function(exists) {
      if (!exists) {
        print("没有chrome用户!")
        return
      }
    })
  }
  let cmd = `${exec_path} --remote-debugging-port=9222 --user-data-dir="${user_data_dir}"${profile_arg}`
  var chromeProcess = child_process.exec(cmd, function (error, stdout, stderr) {
    if (error) {
      console.log(error.stack);
      console.log('Error code: '+error.code);
      console.log('Signal received: '+error.signal);
    }
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
  });
  return chromeProcess;
}

function closeChrome(chromeProcess){
  if (chromeProcess != null) {
    chromeProcess.kill("SIGINT");
  }
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
