// contexts/AuthContext.js
import { createContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize auth state from localStorage
  const [authState, setAuthState] = useState(() => {
    try {
      const storedAuth = localStorage.getItem("authState");
      return storedAuth ? JSON.parse(storedAuth) : {};
    } catch (error) {
      console.error("Failed to parse auth state from localStorage:", error);
      return {};
    }
  });

  // Update localStorage when authState changes
  useEffect(() => {
    localStorage.setItem("authState", JSON.stringify(authState));
  }, [authState]);

  // Set auth state
  const setAuth = useCallback((auth) => {
    setAuthState(auth);
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Replace with your actual logout API call
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Clear auth state after successful logout
      setAuthState({});
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }, []);

  // Computed values
  const isLoggedIn = !!authState.user?.user_uid;
  const user = authState?.user || null;

  const value = {
    authState,
    setAuth,
    isLoggedIn,
    user,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
