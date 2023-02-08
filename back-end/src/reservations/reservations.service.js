const knex = require("../db/connection");
// const mapProperties = require("../utils/map-properties");

async function list() {
  return knex("reservations")
  .select()
  .orderBy("reservation_time")
}

async function create(reservation){
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((createdRecords => createdRecords[0]))
}

async function read(reservationId){
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first()
}

async function update(updatedReservation){
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id})
    .update(updatedReservation, "*")
    .then((reservationData) => reservationData[0])
}

module.exports = {
    list,
    create, 
    read,
    update
  };