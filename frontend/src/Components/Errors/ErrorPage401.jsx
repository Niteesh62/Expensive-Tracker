import React from "react";
import { useNavigate } from "react-router-dom";

import "./ErrorPages.css";
import { useTheme } from "../../useTheme";

function ErrorPage401() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div className="error-container" data-theme={isDark ? "dark" : "light"}>
      <div className="error-content">
        <h1 className="error-code">401</h1>
        <h2>Unauthorized</h2>
        <p>You need to be authenticated to access this page.</p>
        <div className="error-buttons">
          <button className="btn-primary" onClick={() => navigate("/login")}>
            Go to Login
          </button>
          <button className="btn-secondary" onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage401;
