
export interface Customer {
  id: number;
  name: string;
  age: number;
  email: string;
  contact_number: string;
  xray_image: string;
}


export interface PatientReport {
id: number;
customer: Customer;
result: "Normal" | "Pneumonia";
confidence?: number;
report_date: string;
notes?: string;
}

export interface AnalysisResult {
id: number;
confidence: number;
result: "Normal" | "Pneumonia";
processing_time?: number;
image_quality?: string;
}
