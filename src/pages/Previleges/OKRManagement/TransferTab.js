import PopupTransferOKR from 'pages/Objectives/PopupTransferKRs';
import useGetEmployees from 'pages/Objectives/hooks/useGetEmployees';
import React, { useEffect, useState } from 'react';
import { SelectComponent } from '../../vihanga/components/input-elements/select';
import { Button, Box, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { canEdit } from 'utilities/privilegeHelper';

export default function TransferTab() {
  let companyObj = {
    fromEmployeeName: "",
    toEmployeeName: "",
    role: "",
    employeeName: ""
  };
  
  const [companyInfo, setCompanyInfo] = useState(companyObj);
  const { data: employeeResponse, message, success, isLoading } = useGetEmployees();
  const [empData, setEmpData] = useState([]);
  const [showOKRs, setShowOkrs] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoading && employeeResponse?.data?.length > 0) {
      const employeeData = employeeResponse.data.map((item) => ({
        key: `${item.personalInformation.firstName} ${item.personalInformation.lastName}`,
        value: item._id,
        role: item.employmentInformation.role,
      }));
      setEmpData(employeeData);
    }
  }, [isLoading, employeeResponse]);

  const handleChange = (e) => {
    console.log(e,';dfsfkjdnfsdf')
    const updatedValue = e.target.value;
    const name = e.target.name;

    const updatedCompanyInfo = {
      ...companyInfo,
      [name]: updatedValue,
      role:
        name === "fromEmployeeName"
          ? empData.find((item) => item.value === updatedValue)?.role || companyInfo.role
          : companyInfo.role,
      employeeName:
        name === "toEmployeeName"
          ? empData.find((item) => item.value === updatedValue)?.key || companyInfo.employeeName
          : companyInfo.employeeName,
    };

    setCompanyInfo(updatedCompanyInfo);
    setShowOkrs(false);
  };

  return (
    <Box sx={{ px: 3, py: 4 }}>
      <Grid container spacing={3}>
        {/* Transfer From Employee */}
        <Grid item xs={12} md={12} lg={12}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ minWidth: '200px' }}>{ t("OKRManagement.TransferFromEmployee")}</Typography>
            <SelectComponent
              placeholder="--Select--"
              name="fromEmployeeName"
              id="fromEmployeeName"
              options={empData.filter(item => item.value !== companyInfo.toEmployeeName)}
              value={companyInfo.fromEmployeeName}
              onChange={handleChange}
              label=""
              sx={{ flex: 1 }}
            />
          </Box>
        </Grid>

        {/* Transfer To Employee */}
        <Grid item xs={12} md={12} lg={12}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ minWidth: '200px' }}>{ t("OKRManagement.TransferToEmployee")}</Typography>
            <SelectComponent
              placeholder="--Select--"
              name="toEmployeeName"
              id="toEmployeeName"
              options={empData.filter(item => item.value !== companyInfo.fromEmployeeName)}
              value={companyInfo.toEmployeeName}
              onChange={handleChange}
              label=""
              sx={{ flex: 1 }}
            />
          </Box>
        </Grid>

        {/* Find OKR Button */}
        {canEdit() && (
          <Grid item xs={12} md={12}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
              <Button
                sx={{
                  backgroundColor: "#88823B",
                  color: "#fff",
                  borderRadius: "100px",
                  textTransform: "none",
                  fontWeight: 500,
                  px: 3,
                  py: 1,
                  "&:hover": {
                    backgroundColor: "#6f6a2f",
                  },
                }}
                onClick={() => {
                  setShowOkrs(!showOKRs);
                  setTimeout(() => {
                    setShowOkrs(!showOKRs);
                  }, 500);
                }}
              >
               { t("OKRManagement.FindOkr")}
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>

      {showOKRs && <PopupTransferOKR companyObj={companyInfo} />}
    </Box>
  );
}
