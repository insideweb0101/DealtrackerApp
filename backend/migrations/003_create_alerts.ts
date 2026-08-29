import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('alerts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('deal_id').notNullable().references('id').inTable('deals').onDelete('CASCADE');
    table.enum('type', ['status_change', 'approaching_deadline', 'anomaly', 'stalled', 'custom']).notNullable();
    table.text('message').notNullable();
    table.enum('severity', ['low', 'medium', 'high', 'critical']).defaultTo('medium');
    table.boolean('is_read').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.index('deal_id');
    table.index('is_read');
    table.index('created_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('alerts');
}
