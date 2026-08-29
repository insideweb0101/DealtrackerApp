import db from '../config/database';
import { Alert } from '../types';

const TABLE = 'alerts';

export const alertModel = {
  async create(alert: Partial<Alert>) {
    const [id] = await db(TABLE)
      .insert({
        ...alert,
        is_read: false,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('id');
    return this.findById(id);
  },

  async findById(id: string) {
    return db(TABLE).where({ id }).first();
  },

  async findByDealId(dealId: string) {
    return db(TABLE).where({ deal_id: dealId }).orderBy('created_at', 'desc');
  },

  async findUnread(userId: string) {
    return db(TABLE)
      .where({ is_read: false })
      .whereIn(
        'deal_id',
        db('deals').select('id').where({ owner_id: userId })
      )
      .orderBy('created_at', 'desc');
  },

  async update(id: string, data: Partial<Alert>) {
    await db(TABLE)
      .where({ id })
      .update({
        ...data,
        updated_at: new Date(),
      });
    return this.findById(id);
  },

  async markAsRead(id: string) {
    return this.update(id, { is_read: true });
  },

  async delete(id: string) {
    return db(TABLE).where({ id }).del();
  },
};
