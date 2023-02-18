function hasTableProperties(...properties) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    //proerties validator and table_name length validator, capacity is a number validator
    try {
      properties.forEach((property) => {
        if (!data[property]) {
          const error = new Error(`A '${property}' property is required.`);
          error.status = 400;
          throw error;
        }
      });
      if (data.table_name && data.table_name.length <= 1) {
        const error = new Error(
          `Table name: '${data.table_name}' is invalid, table_name must be more than one character.`
          );
          error.status = 400;
          throw error;
        } 
      if (typeof data.capacity != "number" || data.capacity == undefined || data.capacity < 1) {
        const error = new Error(
          `Capacity input: '${data.capacity}' is invalid, capacity must be a number greater than 1.`
          );
          error.status = 400;
          throw error;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = hasTableProperties;
