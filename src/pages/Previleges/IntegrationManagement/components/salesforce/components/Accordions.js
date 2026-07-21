import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Typography, Switch } from "@mui/material";
import { useHistory } from "react-router-dom"
import "../index.scss";
import { updateKPI } from "service/integrationapis";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Toast } from "service/toast";

export default function Accordions({ kpis }) {
  const history = useHistory();
  const queryClient = useQueryClient();

  const handleNavigate = (id) => {
    history.push(`/admin/previlages/integrationManagement/salesforce/setup/${id}/kpiquery`)
  }

  const updateKpiMutation = useMutation({
    mutationFn: (data) => updateKPI(data.id, { enabled: data.checked }),
    onSuccess: () => {
      queryClient.invalidateQueries(['kpis']);
      Toast({ message: "KPI status updated successfully!", type: "success" });

    },
    onError: (error) => {
      console.error('Error updating KPI status:', error);
    }
  });

  const handleSwitch = (id, checked) => {
    updateKpiMutation.mutate({ id, checked });
  };

  return (
    <div>
      {kpis &&
        kpis.map((kpi, index) => (
          <Accordion defaultExpanded key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              sx={{
                textTransform: "capitalize",
              }}
            >
              {kpi.accordionTitle}
            </AccordionSummary>
            <AccordionDetails
              sx={{
                padding: "15px",
              }}
              className="kpis-cards"
            >
              {kpi.kpiList &&
                kpi.kpiList.map((list, index) => (
                  <div className="p-3 border border-light-secondary">
                    <div className="d-flex border-round justify-content-between align-items-center">
                      <Typography sx={{ fontWeight: "bold", cursor: "pointer" }} onClick={() => handleNavigate(list.id)}>
                        {list.title}
                      </Typography>
                      <Switch
                        {...{
                          checked: list.checked,
                          onChange: (e) => handleSwitch(list.id, e.target.checked),
                          sx: {
                            ".MuiSwitch-switchBase": {
                              padding: "0px",
                              transform:
                                "translateX(10px) translateY(8px) !important",
                            },
                            ".Mui-checked": {
                              transform:
                                "translateX(25px) translateY(8px) !important",
                            },
                          },
                        }}
                      />
                    </div>
                    <Typography
                      sx={{
                        fontSize: "12px",
                      }}
                      className="text-secondary"
                    >{list.description}</Typography>
                  </div>
                ))}
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );
}
