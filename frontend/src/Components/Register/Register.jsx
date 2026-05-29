import React, { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {

    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });

  };

  const validateForm = () => {

    let newErrors = {};

    // Username Validation
    if (user.username.trim() === "") {
      newErrors.username = "Username is required";
    }

    // Email Validation
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(user.email)) {
      newErrors.email = "Enter valid email";
    }

    // Password Validation
    const passwordPattern =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordPattern.test(user.password)) {

      newErrors.password =
        "Password must contain capital, small, number, special character and 8 characters";

    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (validateForm()) {

      try {

        const response = await axios.post(
          "http://127.0.0.1:8000/api/accounts/register/",
          user
        );

        console.log(response.data);

        alert("Registered Successfully ✅");

        setUser({
          username: "",
          email: "",
          password: "",
        });

        navigate("/login");

      } catch (error) {

        console.log(error);

        alert("Registration Failed ❌");

      }
    }
  };

  return (

    <div className="register-container">

      <form
        className="register-form"
        onSubmit={handleSubmit}
      >

        <h2>Create Account</h2>

        <input
          type="text"
          name="username"
          placeholder="Enter Username"
          value={user.username}
          onChange={handleChange}
        />

        {errors.username && (
          <p className="error">
            {errors.username}
          </p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Enter Your Email"
          value={user.email}
          onChange={handleChange}
        />

        {errors.email && (
          <p className="error">
            {errors.email}
          </p>
        )}

        <input
          type="password"
          name="password"
          placeholder="Enter Your Password"
          value={user.password}
          onChange={handleChange}
        />

        {errors.password && (
          <p className="error">
            {errors.password}
          </p>
        )}

        <button type="submit">
          Register
        </button>

        <p className="login-text">
          Already have an account?

          <span onClick={() => navigate("/login")}>
            {" "}
            Login
          </span>

        </p>

      </form>

    </div>
  );
}

export default Register;