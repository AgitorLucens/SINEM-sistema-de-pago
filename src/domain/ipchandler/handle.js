/*
    Uniform IPC error contract:

    - Domain code signals failure by THROWING.
    - This boundary logs every failure together with its channel name,
      then rethrows so the renderer receives a rejected invoke() promise
      (the renderer's DBFunctions wrappers already catch rejections).
    - Success shapes belong to the domain; the boundary never alters them.

    Every registrar must use this instead of calling ipcMain.handle
    directly.
*/
export function handle(ipcMain, channel, fn) {
    ipcMain.handle(channel, async (event, ...args) => {
        try {
            return await fn(event, ...args);
        } catch (error) {
            console.error(`IPC "${channel}" failed:`, error);
            throw error;
        }
    });
}
