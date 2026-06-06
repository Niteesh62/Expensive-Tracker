import { useState } from "react";
import "./Home.css";

function Home() {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      title: "Groceries",
      category: "Food",
      amount: 2500,
      type: "expense",
    },
    {
      id: 2,
      title: "Movie",
      category: "Entertainment",
      amount: 800,
      type: "expense",
    },
    {
      id: 3,
      title: "Fuel",
      category: "Transport",
      amount: 1500,
      type: "expense",
    },
    {
      id: 4,
      title: "Salary",
      category: "Income",
      amount: 120000,
      type: "income",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    amount: "",
    type: "expense",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTransaction = {
      id: Date.now(),
      ...formData,
      amount: Number(formData.amount),
    };

    setTransactions([
      ...transactions,
      newTransaction,
    ]);

    setFormData({
      title: "",
      category: "",
      amount: "",
      type: "expense",
    });

    setShowModal(false);
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

          {Object.entries(categoryTotals).map(
            ([category, amount]) => (
              <div
                className="category-item"
                key={category}
              >
                <span>{category}</span>
                <span>₹{amount}</span>
              </div>
            )
          )}
        </div>
      </div>

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