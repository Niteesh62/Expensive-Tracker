import { useState, useContext } from "react";
import { ThemeContext } from "../../ThemeContext";
import "./Settings.css";

function Settings() {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  const [settings, setSettings] = useState({
    fullName: "Niteesh Ravi",
    email: "niteesh@example.com",
    currency: "₹",
    notifications: true,
    monthlyBudget: 50000,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings({
      ...settings,
      [name]:
        type === "checkbox" ? checked : value,
    });
  };

  const handleThemeToggle = (e) => {
    toggleTheme();
  };

  const handleSave = () => {
    alert("Settings Saved Successfully!");
    console.log(settings);
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

        <div className="form-group">
          <label>Currency</label>

          <select
            name="currency"
            value={settings.currency}
            onChange={handleChange}
          >
            <option value="₹">
              INR (₹)
            </option>
            <option value="$">
              USD ($)
            </option>
            <option value="€">
              EUR (€)
            </option>
            <option value="£">
              GBP (£)
            </option>
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
      >
        Save Settings
      </button>
    </div>
  );
}

export default Settings;