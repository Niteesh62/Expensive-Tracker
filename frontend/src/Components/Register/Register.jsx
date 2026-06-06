import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (formData.password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters";
    }

    if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
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

    localStorage.setItem(
      "user",
      JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
    );

    alert("Registration Successful");

    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    setErrors({});
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>💰 Expense Tracker</h1>
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            className="register-input"
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />

          {errors.name && (
            <p className="register-error">{errors.name}</p>
          )}

          <input
            className="register-input"
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          {errors.email && (
            <p className="register-error">{errors.email}</p>
          )}

          <input
            className="register-input"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          {errors.password && (
            <p className="register-error">{errors.password}</p>
          )}

          <input
            className="register-input"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          {errors.confirmPassword && (
            <p className="register-error">
              {errors.confirmPassword}
            </p>
          )}

          <button
            className="register-btn"
            type="submit"
          >
            Register
          </button>
        </form>

        <p className="register-link">
          Already have an account?{" "}
          <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;