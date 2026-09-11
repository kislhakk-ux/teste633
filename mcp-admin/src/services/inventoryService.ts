import { ServiceStatus } from '../types/index.js';

export class InventoryService {
  public async getStatus(): Promise<ServiceStatus> {
    return {
      status: 'not_configured',
      message: 'Serviço de inventário aguardando implementação na Etapa 4 e 5',
    };
  }
}

export const inventoryService = new InventoryService();
