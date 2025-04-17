import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./context/authContext";
import "./NavBar.css"; // Import the CSS file for styling

// Define the NavBar functional component
const NavBar = () => {
  // State to manage the visibility of the mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Access the logout function from the authentication context
  const { logout } = useAuth();
  // Hook to enable programmatic navigation
  const navigate = useNavigate();

  // Function to handle user logout
  const handleLogout = () => {
    logout(); // Call the logout function from the auth context
    navigate("/login"); // Navigate the user back to the login page
  };

  // Array of navigation items with their respective paths, titles, and icons
  const navItems = [
    {
      to: "/dashboard",
      title: "Dashboard",
      icon: (
        <svg className="nav-icon" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"></path>
          <path d="M3 10a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"></path>
          <path d="M3 16a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"></path>
        </svg>
      ),
    },
    {
      to: "/upload",
      title: "Upload",
      icon: (
        <svg
          className="nav-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          ></path>
        </svg>
      ),
    },
    {
      to: "/result",
      title: "Results",
      icon: (
        <svg
          className="nav-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          ></path>
        </svg>
      ),
    },
    {
      to: "/settings",
      title: "Settings",
      icon: (
        <svg
          className="nav-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    <aside className={`navbar-sidebar${isMobileMenuOpen ? " open" : ""}`}>
      {/* Logo of the application */}
      <div className="navbar-logo">PneumoDetect</div>
      {/* Navigation links */}
      <nav className="navbar-links">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
            onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu on link click
          >
            <span className="navbar-link-icon">{item.icon}</span>
            {item.title}
          </NavLink>
        ))}
      </nav>
      {/* User profile information and logout button */}
      <div className="navbar-profile">
        {/* Profile icon */}
        <div className="navbar-profile-icon">
          <svg
            className="nav-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
        </div>
        {/* User name and role/affiliation */}
        <div className="navbar-profile-info">
          <div className="navbar-profile-name">Admin</div>
          <div className="navbar-profile-email">Gandaki Hospital</div>
        </div>
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="navbar-logout-button"
          title="Logout"
        >
          <svg
            className="nav-icon logout-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            ></path>
          </svg>
        </button>
      </div>
      {/* Mobile menu toggle button */}
      <button
        className="navbar-mobile-toggle"
        onClick={() => setIsMobileMenuOpen((open) => !open)}
      >
        <svg
          className="nav-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {/* Conditional rendering of the toggle icon based on menu state */}
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>
    </aside>
  );
};

export default NavBar;