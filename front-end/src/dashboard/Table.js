import { unseatTable } from "../utils/api";

export default function Table({ table, loadDashboard }) {
  function clickHandler() {
    if (window.confirm("Is this table ready to seat new guests?")) {
      const abortController = new AbortController();
      unseatTable(table.table_id, abortController.signal)
        .then(loadDashboard)
        .catch((error) => console.log("error", error));
      return () => abortController.abort();
    }
  }

  return (
    <div className="card my-3">
      <h6 className="card-header">Table Name: {table.table_name}</h6>
      <div className="card-body d-flex">
        <h6 className="col card-title justify-content-center">
          Capacity: {table.capacity}
        </h6>
        {table.reservation_id ? (
          <>
            <div
              className="col btn btn-warning"
              data-table-id-status={table.table_id}
              style={{ cursor: "default" }}
            >
              Occupied
            </div>
          </>
        ) : (
          <div
            className="col btn btn-success"
            data-table-id-status={table.table_id}
            style={{ cursor: "default" }}
          >
            Free
          </div>
        )}
      </div>
      {table.reservation_id ? (
        <div
          data-table-id-finish={table.table_id}
          onClick={clickHandler}
          role="button"
          className="card-footer bg-primary text-decoration-none text-white text-center"
        >
          <h5>Finish</h5>
        </div>
      ) : null}
    </div>
  );
}