import { useState } from "react";
import dayjs from "dayjs";

export const useResignationManager = () => {
  const initial = {
    fullName: "",
    employeeId: "",
    reasonForResignation: "",
    lastDayOfWorking: "",
    notifiedDate: "",
    employeeNumber:""

  };

  const [formData, setFormData] = useState(initial);
  const [file, setFile] = useState(null);

  const handleChange = (field) => (e) => {
    setFormData((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleFileChange = ({ file }) => {
    if (!file) return console.error("No file selected");
    setFile(file);
  };

  const resetForm = () => {
    setFormData(initial);
    setFile(null);
  };

  return {
    formData,
    setFormData,
    file,
    handleChange,
    handleFileChange,
    resetForm,
  };
};
