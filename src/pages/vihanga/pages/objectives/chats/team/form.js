// employeeDetailsCard.js (OKRCard component)
import React from 'react';
import { Box, Paper } from '@mui/material';
import { SelectComponent } from '../../../../components/input-elements/select';
import { OKRperiod } from "utilities";

const OKRCard1 = ({ companyInfo, setCompanyInfo }) => {
  const yearOptions = [
   { key: "2021", label: "2021", value: "2021" },
  { key: "2022", label: "2022", value: "2022" },
  { key: "2023", label: "2023", value: "2023" },
  { key: "2024", label: "2024", value: "2024" },
  { key: "2025", label: "2025", value: "2025" },
  { key: "2026", label: "2026", value: "2026" },
  { key: "2027", label: "2027", value: "2027" },
  { key: "2028", label: "2028", value: "2028" },
  { key: "2029", label: "2029", value: "2029" },
  { key: "2030", label: "2030", value: "2030" },
  { key: "2031", label: "2031", value: "2031" },

  ];

  const EmployeeOptions =[
    
  { key: "Gurusai", label: "Gurusai", value: "Gurusai" },
  { key: "sai", label: "sai", value: "sai" },

  ]

  const periodOptions = OKRperiod.map(period => ({ 
    label: period.label || period.value, 
    value: period.value 
  }));

  const handleChange = ({ target: { name, value } }) => {
    const updatedInfo = { ...companyInfo, [name]: value };
    setCompanyInfo(updatedInfo);
    
    // Update localStorage
    localStorage.setItem(name, JSON.stringify({ [name]: value }));
  };

  return (
    <Box sx={{ flex: 2, height: "100%" }}>
      <Paper elevation={0} sx={{
        padding: "14px 0px",
        height: "100%",
        borderRadius: '16px',
        backgroundColor: '#FFFFFF',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)',
      }}>
        <Box sx={{ px: '14px' }}>
            <SelectComponent
            id="EmployeeName"
            name="EmployeeName"
            label="Employee Name"
            value={companyInfo.EmployeeName}
            onChange={handleChange}
            options={EmployeeOptions}
            placeholder="Employee Name"
            labelSx={{ 
              fontWeight: 400, 
              fontSize: "14px", 
              color: "#707070",
              fontFamily: "Work Sans",
              paddingLeft: "10px",
              marginBottom: "10px" 
            }}
          />
          <SelectComponent
            id="okrYear"
            name="okrYear"
            label="OKR Year"
            value={companyInfo.okrYear}
            onChange={handleChange}
            options={yearOptions}
            placeholder="Select Year"
            labelSx={{ 
              fontWeight: 400, 
              fontSize: "14px", 
              color: "#707070",
              fontFamily: "Work Sans",
              paddingLeft: "10px",
              marginBottom: "10px" 
            }}
          />
          <SelectComponent
            id="okrPeriod"
            name="okrPeriod"
            label="OKR Period"
            value={companyInfo.okrPeriod}
            onChange={handleChange}
            options={periodOptions}
            placeholder="Select Period"
            labelSx={{ 
              fontWeight: 400, 
              fontSize: "14px", 
              color: "#707070",
              fontFamily: "Work Sans",
              paddingLeft: "10px",
              marginBottom: "10px" 
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default OKRCard1;