import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('deals', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('title').notNullable();
    table.text('description');
    table.decimal('value', 15, 2).notNullable();
    table.enum('status', ['prospecting', 'qualified', 'negotiating', 'won', 'lost']).defaultTo('prospecting');
    table.uuid('owner_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('client_name').notNullable();
    table.timestamp('expected_close_date').notNullable();
    table.integer('probability').notNullable().defaultTo(50);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.index('owner_id');
    table.index('status');
    table.index('expected_close_date');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('deals');
}
