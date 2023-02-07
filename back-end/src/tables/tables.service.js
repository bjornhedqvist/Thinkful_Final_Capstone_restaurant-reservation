const knex = require("../db/connection");
// const mapProperties = require("../utils/map-properties");

async function list() {
  return knex("tables").select("*");
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

module.exports = {
    list,
    read,
    create
  };