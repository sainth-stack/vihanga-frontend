import * as XLSX from "xlsx";


export const downloadEmployeeTemplate = () => {
  // Get current date in MongoDB-compatible format (ISO 8601)
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  let finalData = [
    {
      // Personal Information
      firstName: "John",
      lastName: "Doe",
      gender: "Male",
      dateOfBirth: "1990-01-01", // Template format - will be converted to Date object
      
      // Contact Information
      email: "john.doe@example.com",
      loginMethod: "Manual",
      mobileNumber: "9876543210",
      whatsappNumber: "9876543210",
     
      
      // Employment Information
      hireDate: "2023-01-01", // Template format - will be converted to Date object
      employeeNumber: "EMP_12345",
      status: "Active",
      inactiveDate: "", // Empty for active employees
      legalEntity: "TATA Gold",
      department: "IT",
      location: "India",
      lineManager: "Manager Name",
      jobCategory: "Full-time",
      role: "Admin",
      designation: "Senior Developer",
      grade: "Grade A",
      departmentHead: "Yes",
     
    },
    {
      // Personal Information
      firstName: "Jane",
      lastName: "Smith",
      gender: "Female",
      dateOfBirth: "2000-05-15", // Template format - will be converted to Date object
    
      
      // Contact Information
      email: "jane.smith@example.com",
      loginMethod: "SSO",
      mobileNumber: "9876543211",
      whatsappNumber: "9876543211",
     
      
      // Employment Information
      hireDate: "2022-06-01", // Template format - will be converted to Date object
      employeeNumber: "EMP_12346",
      status: "Active",
      inactiveDate: "", // Empty for active employees
        legalEntity: "Company Name",
        department: "HR",
        location: "India",
      lineManager: "no_manager",
     
      role: "Employee",
      designation: "Senior HR Specialist",
      grade: "Grade A",
      departmentHead: "No",
    
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(finalData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Template");
  XLSX.writeFile(workbook, "Employee_Template.xlsx");
}; 