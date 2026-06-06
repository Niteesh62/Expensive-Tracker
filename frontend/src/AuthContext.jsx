import { createContext, useEffect, useState } from "react";
import axiosInstance from "./api/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
      );
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const login = async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const response = await axiosInstance.post(
        "/accounts/login/",
        { email, password }
      );

      const user = response.data.user;
      setCurrentUser(user);
      setAuthLoading(false);
      return { success: true, user };
    } catch (error) {
      setAuthLoading(false);
      const message =
        error.response?.data?.error ||
        "Login failed. Please try again.";
      setAuthError(message);
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      await axiosInstance.post("/accounts/register/", {
        name,
        email,
        password,
      });
      setAuthLoading(false);
      return { success: true };
    } catch (error) {
      setAuthLoading(false);
      const message =
        error.response?.data?.email?.[0] ||
        error.response?.data?.password?.[0] ||
        error.response?.data?.detail ||
        "Registration failed. Please try again.";
      setAuthError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const refreshUser = async () => {
    if (!currentUser?.id) return;
    try {
      const response = await axiosInstance.get(
        `/accounts/users/${currentUser.id}/`
      );
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Failed to refresh user", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authLoading,
        authError,
        login,
        register,
        logout,
        refreshUser,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
