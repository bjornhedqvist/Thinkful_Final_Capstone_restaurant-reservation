import { cancelReservation } from "../utils/api";

export default function Reservation({ reservation, loadDashboard }) {
  const {
    reservation_id,
    first_name,
    last_name,
    reservation_time,
    people,
    mobile_number,
    status,
  } = reservation;

  function handleClick() {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();

      cancelReservation(reservation_id, abortController.signal)
        .then(loadDashboard)
        .catch((error) => console.log("error", error));
      return () => abortController.abort();
    }
  }

  const statusElement =
    status === "booked" ? (
      <div style={{ cursor: "default" }} className="btn btn-outline-success">
        Booked
      </div>
    ) : status === "seated" ? (
      <div style={{ cursor: "default" }} className="btn btn-outline-warning">
        Seated
      </div>
    ) : status === "cancelled" ? (
      <div style={{ cursor: "default" }} className="btn btn-outline-danger">
        Cancelled
      </div>
    ) : (
      <div style={{ cursor: "default" }} className="btn btn-secondary">
        Finished
      </div>
    );

  return (
    <div className="card my-3">
      <h6 className="card-header d-flex justify-content-between">
        <div>
          {first_name} {last_name}
        </div>
        <div className="text-muted d-flex justify-content-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-clock align-self-center mr-2"
            style={{ marginTop: "1px" }}
            viewBox="0 0 16 16"
          >
            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
          </svg>
          {reservation_time}
        </div>
      </h6>
      <div className="card-body">
        <div className="container">
          <div className="d-flex justify-content-between">
            <p className="card-text">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-telephone align-self-center mr-2"
                style={{ marginBottom: "1px" }}
                viewBox="0 0 16 16"
              >
                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
              </svg>
              {mobile_number}
            </p>
            <p className="card-text">People: {people}</p>
          </div>
          <div className="d-flex justify-content-between">
            <div
              data-reservation-id-status={reservation.reservation_id}
              className="card-text"
            >
              {statusElement}
            </div>

            <div className="card-text">
              <a href={`/reservations/${reservation_id}/edit`}>
                <button className="btn btn-warning mr-2">Edit</button>
              </a>
              <button
                className="btn btn-danger"
                data-reservation-id-cancel={reservation.reservation_id}
                onClick={handleClick}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      {status === "booked" && (
        <a
          href={`/reservations/${reservation_id}/seat`}
          role="button"
          className="card-footer bg-primary text-decoration-none text-white text-center"
        >
          <h5>Seat</h5>
        </a>
      )}
    </div>
  );
}