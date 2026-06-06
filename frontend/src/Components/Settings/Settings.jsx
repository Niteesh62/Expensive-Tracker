import { useContext, useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { AuthContext } from "../../AuthContext";
import { ThemeContext } from "../../ThemeContext";
import "./Settings.css";

function Settings() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  const [settings, setSettings] = useState({
    name: "",
    email: "",
    currency: "₹",
    notifications: true,
    monthlyBudget: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) {
      setSettings({
        name: currentUser.name || "",
        email: currentUser.email || "",
        currency: currentUser.currency || "₹",
        notifications:
          currentUser.notifications ?? true,
        monthlyBudget:
          currentUser.monthly_budget || 0,
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings({
      ...settings,
      [name]:
        type === "checkbox" ? checked : value,
    });
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleSave = async () => {
    if (!currentUser) {
      setError("Please login to save settings.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.put(
        `/accounts/users/${currentUser.id}/`,
        {
          name: settings.name,
          email: settings.email,
          currency: settings.currency,
          notifications: settings.notifications,
          monthly_budget: settings.monthlyBudget,
        }
      );
      setCurrentUser(response.data);
      setSettings((prev) => ({
        ...prev,
        name: response.data.name,
        email: response.data.email,
        currency: response.data.currency,
        notifications: response.data.notifications,
        monthlyBudget: response.data.monthly_budget,
      }));
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to save settings."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
        <p>
          Manage your Expense Tracker preferences
        </p>
      </div>

      <div className="settings-card">
        <h2>Profile Settings</h2>

        <div className="form-group">
          <label>Full Name</label>

          <input
            type="text"
            name="fullName"
            value={settings.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={settings.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="settings-card">
        <h2>Application Settings</h2>

        {error && <p className="error-text">{error}</p>}

        <div className="form-group">
          <label>Currency</label>

          <select
            name="currency"
            value={settings.currency}
            onChange={handleChange}
          >
            <option value="₹">INR (₹)</option>
            <option value="$">USD ($)</option>
            <option value="€">EUR (€)</option>
            <option value="£">GBP (£)</option>
          </select>
        </div>

        <div className="toggle-row">
          <label>Dark Mode</label>

          <label className="switch">
            <input
              type="checkbox"
              checked={isDark}
              onChange={handleThemeToggle}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="toggle-row">
          <label>Notifications</label>

          <label className="switch">
            <input
              type="checkbox"
              name="notifications"
              checked={settings.notifications}
              onChange={handleChange}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="form-group">
          <label>Monthly Budget</label>

          <input
            type="number"
            name="monthlyBudget"
            value={settings.monthlyBudget}
            onChange={handleChange}
          />
        </div>
      </div>

      <button
        className="save-btn"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}

export default Settings;