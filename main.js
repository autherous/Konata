'user strict';
const electron = require("electron");
const {app} = electron;
const {BrowserWindow} = electron;
// アプリケーションをコントロールするモジュール
//var app = require('app');
// ウィンドウを作成するモジュール
//var BrowserWindow = require('browser-window');
// 起動URL
var currentURL = 'file://' + __dirname + '/index.html';
// クラッジュレポーター
require('crash-reporter').start();
// メインウィンドウはGCされないようにグローバル宣言
var mainWindow = null;
var ipc = electron.ipcMain;

var KanataData = require("./KanataData");
var Op = require("./Op");
var OnikiriLog = require("./OnikiriLog");
//var Module = require("./Module");
    
//var mo = require("./Module");

// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});
// Electronの初期化完了後に実行
app.on('ready', function() {
    
    mainWindow = new BrowserWindow(
        {width: 800, height: 600, 
            //webPreferences: {nodeIntegration: false}
    });

    //kanataData.PrintAsHTML();
    mainWindow.loadUrl(currentURL);
    mainWindow.toggleDevTools();
    // ウィンドウが閉じられたらアプリも終了
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});


ipc.on('asynchronous-message', function(event, arg) {
    var onikiri = new OnikiriLog("./vis.1500000.log");
    onikiri.AsyncProcess(SendOps);
});

function SendOps(ops) {
    //console.log("aaa");
    mainWindow.webContents
        .send('asynchronous-message', ['Draw', ops]);
}
