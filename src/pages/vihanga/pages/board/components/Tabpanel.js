import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

export function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="fullWidth"
          TabIndicatorProps={{
            style: {
              height: "4px",
              backgroundColor: "rgba(131, 127, 57, 1)",
            },
          }}
        >
          {[0, 1].map((i) => (
            <Tab
              key={i}
              label={i === 0 ? "Company" : "OKR"}
              {...a11yProps(i)}
              sx={{
                color: "black",
                borderBottom:
                  value === i
                    ? "4px solid rgba(131, 127, 57, 1)"
                    : "4px solid rgba(235, 233, 201, 1)",
              }}
            />
          ))}
        </Tabs>
      </Box>
    </Box>
  );
}
