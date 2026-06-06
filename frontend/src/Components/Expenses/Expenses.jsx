import { useContext, useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { AuthContext } from "../../AuthContext";
import "./Expenses.css";

function Expenses() {
  const { currentUser } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    id: null,
    title: "",
    date: "",
    category: "",
    amount: "",
    type: "expense",
    description: "",
  });

  useEffect(() => {
    if (currentUser) {
      loadExpenses();
    }
  }, [currentUser]);

  const loadExpenses = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get(
        "/accounts/expenses/",
        { params: { user_id: currentUser.id } }
      );
      setExpenses(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to load expenses."
      );
    } finally {
      setLoading(false);
    }
  };

  const totalExpense = expenses
    .filter((item) => item.type === "expense")
    .reduce((total, expense) => total + Number(expense.amount), 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddExpense = () => {
    setFormData({
      id: null,
      title: "",
      date: "",
      category: "",
      amount: "",
      type: "expense",
      description: "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setError("Please login to manage expenses.");
      return;
    }

    try {
      if (formData.id) {
        const response = await axiosInstance.put(
          `/accounts/expenses/${formData.id}/`,
          {
            user: currentUser.id,
            title: formData.title,
            date: formData.date,
            category: formData.category,
            amount: Number(formData.amount),
            type: formData.type,
            description: formData.description,
          }
        );
        setExpenses((prev) =>
          prev.map((expense) =>
            expense.id === formData.id
              ? response.data
              : expense
          )
        );
      } else {
        const response = await axiosInstance.post(
          "/accounts/expenses/",
          {
            user: currentUser.id,
            title: formData.title,
            date: formData.date,
            category: formData.category,
            amount: Number(formData.amount),
            type: formData.type,
            description: formData.description,
          }
        );
        setExpenses((prev) => [response.data, ...prev]);
      }

      setShowForm(false);
      setFormData({
        id: null,
        title: "",
        date: "",
        category: "",
        amount: "",
        type: "expense",
        description: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to save expense."
      );
    }
  };

  const handleEdit = (expense) => {
    setFormData({
      id: expense.id,
      title: expense.title,
      date: expense.date,
      category: expense.category,
      amount: expense.amount,
      type: expense.type,
      description: expense.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this expense?"
    );

    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(
        `/accounts/expenses/${id}/`
      );
      setExpenses((prev) =>
        prev.filter((expense) => expense.id !== id)
      );
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to delete expense."
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
          <h2>₹{totalExpense}</h2>
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
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
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
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
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

      {loading ? (
        <p>Loading expenses...</p>
      ) : (
        <div className="table-container">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.date}</td>
                  <td>{expense.title}</td>
                  <td>{expense.category}</td>
                  <td className="amount">₹{expense.amount}</td>
                  <td>
                    <span
                      className={
                        expense.type === "income"
                          ? "income"
                          : "expense"
                      }
                    >
                      {expense.type}
                    </span>
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(expense)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(expense.id)}
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

export default Expenses;