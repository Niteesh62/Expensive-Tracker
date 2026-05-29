import React from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  // Create Navigate
  const navigate = useNavigate();

  // Logout Function
  const handleLogout = () => {

    alert("Logout Successful ✅");

    navigate("/dashboard");
  };

  return (
    <div className="dashboard-container">

      {/* Sidebar */}

      <div className="sidebar">
        <h2 className="logo">MyApp</h2>

        <ul>
          <li onClick={() => navigate("/dashboard")}>
            🏠 Home
          </li>

          <li onClick={() => navigate("/analytics")}>
            📊 Analytics
          </li>

          <li onClick={() => navigate("/payments")}>
            💰 Payments
          </li>

          <li onClick={() => navigate("/projects")}>
            📁 Projects
          </li>

          <li onClick={() => navigate("/settings")}>
            ⚙ Settings
          </li>

          <li onClick={handleLogout}>
            🚪 Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}

      <div className="main-content">

        <div className="topbar">
          <h1>Dashboard</h1>

          <input
            type="text"
            placeholder="Search..."
          />
        </div>

        {/* Cards */}

        <div className="cards">

          <div className="card">
            <h2>120+</h2>
            <p>Total Users</p>
          </div>

          <div className="card">
            <h2>85%</h2>
            <p>Performance</p>
          </div>

          <div className="card">
            <h2>$4,500</h2>
            <p>Revenue</p>
          </div>

          <div className="card">
            <h2>25</h2>
            <p>Projects</p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;