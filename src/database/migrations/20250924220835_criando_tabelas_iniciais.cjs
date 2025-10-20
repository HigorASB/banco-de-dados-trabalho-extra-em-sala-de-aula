/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("marcas", (table) => {
      table.increments("id").primary();
      table.string("nome", 100).notNullable();
      table.string("site", "100");
      table.string("telefone", 15);
    })
    .then(() => {
      return knex.schema.createTable("produtos", (table) => {
        table.increments("id").primary();
        table.string("nome", 100).notNullable();
        table.decimal("preco", 8, 2).notNullable();
        table.integer("estoque").notNullable();
        table
          .integer("id_marca")
          .unsigned()
          .references("marcas.id")
          .notNullable()
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
      });
    })
    .then(() => {
      return knex.schema.createTable("clientes", (table) => {
        table.increments("id").primary();
        table.string("nome", 100).notNullable().unique();
        table.string("email", 100).notNullable().unique();
        table.string("cidade", 100).notNullable();
      });
    })
    .then(() => {
      return knex.schema.createTable("pedidos", (table) => {
        table.increments("id").primary();
        table.timestamp("data_pedido").defaultTo(knex.fn.now()).notNullable();
        table
          .integer("id_cliente")
          .unsigned()
          .references("clientes.id")
          .notNullable()
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table.decimal("valor_total", 8, 2).notNullable();
      });
    })
    .then(() => {
      return knex.schema.createTable("itens_pedidos", (table) => {
        table
          .integer("id_pedido")
          .unsigned()
          .references("pedidos.id")
          .notNullable()
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table
          .integer("id_produto")
          .unsigned()
          .references("produtos.id")
          .notNullable()
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table.integer("quantidade").notNullable();
        table.decimal("preco_unitario", 8, 2).notNullable();

        table.primary(["id_pedido", "id_produto"]);
      });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable("itens_pedidos")
    .then(() => {
      return knex.schema.dropTable("pedidos");
    })
    .then(() => {
      return knex.schema.dropTable("clientes");
    })
    .then(() => {
      return knex.schema.dropTable("produtos");
    })
    .then(() => {
      return knex.schema.dropTable("marcas");
    });
};
