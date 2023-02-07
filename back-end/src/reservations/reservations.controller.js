const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("first_name",
"last_name",
"mobile_number",
"reservation_date",
"reservation_time",
"people");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  let data = await service.list()
  data = data
    .filter((item)=>{ 
      return item.reservation_date == req.query.date
    })
    .sort((a, b) => a.reservation_time.slice(0,1) - b.reservation_time.slice(0,1))
    .sort((a, b) => a.reservation_time.slice(3,4) - b.reservation_time.slice(3,4))
  res.json({ data })
}

// create(POST) handler for new reservations
const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
]

function hasOnlyValidProperties(req, res, next){
  const { data = {} } = req.body
  const invalidFields = Object.keys(data).filter((field)=> !VALID_PROPERTIES.includes(field))
  if(invalidFields.length){
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    })
  }
  next()
}

//validates reservation exists for read reservation
function resieExists(req, res, next) {
  service
    .read(req.params.reservation_Id)
    .then((reservation) => {
      if (reservation) {
        res.locals.reservation = reservation;
        return next();
      }
      next({ status: 404, message: `Reservation ${req.params.reservation_Id} cannot be found.` });
    })
    .catch(next);
}
// read handler for reservation
async function read(req, res, next){
  const {reservation: data} = res.locals
  res
    .json({ data })
}

async function create(req, res, next){
  data = await service.create(req.body.data)
  res.status(201).json({ data })
}

module.exports = {
  list: [asyncErrorBoundary(list) ],
  create: [hasOnlyValidProperties, hasRequiredProperties,  asyncErrorBoundary(create) ],
  read: [asyncErrorBoundary(resieExists), asyncErrorBoundary(read)]
};
