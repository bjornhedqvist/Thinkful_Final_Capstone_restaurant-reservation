const reservationsService = require("../reservations/reservations.service");
const { read } = require("../tables/tables.controller");

function hasReqFinishProperties(...properties) {
  return async function (req, res, next) {
    const { data = {} } = req.body;

    //sends read request to reservations, for use checking if reservation exists and if table capacity is a match
    let readResieId = null;
    if (data.reservation_id) {
      readResieId = await reservationsService.read(data.reservation_id);
    }

    //validators for table occupied
    try {
      if (res.locals.table.reservation_id == null) {
        const error = new Error(
          `table ${res.locals.table.table_name} is not occupied with a reservation.`
        );
        error.status = 400;
        throw error;
      } else if (res.locals.table.reservation_id != null) {
        res.status(200);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = hasReqFinishProperties;
