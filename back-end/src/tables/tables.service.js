const knex = require("../db/connection");
// const mapProperties = require("../utils/map-properties");

async function list() {
  return knex("tables")
  .select()
  .orderBy("table_name")
}

async function create(table){
    return knex("tables")
        .insert(table)
        .returning("*")
        .then((createdRecords => createdRecords[0]))
}

async function read(tableId){
  return knex("tables")
    .select("*")
    .where({ table_id: tableId })
    .first()
}

async function update(updatedTable){
  return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
}

async function destroy( table_id ){
  return knex("tables")
    .where({ table_id })
    .del()
}

module.exports = {
    list,
    read,
    create,
    update,
    delete: destroy,
  };