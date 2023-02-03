const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

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
  console.log(data)
  res.json({ data })
}

module.exports = {
  list: [asyncErrorBoundary(list) ],
};
