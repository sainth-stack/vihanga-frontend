import React,{useState} from "react";

import { Typography, Box,Button,Grid, Checkbox, FormControlLabel  } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { InputTextComponent } from "../../../../components/input-elements/text";
import { SelectComponent } from "../../../../components/input-elements/select";
import FileUploadCustom from "pages/vihanga/components/filesUplode/draganddropFile";
import LeaveCards from '../applyforLeave/cardsTopSection'
import LeaveTable from "../leaveHistory";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import { getThemeColors } from "utilities/getThemeColors";
const ApplyforLeaveDemo = () => {


    const [resumeFile, setResumeFile] = useState(null);
      const [existingPhoto, setExistingPhoto] = useState("");
      const [existingResume, setExistingResume] = useState("");
const companyId = getItemFromLocalStorage("companyId");

  const { primaryColor, secondaryColors } = getThemeColors();
    const [formData, setFormData] = useState({
        absenceType: "",
        fromDate: "",
        toDate: "",
        duration: "",
        note: "",
        halfDay: false,
      });
    
      const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        }));
      };
    
      const absenceOptions = [
        { label: "Sick", value: "sick" },
        { label: "Casual", value: "casual" },
        { label: "Vacation", value: "vacation" },
      ];
    
      const durationOptions = [
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
      ];


      const handleResumeUpload = (file) => {
        setResumeFile(file?.file || file);
        setExistingResume("");
      };
    
    

    return (
      <Box bgcolor={secondaryColors.white}>
        <Box bgcolor={secondaryColors.white}>
          <LeaveCards />
        </Box>
        <Box sx={{paddingBottom:"70px"}}>
           <Box sx={{padding:"30px"}}>

           <Typography
                sx={{
                    fontFamily: `"Work Sans", sans-serif`,
                    fontSize: "24px",
                    fontWeight: 500,
                    color: "#837E3B",        // Olive green
                    textDecoration: "underline",
                    textUnderlineOffset: "1px", // Optional: spacing between text and underline
                    display:"flex",
                    justifyContent:"flex-end",
                    padidngRight:"50px",
                }}
            >
                Apply Leave
            </Typography>

            <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "8px 5px",
      }}
    >
      <Typography
        sx={{
          fontSize: "32px",
          fontWeight: "600",
          fontFamily: `"Montserrat"`,
          color:"#0E0E0E"
        }}
      >
        Apply for leave
      </Typography>

      <Button
        variant="contained"
        sx={{
          backgroundColor: "#837E3B",
          borderRadius: "20px",
          padding: "8px 16px",
          textTransform: "none",
          fontWeight: 500,
          fontFamily: `"Work Sans"`,
          fontSize:"20px",
          "&:hover": {
            backgroundColor: "#6f6b2f",
          },
        }}
        endIcon={<CalendarMonthIcon />}
      >
        Team Leave
      </Button>
    </Box>


   <Grid container spacing={2}>
      <Grid item xs={12} md={6}>         
        <SelectComponent
          id="absenceType"
          label="Absence type / Category"
          value={formData.absenceType}
          onChange={handleChange}
          options={absenceOptions}
        />
      </Grid>

      <Grid item xs={12} md={6} display="flex" alignItems="center">
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.halfDay}
              onChange={handleChange}
              name="halfDay"
            />
          }
          label="Half day"
          sx={{ fontFamily: "Work Sans" }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <InputTextComponent
          id="fromDate"
          label="From"
          type="date"
          value={formData.fromDate}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <InputTextComponent
          id="toDate"
          label="To"
          type="date"
          value={formData.toDate}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <SelectComponent
          id="duration"
          label="Duration of absence"
          value={formData.duration}
          onChange={handleChange}
          options={durationOptions}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <InputTextComponent
          id="note"
          name='note'            
          label="Note"
          type="text"
          value={formData.note}
          
          onChange={handleChange}
          placeholder="Enter a description..."
          multiline={true}       // ✅ Add this prop
          minRows={5}             // ✅ Optional: set number of visible rows
          sx={{
            "& .MuiOutlinedInput-root": {
              height: "100px !important",
              alignItems: "flex-start",
            },
          }}
        />
      </Grid>
    </Grid>

   <Box sx={{ marginBottom: "8px",marginTop:"50px" }}>
  <Typography
    sx={{
      fontWeight: 600,
      fontSize: "24px",
      fontFamily: "Montserrat",
      marginBottom: "4px",
      color:"#000000"
    }}
  >
    Upload attachments
  </Typography>

  <FileUploadCustom
    id="leave-attachment-upload1"
    onFileUpload={handleResumeUpload}
    file={resumeFile}
    hideLabel // Optional: Add this to suppress internal label
  />
</Box>
                <Box display="flex" justifyContent="flex-end" gap={2} mt={4} mb={2}>
                   <Button type="submit" variant="contained" sx={{backgroundColor:"#837F39",color:"#FFFFFF",fontFamily:"Work Sans",fontWeight:"500",borderRadius:"20px"}}>submit
                   </Button>
                   <Button variant="contained"  sx={{backgroundColor:"#FFFFFF",color:"#847F3B",fontFamily:"Work Sans",fontWeight:"500",borderRadius:"20px"}} >
                     Cancel
                   </Button>                </Box>

            
`
```           <Box sx={{ paddingBottom: "70px", margin: "1rem", bgcolor: secondaryColors.white, padding: "2rem", borderRadius: "1.5rem", boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)", 
            }} >
            <LeaveTable/>
              
              </Box>

            </Box>



        </Box>

      </Box>
        
    )
}

export default ApplyforLeaveDemo
