import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../useTheme";
import "./ErrorPages.css";

function ErrorPage404() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div className="error-container" data-theme={isDark ? "dark" : "light"}>
      <div className="error-content">
        <h1 className="error-code">404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div className="error-buttons">
          <button className="btn-primary" onClick={() => navigate("/")}>
            Go Home
          </button>
          <button className="btn-secondary" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage404;
