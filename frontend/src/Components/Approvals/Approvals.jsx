import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import "./Approvals.css";

function Approvals() {
  const [approvals, setApprovals] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadApprovals();
  }, []);

  const loadApprovals = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get(
        "/accounts/approvals/"
      );
      setApprovals(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to load approvals."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const current = approvals.find(
        (item) => item.id === id
      );
      if (!current) return;

      const response = await axiosInstance.put(
        `/accounts/approvals/${id}/`,
        {
          ...current,
          status,
        }
      );
      setApprovals((prev) =>
        prev.map((item) =>
          item.id === id ? response.data : item
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to update approval."
      );
    }
  };

  const approveExpense = (id) => updateStatus(id, "Approved");
  const rejectExpense = (id) => updateStatus(id, "Rejected");

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

      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading approvals...</p>
      ) : (
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
      )}
    </div>
  );
}

export default Approvals;