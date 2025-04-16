import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Upload as UploadIcon, Check } from "lucide-react";

export const Upload: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Form fields
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Form validation
  const [formErrors, setFormErrors] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    file: ""
  });

  // Check if we already have data in progress
  useEffect(() => {
    const storedData = localStorage.getItem("patientData");
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setPatientName(data.name || "");
        setAge(data.age || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
      } catch (err) {
        // Invalid stored data, clear it
        localStorage.removeItem("patientData");
      }
    }
  }, []);

  // Validation functions
  const validateFile = (file: File): boolean => {
    // Validate file type
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setFormErrors(prev => ({...prev, file: "Please upload a valid JPEG or PNG file."}));
      return false;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFormErrors(prev => ({...prev, file: "File size should not exceed 10MB."}));
      return false;
    }

    setFormErrors(prev => ({...prev, file: ""}));
    return true;
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const errors = {
      name: "",
      age: "",
      email: "",
      phone: "",
      file: formErrors.file
    };

    // Name validation
    if (!patientName.trim()) {
      errors.name = "Patient name is required";
      isValid = false;
    }

    // Age validation
    if (!age.trim()) {
      errors.age = "Age is required";
      isValid = false;
    } else if (isNaN(Number(age)) || Number(age) <= 0 || Number(age) > 120) {
      errors.age = "Please enter a valid age between 1-120";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Phone validation
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phone.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!phoneRegex.test(phone.replace(/[-()\s]/g, ''))) {
      errors.phone = "Please enter a valid phone number";
      isValid = false;
    }

    // File validation
    if (!file) {
      errors.file = "Please upload an X-ray image";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validate form
    if (!validateForm()) {
      setError("Please fix the errors in the form before submitting.");
      return;
    }
    
    setIsLoading(true);
    
    // Save form data to localStorage for persistence
    const patientData = { 
      id: `PT-${Date.now().toString().slice(-8)}`,
      name: patientName, 
      age, 
      email, 
      phone,
      imagePreview: preview
    };
    localStorage.setItem("patientData", JSON.stringify(patientData));

    // Create form data for API submission
    const payload = new FormData();
    if (file) {
      payload.append("xray_image", file);
    }
    payload.append("name", patientName);
    payload.append("age", age);
    payload.append("email", email);
    payload.append("contact_number", phone);

    try {
      // Submit to backend API
      const response = await fetch("http://localhost:8000/api/customer/", {
        method: "POST",
        body: payload,
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzcxMzMxNjg3LCJpYXQiOjE3Mzk3OTU2ODcsImp0aSI6IjE1ZDM0NjI5MjNlMTRjYzdiYjc5MjVjN2ZhMzRmNzZmIiwidXNlcl9pZCI6Mn0.pbYUY3yBkFVjl93dQPQ-LpPIlKnyiTwlcvwZSuV2Xs8",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Store the API response data
        localStorage.setItem("analysisData", JSON.stringify(data));
        
        setSuccess("Upload successful! Redirecting to results...");
        
        // Redirect to results page after short delay
        setTimeout(() => {
          navigate("/result");
        }, 1500);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Server error occurred");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError(error instanceof Error ? error.message : "Failed to upload image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="upload_section" className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Upload X-ray Image
          </h1>
          <p className="text-gray-600 mt-2">
            Supported formats: JPEG, PNG | Max file size: 10MB
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-700 flex items-center">
            <Check className="w-5 h-5 mr-2" />
            <span>{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          {/* Upload Area */}
          {!file && (
            <div
              ref={dropZoneRef}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                formErrors.file ? 'border-red-300 bg-red-50' : 'border-blue-200 hover:border-blue-400'
              }`}
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
                <UploadIcon className="mx-auto h-12 w-12 text-blue-400" />
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
                {formErrors.file && (
                  <p className="text-red-600 text-sm">{formErrors.file}</p>
                )}
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
                  alt="X-ray Preview"
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

          {/* Patient Details Form */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="Patient Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${
                  formErrors.name ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {formErrors.name && (
                <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>
            
            <div>
              <input
                type="text"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${
                  formErrors.age ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {formErrors.age && (
                <p className="text-red-600 text-sm mt-1">{formErrors.age}</p>
              )}
            </div>
            
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${
                  formErrors.email ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {formErrors.email && (
                <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>
            
            <div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${
                  formErrors.phone ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {formErrors.phone && (
                <p className="text-red-600 text-sm mt-1">{formErrors.phone}</p>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6">
            <button
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center justify-center"
              type="submit"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Analyze Image"
              )}
            </button>
          </div>
        </form>

        {/* Guidelines */}
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