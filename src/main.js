import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { SPLASH_URL } from './splash.js';
import { createDb } from './domain/db/index.js';
import AppExcel from './domain/excel/excel.js';
import setUpHandlers from './domain/ipchandler/ipcHandlers';

let db;
let excel;
let mainWindow;

if (started) {
  app.quit();
}

/*
    BrowserWindow factory — the single place window options are defined.
    Used both for the initial window and the macOS 'activate' re-creation.
*/
function createMainWindow() {
  const window = new BrowserWindow({
    width: 1400,
    height: 1000,
    show: false,
    backgroundColor: '#0f172a',
    alwaysOnTop: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, '..', '..', 'src', 'ui', 'assets', 'SINEM.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  window.once('ready-to-show', () => window.show());
  return window;
}

/*
    Load the real React renderer (dev server or built files)
*/
async function loadApp() {
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    await mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
}

/*
    App ready – splash → DB → renderer
*/
app.whenReady().then(async () => {
  // 1. Create window immediately (invisible), load static splash
  mainWindow = createMainWindow();
  mainWindow.loadURL(SPLASH_URL);

  // 2. Initialise DB while user sees the static splash spinner
  db = createDb();
  excel = new AppExcel();
  setUpHandlers(db, excel);

  // 3. Load the real React app (replaces splash.html)
  await loadApp();

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow();
      loadApp();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (db) {
    db.close();
  }
});
