import React, { useState, useEffect } from 'react';

const Result = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [hasPneumonia, setHasPneumonia] = useState(false);
  const [analysisTime, setAnalysisTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('30');

  const historyData = [
    {
      date: '2024-01-15',
      time: '14:30',
      result: 'pneumonia',
      confidence: 87
    },
    {
      date: '2024-01-14',
      time: '09:15',
      result: 'normal',
      confidence: 92
    },
    {
      date: '2024-01-13',
      time: '11:45',
      result: 'pneumonia',
      confidence: 89
    }
  ];

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setIsProcessing(false);
      setConfidenceScore(87);
      setHasPneumonia(true);
      setAnalysisTime(new Date().toLocaleTimeString());
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleDownloadReport = () => {
    alert('Report download functionality will be implemented here');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleResultFilterChange = (e) => {
    setResultFilter(e.target.value);
  };

  const handleTimeFilterChange = (e) => {
    setTimeFilter(e.target.value);
  };

  return (
    <div>
      {/* Analysis Results Section */}
      <section className="p-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          {isProcessing ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing Your X-ray</h2>
              <p className="text-gray-600">This may take a few moments...</p>
            </div>
          ) : (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Analysis Results</h1>
                <p className="text-gray-600 mt-2">Analysis completed at {analysisTime}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Original X-ray</h3>
                  <div className="relative aspect-square">
                    <img className="w-full h-full object-contain rounded-lg" src="/api/placeholder/400/400" alt="Original X-ray" />
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Diagnosis</h3>
                  
                  {hasPneumonia ? (
                    <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg mb-4">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <h4 className="text-xl font-bold text-red-700 mb-2">Pneumonia Detected</h4>
                        <p className="text-red-600">Signs of pneumonia infection found</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg mb-4">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h4 className="text-xl font-bold text-green-700 mb-2">Normal</h4>
                        <p className="text-green-600">No signs of pneumonia detected</p>
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Confidence Score</h4>
                    <div className="bg-gray-100 rounded-full h-4">
                      <div 
                        className="bg-blue-600 rounded-full h-4 transition-all duration-1000"
                        style={{ width: `${confidenceScore}%` }}
                      />
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-sm text-gray-600">{confidenceScore}%</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Processing Time</span>
                      <span className="font-medium text-gray-800">2.3 seconds</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Image Quality</span>
                      <span className="font-medium text-gray-800">High</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4 mt-8">
                <button 
                  onClick={() => window.location.href='#upload_section'} 
                  className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Analyze Another Image
                </button>
                <button 
                  onClick={handleDownloadReport}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Download Report
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Patient History Section */}
      <section className="p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Analysis History</h1>
            <p className="text-gray-600 mt-2">View and manage your previous X-ray analysis results</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[200px]">
                <input 
                  type="text" 
                  placeholder="Search by date or result"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex-none">
                <select 
                  value={resultFilter}
                  onChange={handleResultFilterChange}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Results</option>
                  <option value="normal">Normal</option>
                  <option value="pneumonia">Pneumonia Detected</option>
                </select>
              </div>
              <div className="flex-none">
                <select 
                  value={timeFilter}
                  onChange={handleTimeFilterChange}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="30">Last 30 Days</option>
                  <option value="60">Last 60 Days</option>
                  <option value="90">Last 90 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {historyData.map((entry, index) => (
                    <tr key={`${entry.date}-${entry.time}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          entry.result === 'pneumonia' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {entry.result === 'pneumonia' ? 'Pneumonia Detected' : 'Normal'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.confidence}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-3">
                          <button className="text-blue-600 hover:text-blue-800">View</button>
                          <button className="text-blue-600 hover:text-blue-800">Download</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">3</span> of <span className="font-medium">12</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Previous
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        1
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">
                        2
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        3
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Result;