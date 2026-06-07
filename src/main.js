import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import AppDB from './domain/db/db.js';
import AppExcel from './domain/excel/excel.js';
import setUpHandlers from './domain/ipchandler/ipcHandlers';

let db;
let excel;
let mainWindow;

if (started) {
  app.quit();
}

/* ------------------------------------------------------------------ */
/*  Static splash HTML shown while the database initialises            */
/*  Embedded as a data URL so no separate file or build config needed  */
/* ------------------------------------------------------------------ */
const splashHTML = `<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<title>SINEM</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    font-family: system-ui, -apple-system, sans-serif;
  }
  .center { text-align: center; }
  .logo { animation: bounce 1s ease-in-out infinite alternate; margin-bottom: 1.5rem; }
  .title { font-size: 2.5rem; font-weight: 800; color: #fff; letter-spacing: .1em; }
  .subtitle { font-size: .875rem; color: #94a3b8; margin: .5rem 0 2rem; }
  .dots { display: flex; justify-content: center; gap: 8px; }
  .dot { width: 10px; height: 10px; border-radius: 50%; background: #4f46e5; animation: pulse 1.2s ease-in-out infinite; }
  .dot:nth-child(2) { animation-delay: .2s; }
  .dot:nth-child(3) { animation-delay: .4s; }
  .loading-text { margin-top: 1.5rem; color: #64748b; font-size: .75rem; }
  @keyframes bounce { from { transform: translateY(0) } to { transform: translateY(-8px) } }
  @keyframes pulse { 0%, 80%, 100% { transform: scale(.6); opacity: .4 } 40% { transform: scale(1); opacity: 1 } }
</style>
</head>
<body>
<div class="center">
  <div class="logo">
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="16" fill="#4f46e5"/>
      <path d="M20 44V20h8l8 12 8-12h8v24h-8V32l-8 12-8-12v12H20z" fill="white"/>
    </svg>
  </div>
  <h1 class="title">SINEM</h1>
  <p class="subtitle">Sistema de Gesti&oacute;n de Pagos</p>
  <div class="dots">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>
  <p class="loading-text">Cargando base de datos...</p>
</div>
</body>
</html>`;

/* ------------------------------------------------------------------ */
/*  Load the real React renderer (dev server or built files)          */
/* ------------------------------------------------------------------ */
async function loadApp() {
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    await mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
}

/* ------------------------------------------------------------------ */
/*  App ready – splash → DB → renderer                                 */
/* ------------------------------------------------------------------ */
app.whenReady().then(async () => {
  // 1. Create window immediately (invisible), load static splash
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    show: false,
    backgroundColor: '#0f172a',
    alwaysOnTop: false,
    autoHideMenuBar: true,
    icon: './ui/assets/SINEM',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(splashHTML)}`,
  );

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // 2. Initialise DB while user sees the static splash spinner
  db = new AppDB();
  excel = new AppExcel();
  setUpHandlers(db, excel);

  // 3. Load the real React app (replaces splash.html)
  await loadApp();

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = new BrowserWindow({
        width: 1400,
        height: 1000,
        show: false,
        backgroundColor: '#0f172a',
        alwaysOnTop: false,
        autoHideMenuBar: true,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js'),
        },
      });
      mainWindow.once('ready-to-show', () => mainWindow.show());
      loadApp();
    }
  });
});

app.on('window-all-closed', () => {
  if (db) {
    db.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});