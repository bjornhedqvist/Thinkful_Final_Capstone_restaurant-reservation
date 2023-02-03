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

async function create(req, res, next){
  data = await service.create(req.body.data)
  res.status(201).json({ data })
}

module.exports = {
  list: [asyncErrorBoundary(list) ],
  create: [hasOnlyValidProperties, hasRequiredProperties,  asyncErrorBoundary(create) ]
};
