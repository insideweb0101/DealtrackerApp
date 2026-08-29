import { Seeder } from 'knex';
import db from '../src/config/database';

export async function seed(knex: typeof db) {
  // Delete existing entries
  await knex('users').del();

  // Insert seed data
  await knex('users').insert([
    {
      email: 'admin@dealtracker.app',
      name: 'Admin User',
      password_hash: 'hashed_password_here',
      role: 'admin',
    },
    {
      email: 'manager@dealtracker.app',
      name: 'Manager User',
      password_hash: 'hashed_password_here',
      role: 'manager',
    },
    {
      email: 'sales@dealtracker.app',
      name: 'Sales Rep',
      password_hash: 'hashed_password_here',
      role: 'sales_rep',
    },
  ]);
}
