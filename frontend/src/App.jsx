import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import MainLayout from "./Components/Layouts/MainLayout";
import Home from "./Components/Home/Home";
import Expenses from "./Components/Expenses/Expenses";
import Trips from "./Components/Trips/Trips";
import Approvals from "./Components/Approvals/Approvals";
import Settings from "./Components/Settings/Settings";
import Support from "./Components/Support/Support";
import ErrorPage401 from "./Components/Errors/ErrorPage401";
import ErrorPage403 from "./Components/Errors/ErrorPage403";
import ErrorPage404 from "./Components/Errors/ErrorPage404";
import { AuthContext } from "./AuthContext";


function ProtectedRoute({ children }) {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<MainLayout />}>
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips"
            element={
              <ProtectedRoute>
                <Trips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/approvals"
            element={
              <ProtectedRoute>
                <Approvals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            }
          />
        </Route>
        {/* Error Pages */}
        <Route path="/401" element={<ErrorPage401 />} />
        <Route path="/403" element={<ErrorPage403 />} />
        <Route path="/404" element={<ErrorPage404 />} />
        <Route path="*" element={<ErrorPage404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;