import { useContext, useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { AuthContext } from "../../AuthContext";
import "./Home.css";

function Home() {
  const { currentUser } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    amount: "",
    type: "expense",
    date: "",
  });

  useEffect(() => {
    if (currentUser) {
      fetchTransactions();
    }
  }, [currentUser]);

  const fetchTransactions = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get(
        "/accounts/expenses/",
        { params: { user_id: currentUser.id } }
      );
      setTransactions(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to load transactions."
      );
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalBalance = totalIncome - totalExpenses;

  const savings = totalBalance;

  const categoryTotals = {};

  transactions
    .filter((item) => item.type === "expense")
    .forEach((item) => {
      categoryTotals[item.category] =
        (categoryTotals[item.category] || 0) +
        item.amount;
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setError("Please login to add a transaction.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/accounts/expenses/",
        {
          user: currentUser.id,
          title: formData.title,
          category: formData.category,
          amount: Number(formData.amount),
          type: formData.type,
          date:
            formData.date ||
            new Date().toISOString().split("T")[0],
          description: "",
        }
      );

      setTransactions([response.data, ...transactions]);
      setFormData({
        title: "",
        category: "",
        amount: "",
        type: "expense",
        date: "",
      });
      setShowModal(false);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to add transaction."
      );
    }
  };

  return (
    <div className="home">
      <div className="dashboard-header">
        <div>
          <h1>Expense Dashboard</h1>
          <p>
            Track and manage your finances
            efficiently.
          </p>
        </div>

        <button
          className="add-btn"
          onClick={() => setShowModal(true)}
        >
          + Add Transaction
        </button>
      </div>

      <div className="stats-grid">
        <div className="card">
          <h4>Total Balance</h4>
          <h2>₹{totalBalance}</h2>
        </div>

        <div className="card">
          <h4>Total Income</h4>
          <h2>₹{totalIncome}</h2>
        </div>

        <div className="card">
          <h4>Total Expenses</h4>
          <h2>₹{totalExpenses}</h2>
        </div>

        <div className="card">
          <h4>Savings</h4>
          <h2>₹{savings}</h2>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <div className="dashboard-content">
          <div className="transactions">
            <h3>Recent Transactions</h3>

            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td>
                      <span
                        className={
                          item.type === "income"
                            ? "income"
                            : "expense"
                        }
                      >
                        {item.type}
                      </span>
                    </td>
                    <td>₹{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="categories">
            <h3>Top Categories</h3>

            {Object.entries(categoryTotals).length === 0 ? (
              <p>No expense categories yet.</p>
            ) : (
              Object.entries(categoryTotals).map(
                ([category, amount]) => (
                  <div
                    className="category-item"
                    key={category}
                  >
                    <span>{category}</span>
                    <span>₹{amount}</span>
                  </div>
                )
              )
            )}
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <form
            className="transaction-form"
            onSubmit={handleSubmit}
          >
            <h2>Add Transaction</h2>

            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="expense">
                Expense
              </option>
              <option value="income">
                Income
              </option>
            </select>

            <div className="form-buttons">
              <button type="submit">
                Save
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Home;