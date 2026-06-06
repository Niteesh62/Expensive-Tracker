import { useState } from "react";
import "./Support.css";

function Support() {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      name: "Niteesh",
      email: "niteesh@gmail.com",
      category: "Expense Issue",
      priority: "High",
      message: "Expense amount calculation is incorrect.",
      status: "Open",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    priority: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTicket = {
      id: Date.now(),
      ...formData,
      status: "Open",
    };

    setTickets([...tickets, newTicket]);

    setFormData({
      name: "",
      email: "",
      category: "",
      priority: "",
      message: "",
    });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Delete this ticket?"
    );

    if (confirmDelete) {
      setTickets(
        tickets.filter(
          (ticket) => ticket.id !== id
        )
      );
    }
  };

  const updateStatus = (id, status) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === id
          ? { ...ticket, status }
          : ticket
      )
    );
  };

  const openCount = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  return (
    <div className="support-container">
      <div className="support-header">
        <h1>🎧 Support Center</h1>
        <p>
          Create and manage support tickets
        </p>
      </div>

      <div className="support-cards">
        <div className="card">
          <h3>Total Tickets</h3>
          <h2>{tickets.length}</h2>
        </div>

        <div className="card">
          <h3>Open Tickets</h3>
          <h2>{openCount}</h2>
        </div>

        <div className="card">
          <h3>Resolved</h3>
          <h2>{resolvedCount}</h2>
        </div>
      </div>

      <div className="support-form-card">
        <h2>Create Ticket</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Category
            </option>
            <option>
              Expense Issue
            </option>
            <option>
              Payment Issue
            </option>
            <option>
              Login Issue
            </option>
            <option>
              Report Issue
            </option>
          </select>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Priority
            </option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <textarea
            name="message"
            placeholder="Describe your issue..."
            value={formData.message}
            onChange={handleChange}
            rows="5"
            required
          ></textarea>

          <button type="submit">
            Submit Ticket
          </button>
        </form>
      </div>

      <div className="tickets-section">
        <h2>Support Tickets</h2>

        <table className="ticket-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.name}</td>

                <td>{ticket.category}</td>

                <td>
                  <span
                    className={`priority ${ticket.priority.toLowerCase()}`}
                  >
                    {ticket.priority}
                  </span>
                </td>

                <td>
                  <span
                    className={`status ${ticket.status.toLowerCase().replace(
                      " ",
                      "-"
                    )}`}
                  >
                    {ticket.status}
                  </span>
                </td>

                <td>
                  <button
                    className="progress-btn"
                    onClick={() =>
                      updateStatus(
                        ticket.id,
                        "In Progress"
                      )
                    }
                  >
                    Progress
                  </button>

                  <button
                    className="resolve-btn"
                    onClick={() =>
                      updateStatus(
                        ticket.id,
                        "Resolved"
                      )
                    }
                  >
                    Resolve
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(ticket.id)
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

export default Support;