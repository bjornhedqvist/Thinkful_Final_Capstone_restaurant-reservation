const knex = require("../db/connection");
// const mapProperties = require("../utils/map-properties");

async function list() {
  return knex("reservations").select("*");
}

module.exports = {
    list
  };