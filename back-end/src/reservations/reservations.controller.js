const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  let data = await service.list()

  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list) ,
};
