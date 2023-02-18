import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";
import { updateReservation, readReservation } from "../utils/api";
import formatPhone from "../utils/format-phone-number";
import Form from "../Form";
import ErrorAlert from "../layout/ErrorAlert";
import { formatAsDate } from "../utils/date-time";

export default function EditReservation({ loadDashboard }) {
  const history = useHistory();
  const { reservation_id } = useParams();

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [errors, setErrors] = useState([]);
  
  useEffect(() => {
    const abortController = new AbortController();

    async function loadReservation() {
      const resieToEdit = await readReservation(reservation_id, abortController.signal);
        if(!abortController.signal.aborted){
            setFormData({ ...resieToEdit, reservation_date: formatAsDate(resieToEdit.reservation_date)});
        } 
    }
    loadReservation()
    return () => abortController.abort();
    }, 
    //eslint-disable-next-line
        []
    );

  const validationErrors = [];

  const handleChange = (event) => {
    if (event.target.name === "mobile_number") {
      formatPhone(event.target);
    }
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    setErrors([]);

    let formattedDate = new Date(
      `${formData.reservation_date}T${formData.reservation_time}`
    );

    if (Date.now() > Date.parse(formattedDate)) {
      validationErrors.push({
        message: "reservation must be made for a future date and time.",
      });
    }

    if (formattedDate.toString().slice(0, 3) === "Tue") {
      validationErrors.push({
        message:
          "we're closed on Tuesdays - check our hours for more information!",
      });
    }

    const hours = formattedDate.getHours();
    const minutes = formattedDate.getMinutes();

    if ((hours <= 10 && minutes <= 30) || hours <= 9) {
      validationErrors.push({
        message:
          "we open at 10:30 AM - please fix your reservation accordingly.",
      });
    }

    if ((hours >= 21 && minutes >= 30) || hours >= 22) {
      validationErrors.push({
        message:
          "our last reservations are for 9:30 PM - please fix your reservation accordingly.",
      });
    }

    formData.people = Number(formData.people);

    if (formData.people < 1) {
      validationErrors.push({
        message: "you must have at least one guest.",
      });
    }

    setErrors(validationErrors);
    if (errors.length === 0) {
      await updateReservation(formData, reservation_id, abortController.signal);
    }
    loadDashboard()
    history.push(`/dashboard?date=${formData.reservation_date}`);
    setFormData({ ...initialFormState });
    return () => abortController.abort();
  };

  let errorsElement = errors.map((error) => {
    return <ErrorAlert key={error.message} error={error} />;
  });

  return (
    <>
      <div>
        <h1 className="my-3 text-center">Edit Reservation for {formData.first_name} {formData.last_name}</h1>
        <h5 className="my-3 text-center">Reservation ID: {reservation_id}</h5>
      </div>
      {errorsElement}
      <Form
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
}