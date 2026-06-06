import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../useTheme";
import "./ErrorPages.css";

function ErrorPage403() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div className="error-container" data-theme={isDark ? "dark" : "light"}>
      <div className="error-content">
        <h1 className="error-code">403</h1>
        <h2>Forbidden</h2>
        <p>You don't have permission to access this resource.</p>
        <div className="error-buttons">
          <button
            className="btn-primary"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
          <button className="btn-secondary" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage403;
