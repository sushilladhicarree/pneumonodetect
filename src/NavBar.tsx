import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard.tsx";
import Upload from "./Upload.tsx";
import Result from "./Result.tsx";
import Settings from "./Settings.tsx";

export const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard_main");

  // New useEffect: Listen to hash changes and update activeSection accordingly.
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      setActiveSection(hash || "dashboard_main");
    };
    window.addEventListener("hashchange", handleHashChange);
    // Set initial active section based on hash
    handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Navigation items configuration
  const navItems = [
    {
      id: "dashboard_main",
      title: "Dashboard",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"></path>
          <path d="M3 10a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"></path>
          <path d="M3 16a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"></path>
        </svg>
      ),
      component: <Dashboard />,
    },
    {
      id: "upload_section",
      title: "Upload",
      icon: (
        <svg
          className="w-5 h-5"
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
      component: <Upload />,
    },
    {
      id: "analysis_results",
      title: "Results",
      icon: (
        <svg
          className="w-5 h-5"
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
      component: <Result />,
    },
    {
      id: "settings",
      title: "Settings",
      icon: (
        <svg
          className="w-5 h-5"
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
      component: <Settings />,
    },
  ];

  const getLinkClassName = (sectionId: string) => {
    const baseClass = "flex items-center px-6 py-3 transition-colors";
    return `${baseClass} ${
      activeSection === sectionId
        ? "text-blue-600 bg-blue-100 border-r-4 border-blue-600"
        : "text-gray-600 hover:bg-blue-50"
    }`;
  };

  const renderContent = () => {
    const currentSection = navItems.find((item) => item.id === activeSection);
    return currentSection ? currentSection.component : navItems[0].component;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <nav
        className={`fixed lg:static w-64 h-full bg-blue-50 border-r border-blue-100 transition-all duration-300 transform ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "lg:translate-x-0 -translate-x-full"
        } z-30`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-blue-100">
          <div className="text-2xl font-bold text-blue-600">PneumoDetect</div>
        </div>

        {/* Navigation Links */}
        <div className="py-4">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={getLinkClassName(item.id)}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection(item.id);
                window.location.hash = item.id; // update URL hash
              }}
            >
              <span className="mr-3">{item.icon}</span>
              {item.title}
            </a>
          ))}
        </div>

        {/* User Profile Footer */}
        <div className="absolute bottom-0 w-full border-t border-blue-100 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="w-8 h-8 rounded-full bg-blue-100 p-2 text-blue-600"
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
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">User Profile</p>
              <p className="text-xs text-gray-500">user@example.com</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Toggle Button */}
      <button
        className="lg:hidden fixed top-4 right-4 z-40 bg-blue-50 rounded-lg p-2 focus:outline-none"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
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

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <header className="bg-white border-b border-gray-200 mb-6 rounded-lg shadow">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
              {navItems.find((item) => item.id === activeSection)?.title}
            </h1>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                />
                <svg
                  className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <button className="p-2 rounded-lg hover:bg-gray-100">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>

              <button className="p-2 rounded-lg hover:bg-gray-100">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {renderContent()}
      </div>
    </div>
  );
};

export default NavBar;
