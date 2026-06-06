import { useState } from "react";
import "./Trips.css";

function Trips() {
  const [trips, setTrips] = useState([
    {
      id: 1,
      destination: "Goa",
      startDate: "2026-06-10",
      endDate: "2026-06-15",
      budget: 15000,
      status: "Active",
    },
    {
      id: 2,
      destination: "Bangalore",
      startDate: "2026-07-05",
      endDate: "2026-07-08",
      budget: 10000,
      status: "Upcoming",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    status: "Upcoming",
  });

  const totalBudget = trips.reduce(
    (sum, trip) => sum + trip.budget,
    0
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTrip = () => {
    setFormData({
      id: null,
      destination: "",
      startDate: "",
      endDate: "",
      budget: "",
      status: "Upcoming",
    });

    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.id) {
      setTrips(
        trips.map((trip) =>
          trip.id === formData.id
            ? {
                ...formData,
                budget: Number(formData.budget),
              }
            : trip
        )
      );
    } else {
      setTrips([
        ...trips,
        {
          ...formData,
          id: Date.now(),
          budget: Number(formData.budget),
        },
      ]);
    }

    setShowForm(false);
  };

  const handleEdit = (trip) => {
    setFormData(trip);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this trip?")) {
      setTrips(
        trips.filter((trip) => trip.id !== id)
      );
    }
  };

  return (
    <div className="trips-container">
      <div className="trips-header">
        <h1>✈️ Trips</h1>

        <button
          className="add-trip-btn"
          onClick={handleAddTrip}
        >
          + Add Trip
        </button>
      </div>

      <div className="trip-cards">
        <div className="trip-card">
          <h3>Total Trips</h3>
          <h2>{trips.length}</h2>
        </div>

        <div className="trip-card">
          <h3>Total Budget</h3>
          <h2>₹{totalBudget}</h2>
        </div>
      </div>

      {showForm && (
        <div className="modal">
          <form
            className="trip-form"
            onSubmit={handleSubmit}
          >
            <h2>
              {formData.id
                ? "Edit Trip"
                : "Add Trip"}
            </h2>

            <input
              type="text"
              name="destination"
              placeholder="Destination"
              value={formData.destination}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="budget"
              placeholder="Budget"
              value={formData.budget}
              onChange={handleChange}
              required
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Upcoming</option>
              <option>Active</option>
              <option>Completed</option>
            </select>

            <div className="form-buttons">
              <button type="submit">
                Save
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="trip-table">
          <thead>
            <tr>
              <th>Destination</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Budget</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {trips.map((trip) => (
              <tr key={trip.id}>
                <td>{trip.destination}</td>
                <td>{trip.startDate}</td>
                <td>{trip.endDate}</td>
                <td>₹{trip.budget}</td>

                <td>
                  <span
                    className={`status ${trip.status.toLowerCase()}`}
                  >
                    {trip.status}
                  </span>
                </td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() =>
                      handleEdit(trip)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(trip.id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Trips;