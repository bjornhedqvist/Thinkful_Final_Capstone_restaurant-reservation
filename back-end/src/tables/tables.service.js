const knex = require("../db/connection");

async function list() {
  return knex("tables").select().orderBy("table_name");
}

async function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

async function read(tableId) {
  return knex("tables").select("*").where({ table_id: tableId }).first();
}

function seat(tableId, reservation_id) {
  return knex.transaction(async function (trx) {
    return trx("tables")
      .where({ table_id: tableId })
      .update({ reservation_id })
      .returning("*")
      .then(() => {
        return trx("reservations")
          .where({ reservation_id })
          .update({ status: "seated" })
          .returning("*")
          .then((updatedRes) => updatedRes[0]);
      });
  });
}

function unseat({ table_id, reservation_id }) {
  return knex.transaction(async function (trx) {
    return trx("tables")
      .where({ table_id })
      .update({ reservation_id: null })
      .returning("*")
      .then(() => {
        return trx("reservations")
          .where({ reservation_id })
          .update({ status: `finished` })
          .returning("*")
          .then((tableData) => tableData[0]);
      });
  });
}

module.exports = {
  list,
  read,
  create,
  seat,
  unseat,
};
