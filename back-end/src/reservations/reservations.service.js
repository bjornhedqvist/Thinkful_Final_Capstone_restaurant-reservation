const knex = require("../db/connection");

function list(date) {
  return knex("reservations")
    .select()
    .where({ reservation_date: date.toString() })
    .whereNot({ "reservations.status": "finished" })
    .whereNot({ "reservations.status": "cancelled" })
    .orderBy("reservation_time");
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

async function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

async function read(reservationId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first();
}

async function update(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .then((reservationData) => reservationData[0]);
}

async function edit(reservation_id, data) {
  return knex("reservations")
    .select()
    .where({ reservation_id })
    .update(data, "*")
    .returning("*")
    .then((reservationData) => reservationData[0]);
}

module.exports = {
  list,
  search,
  create,
  read,
  update,
  edit,
};
