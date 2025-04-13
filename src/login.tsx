import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      localStorage.setItem("username", data.username);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="flex w-full max-w-md flex-col items-center">
        <h1 className="mb-2 text-4xl font-bold text-blue-500">PneumoDetect</h1>
        <p className="mb-8 text-gray-600">
          Sign in to access the detection system
        </p>

        <div className="w-full rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                username
              </label>
              <input
                id="username"
                name="username"
                type="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
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
              />
            </div>

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
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            >
              Sign in
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-gray-600">
          Not a member?
          <a
            href="/register"
            className="ml-1 text-blue-500 hover:text-blue-600"
          >
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;