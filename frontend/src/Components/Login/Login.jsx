import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      setLoginError("No account found. Please register first.");
      return;
    }

    if (
      formData.email !== user.email ||
      formData.password !== user.password
    ) {
      setLoginError("Invalid email or password.");
      return;
    }

    setErrors({});
    setLoginError("");

    alert("Login Successful");
    navigate("/home");

  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>💰 Expense Tracker</h1>
        <h2>Login</h2>

        {loginError && (
          <p className="login-error">{loginError}</p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
          />

          {errors.email && (
            <p className="login-error">{errors.email}</p>
          )}

          <input
            className="login-input"
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
          />

          {errors.password && (
            <p className="login-error">{errors.password}</p>
          )}

          <button className="login-btn" type="submit">
            Login
          </button>
        </form>

        <p className="login-link">
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;