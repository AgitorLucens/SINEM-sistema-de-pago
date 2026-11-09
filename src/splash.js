/*
    Static splash HTML shown while the database initialises.
    Embedded as a data URL so no separate file or build config is needed.
*/
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

export const SPLASH_URL = `data:text/html;charset=utf-8,${encodeURIComponent(splashHTML)}`;
