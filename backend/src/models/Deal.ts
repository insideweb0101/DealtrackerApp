import db from '../config/database';
import { Deal } from '../types';

const TABLE = 'deals';

export const dealModel = {
  async create(deal: Partial<Deal>) {
    const [id] = await db(TABLE)
      .insert({
        ...deal,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('id');
    return this.findById(id);
  },

  async findById(id: string) {
    return db(TABLE).where({ id }).first();
  },

  async findAll(ownerId?: string, status?: string) {
    let query = db(TABLE);

    if (ownerId) query = query.where({ owner_id: ownerId });
    if (status) query = query.where({ status });

    return query.orderBy('created_at', 'desc');
  },

  async update(id: string, data: Partial<Deal>) {
    await db(TABLE)
      .where({ id })
      .update({
        ...data,
        updated_at: new Date(),
      });
    return this.findById(id);
  },

  async delete(id: string) {
    return db(TABLE).where({ id }).del();
  },

  async getByStatus(status: string) {
    return db(TABLE).where({ status }).orderBy('expected_close_date', 'asc');
  },
};
