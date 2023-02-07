const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");

const hasTableProperties = require("../errors/hasTableProperties");
const hasRequiredProperties = hasTableProperties("table_name",
"capacity");

/**
 * List handler for tables
 */
async function list(req, res) {
  let data = await service.list()
  data = data.sort((a, b) => a.table_name - b.table_name)
  for(let i = 0; i < data.length; i++){
    if(data[0].table_name.includes("Bar")){
      data.push(data.splice(0, 1)[0])
      // data.push(data.splice(i, 1)[0])
    }
  }
  console.log(data)
  res.json({ data })
}

// create(POST) handler for new tables
const VALID_PROPERTIES = [
  "table_name",
  "capacity"
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

module.exports = {
  list: [asyncErrorBoundary(list) ],
  create: [hasOnlyValidProperties, hasRequiredProperties,  asyncErrorBoundary(create) ],
  read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)]
};
