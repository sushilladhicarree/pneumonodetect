import React, { useState, useRef } from "react";

export const Upload: React.FC = () => {
  // State management
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Validation functions
  const validateFile = (file: File): boolean => {
    // Validate file type
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid JPEG or PNG file.");
      return false;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size should not exceed 10MB.");
      return false;
    }

    return true;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Event handlers
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();

    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("border-blue-400");
    }

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file: File): void => {
    setError("");

    if (validateFile(file)) {
      setFile(file);

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && typeof e.target.result === "string") {
          setPreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (): void => {
    setFile(null);
    setPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Drag events
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add("border-blue-400");
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("border-blue-400");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add("border-blue-400");
    }
  };

  const handleAnalyze = (): void => {
    // Validate patient fields (basic validation)
    if (!patientName.trim() || !age.trim() || !email.trim() || !phone.trim()) {
      setError("Please fill in all patient details.");
      return;
    }
    // Generate unique id
    const id = Date.now().toString();
    const patientData = { id, name: patientName, age, email, phone };
    localStorage.setItem("patientData", JSON.stringify(patientData));
    // Optionally, proceed with analysis (e.g., navigate to result page)
    // ...existing analyze logic or API call...
    alert("Patient data stored. Analysis functionality goes here.");
  };

  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const payload = new FormData();
    if (file) {
      payload.append("xray_image", file);
    }

    payload.append("name", patientName);
    payload.append("age", age);
    payload.append("email", email);
    payload.append("contact_number", phone);

    try {
      const response = await fetch("http://localhost:8000/api/customer/", {
        method: "POST",
        body: payload,
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzcxMzMxNjg3LCJpYXQiOjE3Mzk3OTU2ODcsImp0aSI6IjE1ZDM0NjI5MjNlMTRjYzdiYjc5MjVjN2ZhMzRmNzZmIiwidXNlcl9pZCI6Mn0.pbYUY3yBkFVjl93dQPQ-LpPIlKnyiTwlcvwZSuV2Xs8",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        setError("Failed to upload image. Please try again.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section id="upload_section" className="p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Upload X-ray Image
          </h1>
          <p className="text-gray-600 mt-2">
            Supported formats: JPEG, PNG | Max file size: 10MB
          </p>
        </div>

        <form
          onSubmit={handleSumbit}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          {/* Upload Area */}
          {!file && (
            <div
              ref={dropZoneRef}
              className="border-2 border-dashed border-blue-200 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
              onDrop={handleFileDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
            >
              <input
                type="file"
                id="file-input"
                ref={fileInputRef}
                className="hidden"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileInput}
              />
              <div className="space-y-4">
                <svg
                  className="mx-auto h-12 w-12 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <div className="text-gray-600">
                  <span className="font-medium">Drag and drop</span> your X-ray
                  image here
                  <br />
                  or{" "}
                  <span
                    className="text-blue-600 hover:text-blue-500 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    browse files
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Preview Area */}
          {file && (
            <div className="mt-6">
              <div className="relative">
                <img
                  className="w-full h-64 object-contain rounded-lg border border-gray-200"
                  src={preview}
                  alt="Preview"
                />
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none"
                  onClick={removeFile}
                  type="button"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  {file.name} ({formatFileSize(file.size)})
                </p>
              </div>
            </div>
          )}

          {/* New Patient Details Form */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Patient Name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none"
            />
            <input
              type="text"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none"
            />
          </div>

          {/* Validation Message */}
          {error && (
            <div className="mt-4 p-4 rounded-lg bg-red-50 text-red-600">
              {error}
            </div>
          )}

          {/* Action Button */}
          <div className="mt-6">
            <button
              disabled={!file}
              // onClick={handleAnalyze}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              type="submit"
            >
              Analyze Image
            </button>
          </div>
        </form>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Guidelines for Best Results
          </h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-blue-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Ensure the X-ray image is clear and well-focused
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-blue-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Upload front view chest X-rays only
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-blue-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              File size should not exceed 10MB
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Upload;
