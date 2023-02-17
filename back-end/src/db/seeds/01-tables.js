//The tables table must be seeded with the following data:

// Bar #1 & Bar #2, each with a capacity of 1.
// #1 & #2, each with a capacity of 6.
const tables = require("./01-tables.json")

exports.seed = function (knex) {
  return knex
  .raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE")
  .then(function(){
    return knex("tables").insert(tables)
  })
};

//overwritten code from beggining 
// exports.seed = function (knex) {
//   return knex.raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE");
// };
