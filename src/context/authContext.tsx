import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

interface User {
  username: string;
  // Add other user properties as needed
}

interface AuthTokens {
  access: string;
  refresh?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (tokens: AuthTokens, user: User) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  refreshToken: async () => false,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("authToken"));
  const [user, setUser] = useState<User | null>(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");
    
    if (storedToken) {
      setToken(storedToken);
    }
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = useCallback(async (tokens: AuthTokens, userData: User) => {
    try {
      // Store tokens and user data
      localStorage.setItem("authToken", tokens.access);
      if (tokens.refresh) {
        localStorage.setItem("refreshToken", tokens.refresh);
      }
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Update state
      setToken(tokens.access);
      setUser(userData);
      
      // No navigation here - will be handled by the component
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    // Clear all auth-related data
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    
    // Reset state
    setToken(null);
    setUser(null);
    
    // No navigation here - let components handle navigation
    window.location.href = "/login"; // This is a fallback for cases where navigation is needed
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return false;

      const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      localStorage.setItem("authToken", data.access);
      setToken(data.access);
      return true;
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
      return false;
    }
  }, [logout]);

  // Auto-refresh token before expiration (optional)
  useEffect(() => {
    const checkToken = setInterval(() => {
      if (token) {
        // Implement your token expiration check logic here
        // refreshToken();
      }
    }, 300000); // Check every 5 minutes

    return () => clearInterval(checkToken);
  }, [token, refreshToken]);

  const value = {
    isAuthenticated: !!token,
    user,
    token,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};