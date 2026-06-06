import React from "react";
import { useTheme } from "../../useTheme";
import "./ErrorBoundary.css";

class ErrorBoundaryClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundaryDisplay
          error={this.state.error}
          resetError={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}

function ErrorBoundaryDisplay({ error, resetError }) {
  const { isDark } = useTheme();

  return (
    <div
      className="error-boundary-container"
      data-theme={isDark ? "dark" : "light"}
    >
      <div className="error-boundary-content">
        <h1>⚠️ Oops! Something went wrong</h1>
        <p className="error-message">
          {error?.message || "An unexpected error occurred"}
        </p>
        <button onClick={resetError} className="reset-btn">
          Try Again
        </button>
      </div>
    </div>
  );
}

export default ErrorBoundaryClass;
