import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('notifications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('alert_id').notNullable().references('id').inTable('alerts').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.enum('channel', ['email', 'slack', 'sms', 'in_app']).notNullable();
    table.text('content').notNullable();
    table.timestamp('sent_at');
    table.timestamp('delivered_at');
    table.timestamp('failed_at');
    table.text('error_message');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.index('user_id');
    table.index('alert_id');
    table.index('channel');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('notifications');
}
