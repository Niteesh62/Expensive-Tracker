import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Dashboard from "./Components/Dashboard/Dashboard";



function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Default Route */}
        <Route
          path="/"
          element={<Navigate to="/register" />}
        />

        {/* Login Route */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Register Route */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Dashboard Route */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;