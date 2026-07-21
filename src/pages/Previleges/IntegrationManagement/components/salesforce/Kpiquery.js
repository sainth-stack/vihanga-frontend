import React, { useState } from "react";
import AceEditor from "react-ace";
import {
  Typography,
  Grid,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CreateKpiForm from "./components/CreateKpiForm";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-twilight"; // Dark theme
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useHistory, useParams } from "react-router-dom"
import { getKPIById, querySalesforce, updateKPI } from 'service/integrationapis'; // Assuming this is your API function
import { Toast } from "service/toast";

const getItem = () => {
  const userDetails = JSON.parse(localStorage.getItem('user'));
  return userDetails.email;
}

const generateTimeFrames = () => {
  const quarters = [
    {
      id: 'q1',
      label: 'Current Quarter',
      text: 'CreatedDate = THIS_FISCAL_QUARTER'
    },
    {
      id: 'q2',
      label: 'Last Quarter',
      text: 'CreatedDate = LAST_FISCAL_QUARTER'
    },
    {
      id: 'q3',
      label: 'Last 2 Quarters',
      text: 'CreatedDate = LAST_N_FISCAL_QUARTERS:2'
    },
    {
      id: 'q4',
      label: 'This Quarter & Last Quarter',
      text: 'CreatedDate >= LAST_FISCAL_QUARTER AND CreatedDate <= THIS_FISCAL_QUARTER'
    },
    {
      id: 'q5',
      label: 'This Quarter & Last 3 Quarters',
      text: 'CreatedDate >= LAST_N_FISCAL_QUARTERS:3 AND CreatedDate <= THIS_FISCAL_QUARTER'
    },
    {
      id: 'q6',
      label: 'This Quarter & Next Quarter',
      text: 'CreatedDate >= THIS_FISCAL_QUARTER AND CreatedDate <= NEXT_FISCAL_QUARTER'
    }
  ];

  const months = [
    {
      id: 'm1',
      label: 'Current Month',
      text: 'CreatedDate = THIS_MONTH'
    },
    {
      id: 'm2',
      label: 'Last Month',
      text: 'CreatedDate = LAST_MONTH'
    },
    {
      id: 'm3',
      label: 'Last 2 Months',
      text: 'CreatedDate = LAST_N_MONTHS:2'
    },
    {
      id: 'm4',
      label: 'This Month & Last Month',
      text: 'CreatedDate >= LAST_MONTH AND CreatedDate <= THIS_MONTH'
    },
    {
      id: 'm5',
      label: 'This Month & Last 3 Months',
      text: 'CreatedDate >= LAST_N_MONTHS:3 AND CreatedDate <= THIS_MONTH'
    },
    {
      id: 'm6',
      label: 'This Month & Next Month',
      text: 'CreatedDate >= THIS_MONTH AND CreatedDate <= NEXT_MONTH'
    }
  ];

  const weeks = [
    {
      id: 'w1',
      label: 'Current Week',
      text: 'CreatedDate = THIS_WEEK'
    },
    {
      id: 'w2',
      label: 'Last Week',
      text: 'CreatedDate = LAST_WEEK'
    },
    {
      id: 'w3',
      label: 'Last 2 Weeks',
      text: 'CreatedDate = LAST_N_WEEKS:2'
    },
    {
      id: 'w4',
      label: 'This Week & Last Week',
      text: 'CreatedDate >= LAST_WEEK AND CreatedDate <= THIS_WEEK'
    },
    {
      id: 'w5',
      label: 'This Week & Last 3 Weeks',
      text: 'CreatedDate >= LAST_N_WEEKS:3 AND CreatedDate <= THIS_WEEK'
    },
    {
      id: 'w6',
      label: 'This Week & Next Week',
      text: 'CreatedDate >= THIS_WEEK AND CreatedDate <= NEXT_WEEK'
    }
  ];

  return { quarters, months, weeks };
};

