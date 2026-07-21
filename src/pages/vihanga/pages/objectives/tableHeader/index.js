import React from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Checkbox,
  ListItemIcon,
  ListItemText,
  Menu,
} from "@mui/material";
import {
  CloseOutlined as CrossIcon,
  FilterListOutlined as FilterIcon,
  SystemUpdateAltOutlined as ExportIcon,
  Search as SearchIcon,
  ArrowDownwardOutlined as ArrowDownwardOutlinedIcon,
} from "@mui/icons-material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CustomButton from '../../../components/Button/CustomButton'
import TuneIcon from '@mui/icons-material/Tune';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import s5icon1 from '../../../../../assets/svg/obs5iconr1.svg'
import s5icon2 from '../../../../../assets/svg/ods5calcicon.svg'
import s1icon from '../../../../../assets/svg/ods1icon.svg'
import { useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";


const TableHeader2 = ({
  stage,
  setStage,
  search,
  setSearch,
  selectedItems,
  setSelectedItems,
  menuItemsStage = [],
  menuItemsExportOptions = [],
  teamLeave = false,
}) => {
const {t} = useTranslation()
  const location = useLocation();

  const [exportAnchorEl, setExportAnchorEl] = React.useState(null);

  const handleClickExport = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleCloseExport = () => {
    setExportAnchorEl(null);
  };


  const handleCheckboxChange = (itemText) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemText)
        ? prevSelected.filter((text) => text !== itemText)
        : [...prevSelected, itemText]
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        padding: "0 1rem",
        alignItems: "center",
        marginBottom: "1.5rem solid red",
        width: "100%",
        margin: ".3rem 0px 1rem 0px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Button
          variant="outlined"
          startIcon={
            <TuneIcon
              sx={{
                width: 20,
                height: 20,
                verticalAlign: "middle",
              }}
            />
          }
          sx={{
            width: "151px",
            height: "34px",
            borderRadius: "100px",
            border: "1px solid #837F39",
            paddingX: "16px", // horizontal padding only
            gap: "8px",
            backgroundColor: "#FEFEFE",
            color: "#0E0E0E",
            fontFamily: "Work Sans",
            fontWeight: 600,
            fontSize: "12px",
            lineHeight: "100%",
            letterSpacing: "0%",
            textTransform: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // center contents properly
            whiteSpace: "nowrap", // THIS makes sure text won't wrap
          }}
        >
         {t("AbsenceTime.tableHeader.displayOptions")}
        </Button>

        {!location.pathname.includes("/previlages/team-leave") && (
          <>
            <span
              style={{
                fontSize: "16px",
                marginRight: "8px",
                fontWeight: "400",
                fontFamily: "Work Sans",
                color: "#0E0E0E",
                marginLeft: "20px",
              }}
            >
                {t("AbsenceTime.tableHeader.priority")}
            </span>
            <Select
              displayEmpty
              renderValue={(selected) => (selected ? selected : t("AbsenceTime.TeamLeave.all"))}
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              size="small"
              sx={{
                width: "70px",
                border: "1px solid #85803c",
                fontWeight: 700,
                maxHeight: "34px",
                color: "#0E0E0E",
                fontFamily: "Plus Jakarta Sans",
                fontSize: "12px",
                borderRadius: "5rem",
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: "1rem",
                    border: "1px solid #fff",
                    mt: 0.5,
                  },
                },
              }}
            >
              {menuItemsStage?.map((item, index) => (
                <MenuItem
                  key={index}
                  onClick={() => handleCheckboxChange(item.text)}
                >
                  <Checkbox
                    checked={selectedItems.includes(item.text)}
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<CheckCircleIcon />}
                    sx={{
                      color: "#85803c",
                      "&.Mui-checked": {
                        color: "#85803c",
                      },
                      "& .MuiSvgIcon-root": {
                        borderRadius: "50%",
                      },
                    }}
                  />
                  <ListItemText primary={item.text} />
                </MenuItem>
              ))}
            </Select>
          </>
        )}

        <span
          style={{
            fontSize: "16px",
            marginRight: "8px",
            fontWeight: "400",
            fontFamily: "Work Sans",
            color: "#0E0E0E",
            marginLeft: "20px",
          }}
        >
           {t("AbsenceTime.tableHeader.status")}
        </span>
        <Select
          displayEmpty
          renderValue={(selected) => (selected ? selected : t("AbsenceTime.TeamLeave.all"))}
          value={stage || t("AbsenceTime.TeamLeave.all")}
          onChange={(e) => setStage(e.target.value)}
          size="small"
          sx={{
            width: "70px",
            border: "1px solid #85803c",
            fontWeight: 700,
            maxHeight: "34px",
            color: "#0E0E0E",
            fontFamily: "Plus Jakarta Sans",
            fontSize: "12px",

            borderRadius: "5rem",
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                borderRadius: "1rem",
                border: "1px solid #fff",
                mt: 0.5,
              },
            },
          }}
        >
          {menuItemsStage?.map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => handleCheckboxChange(item.text)}
            >
              <Checkbox
                checked={selectedItems.includes(item.text)}
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={<CheckCircleIcon />}
                sx={{
                  color: "#85803c",
                  "&.Mui-checked": {
                    color: "#85803c",
                  },
                  "& .MuiSvgIcon-root": {
                    borderRadius: "50%",
                  },
                }}
              />
              <ListItemText primary={item.text} />
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {teamLeave ? (
          <>
            <CustomButton
              iconPosition="start"
              iconExists={true}
              onClick={handleClickExport}
              IconProp={ExportIcon}
              key={"export"}
              text={t("TimeLogin.exportOptions.export")}
              variant={"outlined"}
              color={"#000"}
              sx={{
                margin: "0 0 .3rem .5rem",
                fontWeight: 550,
                border: "1px solid #85803c",
                borderRadius: "5rem",
                maxHeight: "34px",
              }}
            />
            <Menu
              anchorEl={exportAnchorEl}
              open={Boolean(exportAnchorEl)}
              onClose={handleCloseExport}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              sx={{ boxShadow: "none", border: "1px solid #ddd" }}
              PaperProps={{
                sx: {
                  borderRadius: "1rem",
                  border: "1px solid #fff",
                  mt: 0.5,
                },
              }}
            >
              {menuItemsExportOptions?.map((item, index) => (
                <MenuItem key={index} onClick={handleCloseExport}>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <img src={item?.icon} alt="Edit" width="18" height="18" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      color: "#6D6D6D",
                      fontWeight: "500",
                      fontSize: "14px",
                      letterSpacing: "1%",
                    }}
                  />
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <>
            <TextField
              placeholder="Search here.."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                minWidth: "294px",
                border: "1px solid #837F39",
                padding: " .3rem",
                borderRadius: "5rem",
                "& fieldset": { border: "none" },
                maxHeight: "34px",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#85803c" }} />
                  </InputAdornment>
                ),
                sx: {
                  outline: "none",
                  boxShadow: "none",
                  "& input": {
                    padding: 0,
                  },
                },
              }}
            />
            <Box
              sx={{
                display: "flex",
                width: "80px",
                height: "40px",
                borderRadius: "16px",
                overflow: "hidden",
                border: "2px solid #88812D",
              }}
            >
              {/* Left Side - List Icon */}
              <Box
                sx={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#FFFFFF",
                  borderTopLeftRadius: "9.14px",
                  borderBottomLeftRadius: "9.14px",
                  borderTop: "1.14px solid #837F39",
                  borderBottom: "1.14px solid #837F39",
                  borderLeft: "1.14px solid #837F39",
                  color: "#FEFEFE",
                }}
              >
                <img
                  src={s5icon1}
                  style={{ width: "23px", height: "23px" }}
                  alt="icon1"
                />
              </Box>
              {/* Right Side - Calendar Icon */}
              <Box
                sx={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#837F39",
                  border: "1.14px solid #837F39",
                  borderTopRightRadius: "9.14px",
                  borderBottomRightRadius: "9.14px",
                }}
              >
                <img
                  src={s5icon2}
                  style={{ width: "40px", height: "40px" }}
                  alt="icon2"
                />
              </Box>
            </Box>
            <CustomButton
              iconPosition="start"
              iconExists={true}
              onClick={handleClickExport}
              IconProp={ExportIcon}
              key={"export"}
              text={"Export"}
              variant={"outlined"}
              color={"#000"}
              sx={{
                margin: "0 0 .3rem .5rem",
                fontWeight: 550,
                border: "1px solid #85803c",
                borderRadius: "5rem",
                maxHeight: "34px",
              }}
            />
            <Menu
              anchorEl={exportAnchorEl}
              open={Boolean(exportAnchorEl)}
              onClose={handleCloseExport}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              sx={{ boxShadow: "none", border: "1px solid #ddd" }}
              PaperProps={{
                sx: {
                  borderRadius: "1rem",
                  border: "1px solid #fff",
                  mt: 0.5,
                },
              }}
            >
              {menuItemsExportOptions?.map((item, index) => (
                <MenuItem key={index} onClick={handleCloseExport}>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <img src={item?.icon} alt="Edit" width="18" height="18" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      color: "#6D6D6D",
                      fontWeight: "500",
                      fontSize: "14px",
                      letterSpacing: "1%",
                    }}
                  />
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </Box>
    </Box>
  );
};

export default TableHeader2;