function hasProperties(...properties) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    //regex validatiors for date and time
    const validDateFormat = /\d{4}-\d{2}-\d{2}/g;
    const validTimeFormat = /[0-9]{2}:[0-9]{2}/g;
    //validatior for today's date, to prevent reservations from being created in the past
    function getTodaysDate() {
      const todayDate = new Date(Date.now());
      const year = todayDate.getFullYear();
      const month = todayDate.getMonth() + 1;
      const day = todayDate.getDate();
      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    }
    //setup for getting the day of the week for tuesday validator
    const weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const newResieDateCheck = new Date(data.reservation_date);
    let resieWeekdayChecked = weekday[newResieDateCheck.getDay() + 1];

    //setup for reservation availability validator
    let resieHour;
    let resieMin;
    function setResieTime() {
      if (data) {
        if (data.reservation_time) {
          resieHour = data.reservation_time.slice(0, 2);
          resieMin = data.reservation_time.slice(3, 5);
        }
      }
    }
    setResieTime();

    const currentDate = new Date();
    let currentTime = currentDate.getHours() + ":" + currentDate.getMinutes();
    const currentTimeHour = currentTime.slice(0, 1);
    const currentTimeMin = currentTime.slice(2, 4);

    const reservationDate = new Date(
      `${data.reservation_date}T${data.reservation_time}`
    );

    const date = new Date(data.reservation_date)

    console.log(data.reservation_date);
    console.log(date)
    console.log(date == "Invalid Date")
    console.log(currentDate)
    console.log(date=="Invalid Date" || date.valueOf() < currentDate.valueOf() && date.toUTCString().slice(0, 16) !== currentDate.toUTCString().slice(0, 16)
	||
    resieWeekdayChecked === "Tuesday");
    //date=="Invalid Date"

    try {
      properties.forEach((property) => {
        if (!data[property]) {
          const error = new Error(`A '${property}' property is required.`);
          error.status = 400;
          throw error;
        }
      });
      //validatiors for people, reservation_date, and reservation_time field content
      //validatiors for date in past, and tuesday
      //validator for reservation time availibility, i.e. pre-closing, -post-opening, not in past time of current day
      if (!Number.isInteger(data.people)) {
        const error = new Error(`The people field must be a number`);
        error.status = 400;
        throw error;
      } else if (!validDateFormat.test(data.reservation_date)) {
        const error = new Error(
          `The reservation_date field must be a valid date, ex. 2026-12-30`
        );
        error.status = 400;
        throw error;
      } else if (!validTimeFormat.test(data.reservation_time)) {
        const error = new Error(
          `The reservation_time field must be a valid time, ex. 18:00`
        );
        error.status = 400;
        throw error;
      } else if (date=="Invalid Date" 
          || date.valueOf() < currentDate.valueOf() && date.toUTCString().slice(0, 16) !== currentDate.toUTCString().slice(0, 16)
          || resieWeekdayChecked === "Tuesday"
      ) {
        const error = new Error(
          `Reservation date must be in the future, and not on a day we are closed (Tuesdays)`
        );
        error.status = 400;
        throw error;
      } else if (
        data.reservation_date !== getTodaysDate() &&
        resieHour <= "10"
      ) {
        if (resieMin <= "30") {
          const error = new Error(
            `Reservation time must be AFTER 10:30 and before 21:30, and must be after the present time today`
          );
          error.status = 400;
          throw error;
        }
      } else if (
        data.reservation_date !== getTodaysDate() &&
        resieHour >= "21"
      ) {
        if (resieMin >= "30") {
          const error = new Error(
            `Reservation time must be after 10:30 and BEFORE 21:30, and must be after the present time today`
          );
          error.status = 400;
          throw error;
        }
      } else if (
        data.reservation_date === getTodaysDate() &&
        resieHour >= currentTimeHour
      ) {
        if (resieMin >= currentTimeMin) {
          const error = new Error(
            `Reservation time must be after 10:30 and before 21:30, and must be AFTER the present time today`
          );
          error.status = 400;
          throw error;
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = hasProperties;
