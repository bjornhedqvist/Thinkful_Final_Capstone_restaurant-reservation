const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");

const hasTableProperties = require("../errors/hasTableProperties");
const hasRequiredProperties = hasTableProperties("table_name",
"capacity");

const hasSeatingProperties = require("../errors/hasSeatingProperties")
const hasRequiredSeatingProperties = hasSeatingProperties("reservation_id")

const hasFinishProperties = require("../errors/hasFinishProperties")
const hasReqFinishProperties = hasFinishProperties("table_id")

/**
 * List handler for tables
 */
async function list(req, res) {
  let data = await service.list()
  res.json({ data })
}

// create(POST) handler for new tables
const VALID_PROPERTIES = [
  "table_name",
  "capacity",
  "table_id",
  "reservation_id"
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
  let data = await service.create(req.body.data)
  res.status(201).json({ data })
}

//validates table exists for read table
function tableExists(req, res, next) {
  service
  .read(req.params.tableId)
  .then((table) => {
    if (table) {
      res.locals.table = table;
      return next();
    }
    next({ status: 404, message: `Table ${req.params.tableId} cannot be found.` });
  })
  .catch(next);
}
// read handler for table
async function read(req, res, next){
  const {table: data} = res.locals
  res
  .json({ data })
}

//seating handlers for seating and unseating at a table

async function seat(req, res) {
  const { reservation_id } = req.body.data;
  const { tableId } = req.params;
  console.log(req.params)
  console.log(tableId)
  const data = await service.seat(tableId, reservation_id);
  res.json({
    data,
  });
}

async function unseat(req, res) {
  const { table_id } = req.params;
  const { table } = res.locals;
  const data = await service.unseat(table);
  res.json({
    data,
  });
}

//delete handler for finishing a table
async function destroy(req, res, next){
    service
    .delete(res.locals.table.table_id)
    .then(() => res.sendStatus(204))
    .catch(next)
}

module.exports = {
  list: [asyncErrorBoundary(list) ],
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    asyncErrorBoundary(create) 
  ],
  read: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(read)
  ],
  seat: [
    asyncErrorBoundary(tableExists),
    hasOnlyValidProperties, 
    asyncErrorBoundary(hasRequiredSeatingProperties),
    asyncErrorBoundary(seat)
  ],
  unseat: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(hasRequiredSeatingProperties),
    asyncErrorBoundary(unseat)
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(hasReqFinishProperties),
    destroy
  ]
};
