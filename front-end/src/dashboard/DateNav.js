import { Link } from "react-router-dom";
import { previous, next, today } from "../utils/date-time";

export default function DateNav({ date }) {
  return (
    <div className="btn-group" role="group">
      <Link
        type="button"
        className="btn btn-outline-secondary shadow-sm"
        to={(location) => {
          return `${location.pathname}?date=${previous(date)}`;
        }}
      >
        Previous
      </Link>
      <Link
        type="button"
        className="btn btn-outline-info shadow-sm"
        to={(location) => {
          return `${location.pathname}?date=${today()}`;
        }}
      >
        Today
      </Link>
      <Link
        type="button"
        className="btn btn-outline-secondary shadow-sm"
        to={(location) => {
          return `${location.pathname}?date=${next(date)}`;
        }}
      >
        Next
      </Link>
    </div>
  );
}