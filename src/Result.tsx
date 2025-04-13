import React, { useState, useEffect } from "react";
import { Clock, Download, Eye, Search, User } from "lucide-react";
import { PatientReport } from "./types";

const Result = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [hasPneumonia, setHasPneumonia] = useState(false);
  const [analysisTime, setAnalysisTime] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [resultFilter, setResultFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("30");
  const [patientData, setPatientData] = useState({
    id: "",
    name: "",
    age: "",
    email: "",
    phone: "",
  });

  const [reports, setReports] = useState<PatientReport[]>();

  const historyData = [
    {
      date: "2024-01-15",
      time: "14:30",
      result: "pneumonia",
      confidence: 87,
      patient: {
        id: "PT-2024-001",
        name: "John Doe",
        age: "45",
      },
    },
    {
      date: "2024-01-14",
      time: "09:15",
      result: "normal",
      confidence: 92,
      patient: {
        id: "PT-2024-002",
        name: "Sarah Smith",
        age: "32",
      },
    },
    {
      date: "2024-01-14",
      time: "09:15",
      result: "normal",
      confidence: 92,
      patient: {
        id: "PT-2024-002",
        name: "Sarah Smith",
        age: "32",
      },
    },
    {
      date: "2024-01-13",
      time: "11:45",
      result: "pneumonia",
      confidence: 89,
      patient: {
        id: "PT-2024-003",
        name: "Mike Johnson",
        age: "58",
      },
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsProcessing(false);
      setConfidenceScore(87);
      setHasPneumonia(true);
      setAnalysisTime(new Date().toLocaleTimeString());
    }, 3000);

    const stored = localStorage.getItem("patientData");
    if (stored) {
      setPatientData(JSON.parse(stored));
    } else {
      setPatientData({
        id: "PT-2024-001",
        name: "John Doe",
        age: "30",
        email: "john@example.com",
        phone: "123-456-7890",
      });
    }
    return () => clearTimeout(timer);
  }, []);


console.log(reports)

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/report/", {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzcxMzMxNjg3LCJpYXQiOjE3Mzk3OTU2ODcsImp0aSI6IjE1ZDM0NjI5MjNlMTRjYzdiYjc5MjVjN2ZhMzRmNzZmIiwidXNlcl9pZCI6Mn0.pbYUY3yBkFVjl93dQPQ-LpPIlKnyiTwlcvwZSuV2Xs8`,
          },
        });
        const reportData = await response.json();
        setReports(reportData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, []);

  const renderPatientInfo = (label, value, icon) => (
    <div className="flex items-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600">
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isProcessing ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Processing Your X-ray
              </h2>
              <p className="text-gray-600">Please wait a moment...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Analysis Results
              </h1>
              <p className="text-gray-600">Completed at {analysisTime}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {renderPatientInfo(
                "Patient Name",
                patientData.name,
                <User className="w-6 h-6" />
              )}
              {renderPatientInfo(
                "Patient ID",
                patientData.id,
                <User className="w-6 h-6" />
              )}
              {renderPatientInfo(
                "Age",
                `${patientData.age} years`,
                <Clock className="w-6 h-6" />
              )}
              {renderPatientInfo(
                "Contact",
                patientData.phone,
                <User className="w-6 h-6" />
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  X-ray Image
                </h3>
                <div className="aspect-square w-full max-w-xs mx-auto bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src="/api/placeholder/400/400"
                    alt="X-ray"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6">
                <div
                  className={`p-6 rounded-lg mb-6 ${
                    hasPneumonia ? "bg-red-50" : "bg-green-50"
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                        hasPneumonia
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {hasPneumonia ? (
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <h4
                      className={`text-xl font-bold mb-2 ${
                        hasPneumonia ? "text-red-700" : "text-green-700"
                      }`}
                    >
                      {hasPneumonia ? "Pneumonia Detected" : "Normal"}
                    </h4>
                    <p
                      className={
                        hasPneumonia ? "text-red-600" : "text-green-600"
                      }
                    >
                      {hasPneumonia
                        ? "Signs of pneumonia infection found"
                        : "No signs of pneumonia detected"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Processing Time</p>
                    <p className="text-lg font-semibold text-gray-900">2.3s</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Image Quality</p>
                    <p className="text-lg font-semibold text-gray-900">High</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Confidence Score
                  </p>
                  <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-1000"
                      style={{ width: `${confidenceScore}%` }}
                    />
                  </div>
                  <p className="text-right mt-1 text-sm text-gray-600">
                    {confidenceScore}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm mt-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Analysis History
                </h2>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search records..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <select
                    value={resultFilter}
                    onChange={(e) => setResultFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Results</option>
                    <option value="normal">Normal</option>
                    <option value="pneumonia">Pneumonia</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Result
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Confidence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reports?.map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {entry?.report_date?.split("T")[0]}
                          </div>
                          <div className="text-sm text-gray-500">
                            {/* {entry.time} */}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {entry.customer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {entry.customer.id}
                          </div>
                          <div className="text-sm text-gray-500">
                            Age: {entry.customer.age}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              entry.result === "Pneumonia"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {entry.result === "Pneumonia"
                              ? "Pneumonia Detected"
                              : "Normal"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `100%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">
                              100%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-3">
                            <button className="inline-flex items-center text-blue-600 hover:text-blue-800">
                              <Eye className="w-4 h-4 mr-1" /> View
                            </button>
                            <button className="inline-flex items-center text-blue-600 hover:text-blue-800">
                              <Download className="w-4 h-4 mr-1" /> Download
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Result;
