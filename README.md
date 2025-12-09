 SINEM-sistema-de-pago

Use this command isnide the folder you want to be the project

npx create-electron-app --template=vite

use this to isntall react to the project

npm install react react-dom

so the project recognize react files use this

npm i @vitejs/plugin-react

And change the file "vite.renderer.config.mjs" and adding as described in this link:

https://www.npmjs.com/package/@vitejs/plugin-react

run project with

npm start

use this to generate .exe in windows

npm i --save-dev electron-builder

npm run make

for the certificate create an selft certificate with:

New-SelfSignedCertificate -Type CodeSigning -Subject "CN=MyAppCert"
