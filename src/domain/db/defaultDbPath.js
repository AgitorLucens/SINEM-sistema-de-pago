import { app } from 'electron';
import path from 'node:path';

/*
    The ONLY module in domain/db that imports electron.
    Tests inject their own dbPath into createDb() and never load this file.
*/
export default function defaultDbPath() {
    return path.join(app.getPath('userData'), 'sinem.sqlite');
}
