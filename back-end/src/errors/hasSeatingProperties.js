const reservationsService = require("../reservations/reservations.service");
const { read } = require("../tables/tables.controller");

function hasSeatingProperties(...properties) {
    return async function (req, res, next) {
      const { data = {} } = req.body;

      //sends read request to reservations, for use checking if reservation exists and if table capacity is a match
      let readResieId = null
      if(data.reservation_id){
         readResieId = await reservationsService.read(data.reservation_id)
      }
      
      //validators for data existence and reservation_id properties
      //validators for table capacity and if table is occupied
      try {
        properties.forEach((property) => {
          if (!data[property]) {
            const error = new Error(`A '${property}' property is required.`);
            error.status = 400;
            throw error;
          }
        });
        if (!req.body.data){
          const error = new Error(`Expexted data, data appears to be missing. Recieved: '${data}'`);
            error.status = 400;
            throw error;
        }
        else if(readResieId == undefined){
          const error = new Error(`reservation_id ${data.reservation_id} does not exist.`);
            error.status = 404;
            throw error;
        }
        else if(readResieId && readResieId.people > res.locals.table.capacity){
          const error = new Error(`capacity issue: reservation under "${readResieId.first_name} ${readResieId.last_name}" is for ${readResieId.people} people, table ${res.locals.table.table_name} seats only up to ${res.locals.table.capacity} people.`);
          error.status = 400;
          throw error;
        }
        else if (res.locals.table.reservation_id != null){
          const error = new Error(`table ${res.locals.table.table_name} is occupied with reservation ${res.locals.table.reservation_id}.`);
          error.status = 400;
          throw error;
        }else if(readResieId.status == 'seated'){
          const error = new Error(`Error, status is currently '${readResieId.status}'. An already seated reservation cannot be seated.`);
          error.status = 400;
          throw error;
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }
  
  module.exports = hasSeatingProperties;