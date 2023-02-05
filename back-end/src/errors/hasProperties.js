function hasProperties(...properties) {
    return function (req, res, next) {
      const { data = {} } = req.body;
      //regex validatiors for date and time 
      const validDateFormat = /\d{4}-\d{2}-\d{2}/g
      const validTimeFormat = /[0-9]{2}:[0-9]{2}/g
      //validatior for today's date, to prevent reservations from being created in the past
      function getTodaysDate() {
        const todayDate = new Date(Date.now());
        const year = todayDate.getFullYear();
        const month = todayDate.getMonth() + 1;
        const day = todayDate.getDate();
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
      }
  
      try {
        properties.forEach((property) => {
          if (!data[property]) {
            const error = new Error(`A '${property}' property is required.`);
            error.status = 400;
            throw error;
          }
        });
        //validatiors for people, reservation_date, and reservation_time field content
        if(!Number.isInteger(data.people)){
            const error = new Error(`The people field must be a number`)
            error.status = 400
            throw error
          }else if(!validDateFormat.test(data.reservation_date)){
            const error = new Error(`The reservation_date field must be a valid date, ex. 2026-12-30`)
            error.status = 400
            throw error
        }else if(!validTimeFormat.test(data.reservation_time)){
            const error = new Error(`The reservation_time field must be a valid time, ex. 18:00`)
            error.status = 400
            throw error
        }else if(getTodaysDate() > data.reservation_date){
            const error = new Error(`Date must be in the future`)
            error.status = 400
            throw error
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }
  
  module.exports = hasProperties;