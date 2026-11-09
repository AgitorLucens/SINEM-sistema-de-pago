import { handle } from './handle.js';
import { CHANNELS } from '../../ipc/channels.js';

/*
    IPC handlers for the Precios page.
*/
export function registerPricingHandlers(ipcMain, pricing) {
    handle(ipcMain, CHANNELS.pricing.addDivision, (_, division) => pricing.addDivision(division));

    handle(ipcMain, CHANNELS.pricing.deleteDivision, (_, id) => pricing.deleteDivision(id));

    handle(ipcMain, CHANNELS.pricing.updateDivision, (_, data) => pricing.updateDivision(data.id, data.name));

    handle(ipcMain, CHANNELS.pricing.updatePriceConcept, (_, concept) => pricing.updatePriceConcept(concept));

    handle(ipcMain, CHANNELS.pricing.updatePriceDivision, (_, division) => pricing.updatePriceDivision(division));

    handle(ipcMain, CHANNELS.pricing.getAllDivisionPaymentConcepts, () => pricing.getAllDivisionPaymentConcepts());

    handle(ipcMain, CHANNELS.pricing.updateDivisionPaymentConcept, (_, data) => pricing.updateDivisionPaymentConcept(data.id, data.amount));
}
