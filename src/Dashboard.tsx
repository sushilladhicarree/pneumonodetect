import React from 'react'

export const Dashboard = () => {
  return (
    <div>
    <div> <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-800">Welcome to PneumoDetect</h1>
    <p className="text-gray-600 mt-2">Your AI-powered pneumonia detection assistant</p>
  </div>
{/* <!-- Stats Grid --> */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Total Scans</p>
          <p className="text-2xl font-semibold text-gray-800">234</p>
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-green-100 text-green-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Accuracy Rate</p>
          <p className="text-2xl font-semibold text-gray-800">96%</p>
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Average Time</p>
          <p className="text-2xl font-semibold text-gray-800">2.3s</p>
        </div>
      </div>
    </div>
  </div>

  {/* <!-- Quick Actions --> */}
  <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <a href="#upload_section" className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
          </svg>
        </div>
        <div className="ml-4">
          <p className="font-medium text-gray-800">New Scan</p>
          <p className="text-sm text-gray-600">Upload X-ray image</p>
        </div>
      </a>

      <a href="#analysis_results" className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
        <div className="p-3 rounded-full bg-green-100 text-green-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        <div className="ml-4">
          <p className="font-medium text-gray-800">View Results</p>
          <p className="text-sm text-gray-600">Check analysis history</p>
        </div>
      </a>

      <a href="#settings" className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
        <div className="ml-4">
          <p className="font-medium text-gray-800">Settings</p>
          <p className="text-sm text-gray-600">Configure preferences</p>
        </div>
      </a>
    </div>
  </div>

  {/* <!-- Recent Activity --> */}
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-blue-100 text-blue-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div className="ml-4">
            <p className="font-medium text-gray-800">Analysis Completed</p>
            <p className="text-sm text-gray-600">Result: Normal</p>
          </div>
        </div>
        <span className="text-sm text-gray-500">2 mins ago</span>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-blue-100 text-blue-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
            </svg>
          </div>
          <div className="ml-4">
            <p className="font-medium text-gray-800">New Scan Uploaded</p>
            <p className="text-sm text-gray-600">File: chest_xray_001.jpg</p>
          </div>
        </div>
        <span className="text-sm text-gray-500">5 mins ago</span>
      </div>
    </div>
  </div>
</div>
 </div>
  );
};


export default Dashboard;