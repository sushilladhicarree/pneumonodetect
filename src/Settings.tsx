import React, { useState } from 'react';

export const Settings = () => {
  const [settings, setSettings] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    hospitalName: 'City General Hospital',
    emailNotifications: true,
    autoReports: false,
    analysisMode: 'Standard Analysis',
    imageQuality: 'Balanced',
    dataCollection: true,
    researchParticipation: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggle = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof settings]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle saving settings
    console.log('Settings saved:', settings);
  };

  return (
    <div>
      <section className="p-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account preferences and application settings</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Settings</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={settings.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={settings.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700 mb-1">
                    Hospital/Clinic Name
                  </label>
                  <input
                    type="text"
                    id="hospitalName"
                    name="hospitalName"
                    value={settings.hospitalName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Notification Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive analysis results via email</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('emailNotifications')}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                      settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                    } transition-colors`}
                  >
                    <span
                      className={`${
                        settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Analysis Reports</h3>
                    <p className="text-sm text-gray-500">Automatic PDF report generation</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('autoReports')}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                      settings.autoReports ? 'bg-blue-600' : 'bg-gray-200'
                    } transition-colors`}
                  >
                    <span
                      className={`${
                        settings.autoReports ? 'translate-x-6' : 'translate-x-1'
                      } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Application Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Application Settings</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="analysisMode" className="block text-sm font-medium text-gray-700 mb-1">
                    Default Analysis Mode
                  </label>
                  <select
                    id="analysisMode"
                    name="analysisMode"
                    value={settings.analysisMode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option>Standard Analysis</option>
                    <option>Detailed Analysis</option>
                    <option>Quick Scan</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="imageQuality" className="block text-sm font-medium text-gray-700 mb-1">
                    Image Quality Preference
                  </label>
                  <select
                    id="imageQuality"
                    name="imageQuality"
                    value={settings.imageQuality}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option>High Quality (Slower)</option>
                    <option>Balanced</option>
                    <option>Fast Processing</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Privacy Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Data Collection</h3>
                    <p className="text-sm text-gray-500">Allow anonymous data collection for service improvement</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('dataCollection')}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                      settings.dataCollection ? 'bg-blue-600' : 'bg-gray-200'
                    } transition-colors`}
                  >
                    <span
                      className={`${
                        settings.dataCollection ? 'translate-x-6' : 'translate-x-1'
                      } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Research Participation</h3>
                    <p className="text-sm text-gray-500">Contribute anonymized data to medical research</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('researchParticipation')}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                      settings.researchParticipation ? 'bg-blue-600' : 'bg-gray-200'
                    } transition-colors`}
                  >
                    <span
                      className={`${
                        settings.researchParticipation ? 'translate-x-6' : 'translate-x-1'
                      } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={() => window.location.reload()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Settings;