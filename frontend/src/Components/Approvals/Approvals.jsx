import { useState } from "react";
import "./Approvals.css";

function Approvals() {
  const [approvals, setApprovals] = useState([
    {
      id: 1,
      employee: "Niteesh",
      category: "Travel",
      amount: 5000,
      date: "2026-06-01",
      status: "Pending",
    },
    {
      id: 2,
      employee: "Rahul",
      category: "Food",
      amount: 1200,
      date: "2026-06-02",
      status: "Approved",
    },
    {
      id: 3,
      employee: "Arjun",
      category: "Shopping",
      amount: 3000,
      date: "2026-06-03",
      status: "Rejected",
    },
  ]);

  const [search, setSearch] = useState("");

  const approveExpense = (id) => {
    setApprovals(
      approvals.map((item) =>
        item.id === id
          ? { ...item, status: "Approved" }
          : item
      )
    );
  };

  const rejectExpense = (id) => {
    setApprovals(
      approvals.map((item) =>
        item.id === id
          ? { ...item, status: "Rejected" }
          : item
      )
    );
  };

  const filteredData = approvals.filter(
    (item) =>
      item.employee
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.category
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const pendingCount = approvals.filter(
    (item) => item.status === "Pending"
  ).length;

  const approvedCount = approvals.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejectedCount = approvals.filter(
    (item) => item.status === "Rejected"
  ).length;

  return (
    <div className="approvals-container">
      <div className="approvals-header">
        <h1>✅ Expense Approvals</h1>

        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      <div className="approval-cards">
        <div className="approval-card">
          <h3>Pending</h3>
          <h2>{pendingCount}</h2>
        </div>

        <div className="approval-card">
          <h3>Approved</h3>
          <h2>{approvedCount}</h2>
        </div>

        <div className="approval-card">
          <h3>Rejected</h3>
          <h2>{rejectedCount}</h2>
        </div>
      </div>

      <div className="table-container">
        <table className="approval-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.employee}</td>
                <td>{item.category}</td>
                <td>₹{item.amount}</td>
                <td>{item.date}</td>

                <td>
                  <span
                    className={`status ${item.status.toLowerCase()}`}
                  >
                    {item.status}
                  </span>
                </td>

                <td>
                  {item.status === "Pending" && (
                    <>
                      <button
                        className="approve-btn"
                        onClick={() =>
                          approveExpense(item.id)
                        }
                      >
                        Approve
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() =>
                          rejectExpense(item.id)
                        }
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {item.status !== "Pending" && (
                    <span className="completed-text">
                      Completed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Approvals;