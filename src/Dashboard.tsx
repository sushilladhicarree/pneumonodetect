import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Define SVG paths for icons to keep the component cleaner
const iconPaths = {
  document: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  ),
  checkCircle: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  ),
  clock: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  ),
  upload: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
    />
  ),
  chart: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  ),
  settings: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  ),
};

// Reusable Icon component to render SVG icons
const Icon: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <svg
    className={`w-6 h-6 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    {children}
  </svg>
);

const Dashboard = () => {
  const navigate = useNavigate();
  // Retrieve patient data from local storage
  const storedPatient = localStorage.getItem("patientData");
  const patientData = storedPatient ? JSON.parse(storedPatient) : null;
  // State to store the total number of scans
  const [totalScans, setTotalScans] = useState(0);

  // useEffect hook to fetch the total number of scans when the component mounts
  useEffect(() => {
    (async () => {
      try {
        // Make an asynchronous GET request to the specified API endpoint
        const response = await axios.get("http://127.0.0.1:8000/api/total-scans/", {
          headers: {
            'Accept': 'application/json', // Explicitly request JSON response
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include authorization token from local storage
          }
        });

        // Log the API response for debugging purposes
        console.log("Response", response);

        // Check if the API request was successful (status code 200)
        if (response.status === 200 && response.headers['content-type'].includes('application/json')) {
          // Update the totalScans state with the value from the API response
          setTotalScans(response.data.total_scans);
        } else {
          // Log an error if the response status is not 200 or if the content type is not JSON
          console.error("Unexpected response format:", response.data);
          // Optionally handle HTML responses or other formats here
        }
      } catch (error) {
        // Log an error if there's an issue with the API request
        console.error("Error fetching total scans:", error);
        // Optionally display an error message to the user
      }
    })();
  }, []); // ✅ Empty dependency array ensures this effect runs only once after the initial render

  // Data for the dashboard, including statistics, quick actions, and recent activity
  const dashboardData = {
    stats: [
      {
        icon: iconPaths.document,
        title: "Total Scans",
        value: totalScans,
        color: "blue",
      },
      {
        icon: iconPaths.checkCircle,
        title: "Accuracy Rate",
        value: "90%",
        color: "green",
      },
      {
        icon: iconPaths.clock,
        title: "Average Time",
        value: "2.3s",
        color: "purple",
      },
    ],
    quickActions: [
      {
        route: "/upload",
        icon: iconPaths.upload,
        title: "New Scan",
        description: "Upload X-ray image",
        color: "blue",
      },
      {
        route: "/result",
        icon: iconPaths.chart,
        title: "View Results",
        description: "Check analysis history",
        color: "green",
      },
      {
        route: "/settings",
        icon: iconPaths.settings,
        title: "Settings",
        description: "Configure preferences",
        color: "purple",
      },
    ],
    recentActivity: [
      {
        icon: iconPaths.checkCircle,
        title: "Analysis Completed",
        description: "Result: Normal",
        time: "2 mins ago",
      },
      {
        icon: iconPaths.upload,
        title: "New Scan Uploaded",
        description: "File: chest_xray_001.jpg",
        time: "5 mins ago",
      },
    ],
  };

  return (
    <div>
      {/* Dashboard header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome to PneumoDetect
        </h1>
        <p className="text-gray-600 mt-2">
          Your AI-powered pneumonia detection assistant
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {dashboardData.stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center">
              <div
                className={`p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-600`}
              >
                <Icon>{stat.icon}</Icon>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-semibold text-gray-800">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardData.quickActions.map((action, index) => (
            <button
              key={index}
              type="button"
              onClick={() => navigate(action.route)}
              className={`flex items-center p-4 bg-${action.color}-50 rounded-lg hover:bg-${action.color}-100 transition-colors w-full text-left`}
            >
              <div
                className={`p-3 rounded-full bg-${action.color}-100 text-${action.color}-600`}
              >
                <Icon>{action.icon}</Icon>
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-800">{action.title}</p>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {dashboardData.recentActivity.map((activity, index) => {
            // For the first recent activity item, display patient ID and name
            let titleContent = activity.title;
            if (index === 0) {
              const storedPatient = localStorage.getItem("patientData");
              const patientData = storedPatient
                ? JSON.parse(storedPatient)
                : { id: "dummy123", name: "John Doe" };
              titleContent = (
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="text-sm font-bold text-gray-800">
                    {patientData.id}
                  </span>
                  <span className="sm:ml-2 text-lg text-gray-900">
                    {patientData.name}
                  </span>
                </div>
              );
            }
            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    <Icon className="w-5 h-5">{activity.icon}</Icon>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-800">{titleContent}</p>
                    <p className="text-sm text-gray-600">
                      {activity.description}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;