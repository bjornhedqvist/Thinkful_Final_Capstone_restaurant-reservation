import React, { useState, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewReservation from "../reservations/NewReservation"
import useQuery from "../utils/useQuery";
import NewTable from "../tables/NewTable";
import SeatReservation from "../reservations/SeatReservation"
import { listReservations, listTables } from "../utils/api";
import EditReservation from "../reservations/EditReservation"
import Search from "./Search";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  const date = query.get("date") || today();

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
      listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  useEffect(loadDashboard, [date]);

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservation loadDashboard={loadDashboard}/>
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <SeatReservation tables={tables} loadDashboard={loadDashboard}/>
      </Route>
      <Route path="/reservations/:reservation_id/edit">
				<EditReservation loadDashboard={loadDashboard}/>
			</Route>
      <Route path="/dashboard">
        <Dashboard 
          date={ date }
          reservations={reservations}
					reservationsError={reservationsError}
					tables={tables}
					tablesError={tablesError}
          loadDashboard={loadDashboard}
         />
      </Route>
      <Route path="/tables/new">
        <NewTable setTables={setTables}/>
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
