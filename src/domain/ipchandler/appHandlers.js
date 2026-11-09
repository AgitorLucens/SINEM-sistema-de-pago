import { app } from 'electron';
import { handle } from './handle.js';
import { CHANNELS } from '../../ipc/channels.js';

/*
    IPC handlers for app functionality: image gallery + quit.
*/
export function registerAppHandlers(ipcMain, images) {
    handle(ipcMain, CHANNELS.images.addImage, (_, imageData) => images.addImage(imageData));

    handle(ipcMain, CHANNELS.images.getImages, () => images.getImages());

    handle(ipcMain, CHANNELS.images.setImage, (_, imageState) => images.setImage(imageState));

    handle(ipcMain, CHANNELS.images.getCurrentImage, () => images.getCurrentImage());

    handle(ipcMain, CHANNELS.images.deleteImageById, (_, id) => images.deleteImageById(id));

    handle(ipcMain, CHANNELS.app.quitApp, () => app.quit());
}
