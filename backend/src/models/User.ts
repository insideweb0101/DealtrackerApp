import db from '../config/database';
import { User } from '../types';
import bcrypt from 'bcryptjs';

const TABLE = 'users';

export const userModel = {
  async create(user: Partial<User>) {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(user.password_hash || '', salt);

    const [id] = await db(TABLE)
      .insert({
        ...user,
        password_hash,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('id');
    return this.findById(id);
  },

  async findById(id: string) {
    const user = await db(TABLE).where({ id }).first();
    if (user) delete user.password_hash;
    return user;
  },

  async findByEmail(email: string) {
    return db(TABLE).where({ email }).first();
  },

  async findAll() {
    return db(TABLE).select('id', 'email', 'name', 'role', 'created_at');
  },

  async update(id: string, data: Partial<User>) {
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

  async verifyPassword(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password_hash);
    return isValid ? user : null;
  },
};
