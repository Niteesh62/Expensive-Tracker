import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
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

    // Password Validation
    const passwordPattern =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordPattern.test(user.password)) {

      newErrors.password =
        "Password must contain Capital, Small, Number & Special Character";

    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (validateForm()) {

      try {

        const response = await axios.post(
          "http://127.0.0.1:8000/api/accounts/login/",
          user
        );

        console.log(response.data);

        // Store JWT Tokens
        localStorage.setItem(
          "access_token",
          response.data.access
        );

        localStorage.setItem(
          "refresh_token",
          response.data.refresh
        );

        alert("Login Successful ✅");

        setUser({
          username: "",
          password: "",
        });

        navigate("/dashboard");

      } catch (error) {

        console.log(error);

        alert("Invalid Credentials ❌");

      }
    }
  };

  return (

    <div className="login-container">

      <form
        className="login-form"
        onSubmit={handleSubmit}
      >

        <h2>Welcome Back</h2>

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
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;