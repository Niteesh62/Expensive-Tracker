import { useContext, useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { AuthContext } from "../../AuthContext";
import "./Trips.css";

function Trips() {
  const { currentUser } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    id: null,
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    status: "Upcoming",
  });

  const totalBudget = trips.reduce(
    (sum, trip) => sum + Number(trip.budget),
    0
  );

  useEffect(() => {
    if (currentUser) {
      loadTrips();
    }
  }, [currentUser]);

  const loadTrips = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get(
        "/accounts/trips/",
        { params: { user_id: currentUser.id } }
      );
      setTrips(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to load trips."
      );
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setError("Please login to manage trips.");
      return;
    }

    try {
      if (formData.id) {
        const response = await axiosInstance.put(
          `/accounts/trips/${formData.id}/`,
          {
            user: currentUser.id,
            destination: formData.destination,
            start_date: formData.startDate,
            end_date: formData.endDate,
            budget: Number(formData.budget),
            status: formData.status,
          }
        );
        setTrips((prev) =>
          prev.map((trip) =>
            trip.id === formData.id
              ? response.data
              : trip
          )
        );
      } else {
        const response = await axiosInstance.post(
          "/accounts/trips/",
          {
            user: currentUser.id,
            destination: formData.destination,
            start_date: formData.startDate,
            end_date: formData.endDate,
            budget: Number(formData.budget),
            status: formData.status,
          }
        );
        setTrips((prev) => [response.data, ...prev]);
      }

      setShowForm(false);
      setFormData({
        id: null,
        destination: "",
        startDate: "",
        endDate: "",
        budget: "",
        status: "Upcoming",
      });
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to save trip."
      );
    }
  };

  const handleEdit = (trip) => {
    setFormData({
      id: trip.id,
      destination: trip.destination,
      startDate: trip.start_date,
      endDate: trip.end_date,
      budget: trip.budget,
      status: trip.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this trip?")) return;

    try {
      await axiosInstance.delete(`/accounts/trips/${id}/`);
      setTrips((prev) =>
        prev.filter((trip) => trip.id !== id)
      );
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to delete trip."
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
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p>Loading trips...</p>
      ) : (
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
                  <td>{trip.start_date || trip.startDate}</td>
                  <td>{trip.end_date || trip.endDate}</td>
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
                      onClick={() => handleEdit(trip)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(trip.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Trips;