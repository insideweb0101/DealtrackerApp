import { dealModel } from '../models/Deal';
import { Deal } from '../types';

export const dealService = {
  async createDeal(dealData: Partial<Deal>) {
    return dealModel.create(dealData);
  },

  async getDeal(id: string) {
    return dealModel.findById(id);
  },

  async getDealsByOwner(ownerId: string, status?: string) {
    return dealModel.findAll(ownerId, status);
  },

  async getAllDeals() {
    return dealModel.findAll();
  },

  async updateDeal(id: string, data: Partial<Deal>) {
    return dealModel.update(id, data);
  },

  async deleteDeal(id: string) {
    return dealModel.delete(id);
  },

  async getDealsByStatus(status: string) {
    return dealModel.getByStatus(status);
  },

  async calculatePipeline() {
    const deals = await dealModel.findAll();
    const statuses = ['prospecting', 'qualified', 'negotiating', 'won', 'lost'];
    const pipeline: Record<string, any> = {};

    for (const status of statuses) {
      const statusDeals = deals.filter((d) => d.status === status);
      pipeline[status] = {
        count: statusDeals.length,
        value: statusDeals.reduce((sum, d) => sum + d.value, 0),
        avgProbability: statusDeals.length > 0
          ? statusDeals.reduce((sum, d) => sum + d.probability, 0) / statusDeals.length
          : 0,
      };
    }

    return pipeline;
  },
};
