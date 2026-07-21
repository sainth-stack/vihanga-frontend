// employeeDetailsCard.js (OKRCard component)
import React, { useEffect, useState } from 'react';
import { Box, Paper } from '@mui/material';
import { SelectComponent } from '../../../../components/input-elements/select';
import { AuthRole } from "utilities";
import axios from 'axios';
import { appURL } from 'utilities/baseurl';
import { useTranslation } from 'react-i18next';

const OKRCard = ({ companyInfo, setCompanyInfo }) => {
  const { t } = useTranslation();
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const selectedTab = (JSON.parse(localStorage.getItem("selectedTab"))?.tab) || "me";
  const user = JSON.parse(localStorage.getItem("user")) || null;

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
  { key: "2031", label: "2031", value: "2031" },
  ];

  // Fetch employees data
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const raw = localStorage.getItem("companyId");
        const companyId = raw ? JSON.parse(raw) : null;

        if (companyId) {
          const response = await axios.get(`${appURL}/employees/getEmployees/${companyId}`);
          const employees = response?.data?.data || [];

          const self = employees.find(e => e?._id === user?._id);
          const userDept = self?.employmentInformation?.department;
          const isFunctionalHead = (self?.employmentInformation?.departmentHead === "Yes");
          const userFullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
          const filteredEmployees = employees.filter(emp => {
            if(selectedTab === "me"){
              return emp._id === user?._id;
            } else if(selectedTab==='myteam'){
              const lm = emp?.employmentInformation?.lineManager;
              const lmStr = lm && lm._id ? lm._id.toString() : (lm || '').toString();
              const userIdStr = (user?._id || '').toString();
              return lmStr === userIdStr;
            } else if(selectedTab==='myfunction'){
              return userDept && emp?.employmentInformation?.department === userDept;
            } else if(selectedTab=='mycompany'){
              return emp?.companyId==user?.companyId
            }
            return false;
          });

          // Add "All" option for myteam, myfunction and mycompany tabs
          const options = [
            ...(selectedTab === 'myteam' || selectedTab === 'myfunction' || selectedTab === 'mycompany' ? [{
              key: 'all',
              label: 'All',
              value: 'all',
              employeeNumber: ''
            }] : []),
            ...filteredEmployees?.map(emp => ({
              key: emp._id,
              label: `${emp.personalInformation?.firstName} ${emp.personalInformation?.lastName}`.trim(),
              value: emp._id, // Use employee ID for API calls
              employeeNumber: emp?.employmentInformation?.employeeNumber || "",
            }))
          ];
          
          setEmployeeOptions(options);

          // Default selection handling:
          // - For team/function/company: default to "all"
          // - For 'me': default to current user
          if (selectedTab) {
            let defaultEmployeeId = user?._id;
            if (selectedTab === 'myteam' || selectedTab === 'myfunction' || selectedTab === 'mycompany') {
              defaultEmployeeId = 'all';
            }
            const updatedInfo = { ...companyInfo, employeeId: defaultEmployeeId };
            setCompanyInfo(updatedInfo);
            localStorage.setItem('employeeId', JSON.stringify({ employeeId: defaultEmployeeId }));
          }
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

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
            id="okrYear"
            name="okrYear"
            label={t("OKRCard.OKRYear")}
            value={companyInfo.okrYear}
            onChange={handleChange}
            options={yearOptions}
            placeholder={t("OKRCard.SelectYear")}
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
            id="employeeId"
            name="employeeId"
            label={t("OKRCard.Employee")}
            value={companyInfo.employeeId}
            onChange={handleChange}
            options={employeeOptions}
            placeholder={t("OKRCard.SelectEmployee")}
            disabled={loading}
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

export default OKRCard;