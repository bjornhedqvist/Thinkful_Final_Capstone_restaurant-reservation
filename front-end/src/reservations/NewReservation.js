import { useHistory } from "react-router-dom";
import { useState } from "react";
import { createReservation } from "../utils/api";
import FormatPhoneNum from "../utils/format-phone-number"
import Form from "../Form"
import ErrorAlert from "../layout/ErrorAlert";

export default function NewReservation(){
    const history = useHistory()

    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
    }
    const [formData, setFormData] = useState({ ...initialFormState })
    const [formErrors, setFormErrors] = useState([])

    const handleChange = ({ target }) => {
        if(target.name === "mobile_number") FormatPhoneNum(target);
        setFormData({
            ...formData,
            [target.name]: target.value,
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        setFormErrors([]);
        const reservationDate = new Date(
          `${formData.reservation_date}T${formData.reservation_time}:00`
        );
    
        const [hours, minutes] = formData.reservation_time.split(":");
        const errors = [];
    
        if (!event.target.checkValidity())
          event.target.classList.add("was-validated");
    
        if (Date.now() > Date.parse(reservationDate)) {
          errors.push({
            message: `Reservation must be for a future date or time.`,
          });
        }
    
        if (reservationDate.getDay() === 2) {
          errors.push({
            message: `We are closed on Tuesdays. Please choose another day.`,
          });
        }
    
        if ((hours <= 10 && minutes < 30) || hours <= 9) {
          errors.push({
            message: `We open at 10:30 AM.`,
          });
        }
    
        if ((hours >= 21 && minutes > 30) || hours >= 22) {
          errors.push({
            message: `We stop accepting reservations at 9:30 PM.`,
          });
        }
    
        formData.people = Number(formData.people);
    
        if (formData.people < 1) {
          errors.push({
            message: `Bookings must have a minumum of 1 guest`,
          });
        }
    
        setFormErrors(errors);
    
        !errors.length &&
          createReservation(formData, abortController.signal)
            .then((_) => {
              history.push(`/dashboard?date=${formData.reservation_date}`);
            })
            .catch((e) => console.log(e));
    
        return () => abortController.abort();
      };

    let displayErrors = formErrors.map((error)=>(
        <ErrorAlert key={error.message} error={error} />
    ))

    return (
        <>
          <div className="text-center my-4">
            <h1>Create New Booking</h1>
          </div>
          {displayErrors}
          <Form
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </>
      )
}