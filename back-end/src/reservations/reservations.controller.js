const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("first_name",
"last_name",
"mobile_number",
"reservation_date",
"reservation_time",
"people");

//List handler for reservations
async function list(req, res, next) {
  const today = new Date().toLocaleDateString().replace(/\//g, '-');
  const { date = today, mobile_number } = req.query;
  let reservations;
  if (mobile_number) {
    reservations = await service.search(mobile_number);
  } else {
    reservations = await service.list(date);
  }
  res.json({
    data: [...reservations],
  });
}

// create(POST) handler for new reservations
const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "reservation_id",
  "created_at",
  "updated_at"
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

async function bookedCheck(req, res, next){
  try{
    if (req.body.data.status && req.body.data.status !== "booked") {
      const error = new Error(`status must be "booked", received: ${req.body.data.status}`);
      error.status = 400;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next){
  data = await service.create(req.body.data)
  res.status(201).json({ data })
}

function hasStatusProperties(req, res, next){
  try{
    if(req.body.data.status != 'booked' && req.body.data.status != 'seated' && req.body.data.status != 'finished' && req.body.data.status != 'pending' && req.body.data.status != 'cancelled'){
        const error = new Error(`Error, status is unknown, recieved: '${req.body.data.status}'. Expected: booked, seated, or finished.`);
        error.status = 400;
        throw error;
      }
      if(res.locals.reservation.status == 'finished'){
        const error = new Error(`Error, status is currently '${res.locals.reservation.status}'. A 'finished' reservation cannot be updated.`);
        error.status = 400;
        throw error;
      }
    next();
  } catch (error) {
      next(error);
  }
}

async function update(req, res, next){
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  }
  service
    .update(updatedReservation)
    .then((data)=>res.json({ data }))
    .catch(next)
}

async function edit(req, res) {
  const data = await service.edit(req.params.reservation_Id, req.body.data);
  res.json({
    data,
  });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasOnlyValidProperties, 
    hasRequiredProperties,
    bookedCheck, 
    asyncErrorBoundary(create)
  ],
  read: [
    asyncErrorBoundary(resieExists),
    asyncErrorBoundary(read)
    ],
  update: [
    asyncErrorBoundary(resieExists),
    hasOnlyValidProperties,
    hasStatusProperties,
    asyncErrorBoundary(update)
  ],
  edit: [
    asyncErrorBoundary(resieExists),
    hasOnlyValidProperties,
    hasRequiredProperties,
    asyncErrorBoundary(edit)
  ]
};
