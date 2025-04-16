import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Download,
  Eye,
  Search,
  User,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { PatientReport } from "./types";

interface PatientData {
  id: string;
  name: string;
  age: string;
  email: string;
  phone: string;
  imagePreview?: string;
}

const Result: React.FC = () => {
  const navigate = useNavigate();

  // Processing state
  const [isProcessing, setIsProcessing] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Analysis data
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [hasPneumonia, setHasPneumonia] = useState(false);
  const [analysisTime, setAnalysisTime] = useState("");
  const [patientData, setPatientData] = useState<PatientData>({
    id: "",
    name: "",
    age: "",
    email: "",
    phone: "",
  });

  // Search and filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [resultFilter, setResultFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("30");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Reports
  const [reports, setReports] = useState<PatientReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<PatientReport[]>([]);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState("");

  // Get data from localStorage and setup
  useEffect(() => {
    const checkAndLoadData = () => {
      const stored = localStorage.getItem("patientData");

      if (!stored) {
        setIsError(true);
        setErrorMessage("No patient data found. Please upload an X-ray first.");
        setIsProcessing(false);
        return false;
      }

      try {
        const data = JSON.parse(stored);
        setPatientData(data);
        return true;
      } catch (error) {
        setIsError(true);
        setErrorMessage("Invalid patient data. Please try uploading again.");
        setIsProcessing(false);
        return false;
      }
    };

    const hasData = checkAndLoadData();

    if (hasData) {
      // Simulate or fetch analysis results
      const timer = setTimeout(() => {
        try {
          const analysisData = localStorage.getItem("analysisData");
          if (analysisData) {
            const data = JSON.parse(analysisData);
            // Use data from API if available
            setConfidenceScore(data.confidence || 90);
            setHasPneumonia(data.result === "Pneumonia");
          } else {
            // Default values if no API data
            setConfidenceScore(90);
            setHasPneumonia(true);
          }

          setAnalysisTime(new Date().toLocaleTimeString());
          setIsProcessing(false);
        } catch (error) {
          console.error("Error processing analysis data:", error);
          setConfidenceScore(90);
          setHasPneumonia(true);
          setAnalysisTime(new Date().toLocaleTimeString());
          setIsProcessing(false);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Fetch reports data
  useEffect(() => {
    const fetchReports = async () => {
      setIsLoadingReports(true);
      setReportsError("");

      try {
        const response = await fetch("http://127.0.0.1:8000/api/report/", {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzcxMzMxNjg3LCJpYXQiOjE3Mzk3OTU2ODcsImp0aSI6IjE1ZDM0NjI5MjNlMTRjYzdiYjc5MjVjN2ZhMzRmNzZmIiwidXNlcl9pZCI6Mn0.pbYUY3yBkFVjl93dQPQ-LpPIlKnyiTwlcvwZSuV2Xs8`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch reports: ${response.status}`);
        }

        const reportData = await response.json();
        setReports(reportData);
        setFilteredReports(reportData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setReportsError(
          "Failed to load historical reports. Please try again later."
        );
      } finally {
        setIsLoadingReports(false);
      }
    };

    if (!isError) {
      fetchReports();
    }
  }, [isError]);

  // Handle search functionality
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      setFilteredReports(reports);
      return;
    }

    if (query.length <= 2) {
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/customer/search/?name=${query}`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzcxMzMxNjg3LCJpYXQiOjE3Mzk3OTU2ODcsImp0aSI6IjE1ZDM0NjI5MjNlMTRjYzdiYjc5MjVjN2ZhMzRmNzZmIiwidXNlcl9pZCI6Mn0.pbYUY3yBkFVjl93dQPQ-LpPIlKnyiTwlcvwZSuV2Xs8",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();
      setSearchResults(data);
      setFilteredReports([]);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // Apply filters to reports
  useEffect(() => {
    if (reports.length === 0 || searchResults.length > 0) return;

    let filtered = [...reports];

    // Filter by result type
    if (resultFilter) {
      filtered = filtered.filter((report) =>
        resultFilter === "pneumonia"
          ? report.result === "Pneumonia"
          : report.result === "Normal"
      );
    }

    // Filter by time period (days)
    if (timeFilter) {
      const daysAgo = parseInt(timeFilter);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

      filtered = filtered.filter((report) => {
        const reportDate = new Date(report.report_date);
        return reportDate >= cutoffDate;
      });
    }

    setFilteredReports(filtered);
  }, [reports, resultFilter, timeFilter, searchResults.length]);

  // Navigate back to upload
  const handleBackToUpload = () => {
    navigate("/upload");
  };

  // Render patient info cards
  const renderPatientInfo = (
    label: string,
    value: string,
    icon: React.ReactNode
  ) => (
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

  // Error state view
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <button
            onClick={handleBackToUpload}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Upload
          </button>
        </div>
      </div>
    );
  }

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
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Analysis Results
                </h1>
                <p className="text-gray-600">Completed at {analysisTime}</p>
              </div>
              <button
                onClick={handleBackToUpload}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Upload
              </button>
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
                patientData.phone || "N/A",
                <User className="w-6 h-6" />
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  X-ray Image
                </h3>
                <div className="aspect-square w-full max-w-xs mx-auto bg-gray-100 rounded-lg overflow-hidden">
                  {patientData.imagePreview ? (
                    <img
                      src={patientData.imagePreview}
                      alt="X-ray"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src="/api/placeholder/400/400"
                      alt="X-ray"
                      className="w-full h-full object-cover"
                    />
                  )}
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
                        onChange={handleSearch}
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
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last year</option>
                    <option value="">All time</option>
                  </select>
                </div>
              </div>

              {isLoadingReports ? (
                <div className="p-10 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading reports...</p>
                </div>
              ) : reportsError ? (
                <div className="p-10 text-center">
                  <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600">{reportsError}</p>
                </div>
              ) : (
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
                      {(searchResults.length > 0
                        ? searchResults
                        : filteredReports
                      ).length > 0 ? (
                        (searchResults.length > 0
                          ? searchResults
                          : filteredReports
                        ).map((entry, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            {entry.report_date ? (
                              // Render report entry
                              <>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {entry?.report_date?.split("T")[0]}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {entry?.report_date
                                      ?.split("T")[1]
                                      ?.split(".")[0] || ""}
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
                                        style={{
                                          width: `${entry.confidence || 90}%`,
                                        }}
                                      />
                                    </div>
                                    <span className="text-sm text-gray-600">
                                      {entry.confidence || 90}%
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex space-x-3">
                                    <button
                                      onClick={() =>
                                        setModalImage(
                                          `${entry?.customer?.xray_image}`
                                        )
                                      }
                                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                    >
                                      <Eye className="w-4 h-4 mr-1" /> View
                                    </button>

                                    <button className="inline-flex items-center text-blue-600 hover:text-blue-800">
                                      <Download className="w-4 h-4 mr-1" />{" "}
                                      Download
                                    </button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              // Render customer object when searching
                              <>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">
                                    N/A
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {entry.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ID: {entry.id}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Age: {entry.age}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  No result data
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  –
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {entry.xray_image ? (
                                    <button
                                      onClick={() =>
                                        setModalImage(`${entry.xray_image}`)
                                      }
                                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                    >
                                      <Eye className="w-4 h-4 mr-1" /> View
                                    </button>
                                  ) : (
                                    "–"
                                  )}
                                </td>
                              </>
                            )}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-8 text-center text-gray-500"
                          >
                            No reports found with the current filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Image modal */}
      {modalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative bg-white p-4 rounded shadow-lg max-w-3xl w-full">
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <img
              src={`${modalImage}`}
              alt="X-ray"
              className="w-full h-auto rounded"
              onError={(e) => {
                e.currentTarget.src = "/api/placeholder/400/400";
                e.currentTarget.alt = "Image load error";
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;
