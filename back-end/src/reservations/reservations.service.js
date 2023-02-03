const knex = require("../db/connection");
// const mapProperties = require("../utils/map-properties");

async function list() {
  return knex("reservations").select("*");
}

async function create(reservation){
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((createdRecords => createdRecords[0]))
}

module.exports = {
    list,
    create
  };