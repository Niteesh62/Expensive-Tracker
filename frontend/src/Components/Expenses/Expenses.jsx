import { useState } from "react";
import "./Expenses.css";

function Expenses() {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      date: "2026-06-01",
      category: "Food",
      payment: "UPI",
      amount: 120,
    },
    {
      id: 2,
      date: "2026-06-02",
      category: "Travel",
      payment: "Card",
      amount: 500,
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    date: "",
    category: "",
    payment: "",
    amount: "",
  });

  const totalExpense = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddExpense = () => {
    setFormData({
      id: null,
      date: "",
      category: "",
      payment: "",
      amount: "",
    });

    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.id) {
      setExpenses(
        expenses.map((expense) =>
          expense.id === formData.id
            ? {
                ...formData,
                amount: Number(formData.amount),
              }
            : expense
        )
      );
    } else {
      setExpenses([
        ...expenses,
        {
          ...formData,
          id: Date.now(),
          amount: Number(formData.amount),
        },
      ]);
    }

    setShowForm(false);
  };

  const handleEdit = (expense) => {
    setFormData(expense);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Delete this expense?"
    );

    if (confirmDelete) {
      setExpenses(
        expenses.filter(
          (expense) => expense.id !== id
        )
      );
    }
  };

  return (
    <div className="expenses-container">
      <div className="expenses-header">
        <h1>💰 Expenses</h1>

        <button
          className="add-btn"
          onClick={handleAddExpense}
        >
          + Add Expense
        </button>
      </div>

      <div className="summary-cards">
        <div className="card">
          <h3>Total Expenses</h3>
          <h2>${totalExpense}</h2>
        </div>

        <div className="card">
          <h3>Total Transactions</h3>
          <h2>{expenses.length}</h2>
        </div>
      </div>

      {showForm && (
        <div className="modal">
          <form
            className="expense-form"
            onSubmit={handleSubmit}
          >
            <h2>
              {formData.id
                ? "Edit Expense"
                : "Add Expense"}
            </h2>

            <input
              type="date"
              name="date"
              value={formData.date}
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
              <option>Food</option>
              <option>Travel</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Entertainment</option>
            </select>

            <select
              name="payment"
              value={formData.payment}
              onChange={handleChange}
              required
            >
              <option value="">
                Payment Method
              </option>
              <option>UPI</option>
              <option>Cash</option>
              <option>Card</option>
            </select>

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />

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
        <table className="expense-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Payment</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.date}</td>

                <td>
                  <span
                    className={`badge ${expense.category.toLowerCase()}`}
                  >
                    {expense.category}
                  </span>
                </td>

                <td>{expense.payment}</td>

                <td className="amount">
                  ${expense.amount}
                </td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() =>
                      handleEdit(expense)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(expense.id)
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

export default Expenses;