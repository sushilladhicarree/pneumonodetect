import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/authContext";

// Define the interface for the login form data
interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

// Define the functional component for the Login page
const Login: React.FC = () => {
  // Access authentication context to get login function and authentication status
  const { login, isAuthenticated } = useAuth();
  // State to manage the form data for username, password, and rememberMe
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
    rememberMe: false,
  });
  // State to manage the loading state during the login process
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // State to store any error message that occurs during login
  const [error, setError] = useState<string | null>(null);
  // Hook to enable programmatic navigation between routes
  const navigate = useNavigate();

  // useEffect hook to redirect to the dashboard if the user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
    // Dependency array ensures this effect runs when isAuthenticated or navigate changes
  }, [isAuthenticated, navigate]);

  // Function to handle changes in the input fields of the form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    // Update the form data state based on the input field that changed
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Asynchronous function to handle the form submission for login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setError(null); // Clear any previous error messages
    setIsLoading(true); // Set loading state to true while processing the login

    try {
      // Make a POST request to the backend login API endpoint
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      // Parse the JSON response from the API
      const data = await response.json();

      // Check if the API response indicates an error
      if (!response.ok) {
        throw new Error(data.detail || "Login failed. Please check your credentials.");
      }

      // Store the 'rememberMe' preference and username in local storage if checked
      if (formData.rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("savedUsername", formData.username);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("savedUsername");
      }

      // Call the login function from the authentication context with the received tokens and user information
      await login(
        { access: data.access, refresh: data.refresh }, // Tokens received from the backend
        { username: formData.username }                    // User object (can be extended with more user details if available)
      );

      // Navigate the user to the dashboard page after successful login
      navigate("/dashboard");
    } catch (err) {
      // Log any error that occurred during the login process
      console.error("Login error:", err);
      // Set the error state with the error message
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      // Set loading state back to false after the login process completes (success or failure)
      setIsLoading(false);
    }
  };

  // useEffect hook to load the saved username and rememberMe preference from local storage on component mount
  useEffect(() => {
    const rememberMe = localStorage.getItem("rememberMe") === "true";
    if (rememberMe) {
      const savedUsername = localStorage.getItem("savedUsername");
      if (savedUsername) {
        setFormData((prev) => ({
          ...prev,
          username: savedUsername,
          rememberMe: true
        }));
      }
    }
    // Empty dependency array ensures this effect runs only once after the initial render
  }, []);

  // Render the login form
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="flex w-full max-w-md flex-col items-center">
        {/* Application title */}
        <h1 className="mb-2 text-4xl font-bold text-blue-500">PneumoDetect</h1>
        {/* Tagline */}
        <p className="mb-8 text-gray-600">
          Sign in to access the detection system
        </p>

        {/* Login form container */}
        <div className="w-full rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          {/* Display any login error message */}
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit}>
            {/* Username input field */}
            <div className="mb-4">
              <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                autoComplete="username"
              />
            </div>

            {/* Password input field */}
            <div className="mb-4">
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                autoComplete="current-password"
              />
            </div>

            {/* Remember me checkbox and forgot password link */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="/forgot-password" className="text-blue-500 hover:text-blue-600">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full rounded-md px-4 py-2 font-medium text-white ${
                isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Link to the registration page */}
        <p className="mt-6 text-center text-gray-600">
          Not a member?{' '}
          <a href="/register" className="text-blue-500 hover:text-blue-600">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;