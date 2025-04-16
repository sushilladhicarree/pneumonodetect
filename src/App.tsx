import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./NavBar";
import Dashboard from "./Dashboard";
import Upload from "./Upload";
import Result from "./Result";
import Settings from "./Settings";

const App = () => (
  <BrowserRouter>
    <div className="flex">
      <NavBar />
      <main className="flex-1 ml-64 min-h-screen bg-gray-50 p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/result" element={<Result />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  </BrowserRouter>
);

export default App;