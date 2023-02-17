import React from "react";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "./Reservation";
import Table from "./Table";
import DateNav from "./DateNav";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, reservations, reservationsError, tables, tablesError, loadDashboard }) {

  const reservationList = reservations.map((reservation) => (
    <Reservation
      loadDashboard={loadDashboard}
      key={reservation.reservation_id}
      reservation={reservation}
    />
  ));

  const tableList = tables.map((table) => (
    <Table loadDashboard={loadDashboard} key={table.table_id} table={table} />
  ));
  
  return (
    <main>
    <div className="text-center my-4">
      <h1>Dashboard</h1>
      <DateNav date={date} />
    </div>
    <ErrorAlert error={reservationsError} />
    <ErrorAlert error={tablesError} />
    <div className="container">
      <div className="row">
        <div className="col col-sm">
          <h4 className="mb-3 text-center">Reservations for: {date}</h4>
          {reservationList}
        </div>
        <div className="col col-sm">
          <h4 className="mb-3 text-center">Tables:</h4>
          {tableList}
        </div>
      </div>
    </div>
  </main>
);
}

export default Dashboard;