const Kpiquery = () => {
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(1);
  const handleTabChange = (_, newValue) => setTabValue(newValue);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const { id } = useParams(); // Get ID from URL params
  const handleListItemClick = (event, index, text) => {
    setSelectedIndex(index);
    setQuery(prevQuery => {
      if (!prevQuery.includes('WHERE')) {
        return `${prevQuery} WHERE ${text}`;
      }
      return `${prevQuery} AND ${text}`;
    });
    setIsQueryModified(true);
  };

  // Add React Query hook (you can move this where needed)
  const { data: kpiData, isLoading } = useQuery({
    queryKey: ['kpi', id],
    queryFn: () => getKPIById(id),
    enabled: !!id
  });

  // Mutation for testing query
  const testQueryMutation = useMutation({
    mutationFn: (query) => querySalesforce({ query }),
    onSuccess: (data) => {
      if (data?.data?.totalSize === 0) {
        Toast({ message: "Query returned no results!", type: "success" });
      }
      setOpenDialog(true);
    },
    onError: (error) => {
      Toast({ message: error.message || "Failed to test query", type: "error" });
    }
  });

  // Mutation for updating KPI
  const updateKpiMutation = useMutation({
    mutationFn: (query) => updateKPI(id, { query }),
    onSuccess: () => {
      setOpenDialog(false);
      setIsQueryModified(false);
      queryClient.invalidateQueries(['kpi', id]);
      Toast({ message: "KPI query saved successfully!", type: "success" });
    },
    onError: (error) => {
      Toast({ message: error.message || "Failed to save query", type: "error" });
    }
  });

  // Update query when kpiData is loaded
  React.useEffect(() => {
    if (kpiData?.query) {
      setQuery(kpiData.query);
    }
  }, [kpiData]);

  const handleQueryChange = (newValue) => {
    setQuery(newValue);
    setIsQueryModified(true);
  };

  const handleTestAndSave = () => {
    testQueryMutation.mutate(query);
  };

  const handleSaveQuery = () => {
    updateKpiMutation.mutate(query);
  };

  const [query, setQuery] = useState("");
  const [isQueryModified, setIsQueryModified] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const { quarters, months, weeks } = generateTimeFrames();
  const userEmail = getItem(); // Get email from local storage

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <Grid
      container
      display="flex"
      flexDirection="column"
      sx={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Edit Salesforce KPI: No of Leads created
      </Typography>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="Measurement Type Tabs"
      >
        <Tab label="Overview" />
        <Tab label="KPI Query" />
      </Tabs>

      {tabValue === 0 ? (
        <CreateKpiForm kpiquery={true} />
      ) : (
        <Grid container spacing={2} mt={2}>
          <Grid item md={7}>
            <AceEditor
              mode="javascript"
              theme="twilight" // Dark theme for the editor
              name="ace-editor-demo"
              editorProps={{ $blockScrolling: true }}
              value={query}
              onChange={handleQueryChange}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
                wrapEnabled: true, // Enable line wrapping
              }}
              style={{
                width: "100%",
                height: "400px",
                border: "1px solid #555",
                borderRadius: "4px",
              }}
              wrapEnabled={true}
              width={"100%"}
              fontSize={18}
            />

            <Grid item display={"flex"} justifyContent={"end"} mt={2}>
              {isQueryModified && <Typography>Changes Pending ...</Typography>}
              <Button 
                variant="outlined" 
                color="primary"
                disabled={!isQueryModified || testQueryMutation.isPending}
                onClick={handleTestAndSave}
              >
                {testQueryMutation.isPending ? 'Testing...' : 'Test and Save'}
              </Button>
            </Grid>
          </Grid>

          <Grid item md={5}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                padding: "20px",
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
              }}
            >
              {[
                {
                  label: "User",
                  items: [{ 
                    id: 'userEmail', 
                    label: "User Email",
                    text: `CreatedBy.Email = '${userEmail}'` 
                  }]
                },
                {
                  label: "Quarter",
                  items: quarters
                },
                {
                  label: "Month",
                  items: months
                },
                {
                  label: "Week",
                  items: weeks
                }
              ].map((section, index) => (
                <Accordion key={index} sx={{ backgroundColor: "#f5f5f5" }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                  >
                    <Typography>{section.label}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List component="nav" aria-label={`${section.label.toLowerCase()}-options`}>
                      {section.items.map((item) => (
                        <ListItemButton
                          key={item.id}
                          selected={selectedIndex === item.id}
                          onClick={(event) => handleListItemClick(event, item.id, item.text)}
                        >
                          <ListItemText primary={item.label} />
                        </ListItemButton>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </Grid>
        </Grid>
      )}

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center'
          }
        }}
      >
        <DialogTitle>Query Test Results</DialogTitle>
        <DialogContent>
          <p>Count</p>
          <pre>{JSON.stringify(testQueryMutation?.data?.data?.totalSize || 0, null, 2)}</pre>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)}
            disabled={updateKpiMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveQuery}
            color="primary"
            disabled={updateKpiMutation.isPending}
          >
            {updateKpiMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Kpiquery;