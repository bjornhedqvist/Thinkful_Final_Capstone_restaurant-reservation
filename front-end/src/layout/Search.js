import { useState } from "react";
import { listReservations } from "../utils/api"
import Reservation from "../dashboard/Reservation";
import formatPhone from "../utils/format-phone-number";
import ErrorAlert from "./ErrorAlert";

export default function Search(){
  const initialFormState = {
    mobile_number: "",
  };

  const [ formData, setFormData ] = useState({ ...initialFormState });
  const [ reservations, setReservations ] = useState([]);
  // eslint-disable-next-line
  const [ errors, setErrors ] = useState([]);

  const handleChange = (event) => {
    formatPhone(event.target);
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const ac = new AbortController();

    const search = { mobile_number: formData.mobile_number };

    setReservations(await listReservations(search, ac.signal))

    return () => ac.abort();
  }
  
  const displayErrors = errors.map(error => {
    return <ErrorAlert key={error} error={error} />
  });

  const reservationsList = reservations.map(resie => {
    return (
      <>
        <Reservation key={resie.reservation_id} reservation={resie} />
        <br />
      </>
    )
  });

  let results = null;

  if(reservations.length){
    results = (
      <div>
        {reservationsList}
      </div>
    )
  } else {
    results = <h5 className="mt-2">No reservations found</h5>
  }

  return (
    <>
      <div className="d-flex flex-column text-center my-3">
        <h2>Search by Mobile Number</h2>
        {errors ? displayErrors : null}
        <div>
          <form className="d-flex" onSubmit={handleSubmit}>
            <input
              required
              type="tel"
              placeholder="Enter Mobile Number"
              onChange={handleChange}
              value={formData.mobile_number}
              className="form-control my-3"
              name="mobile_number"></input>
            <button className="btn btn-primary ml-2 my-3" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
      <div className="col-lg-6 col-md-8 col-12">
        {results}
      </div>
    </>
  )
}