export interface PatientReport {
    customer: Customer;
    result: string;
    report_date: Date;
  }
  
  export interface Customer {
    id: number;
    name: string;
    age: number;
    email: string;
    contact_number: string;
    xray_image: string;
  }
  