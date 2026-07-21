import React, { useState, useEffect } from "react";
import CardWrapper from "../CardWrapper";
import "../auth/index.scss";
import salesforce from "assets/images/saleforce.png";
import TopHeader from "./components/TopHeader";
import "./index.scss";
import { Typography, Drawer } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MultipleSelectCheckmarks from "./components/MultiSelect";
import Accordions from "./components/Accordions";
import CreateKpiForm from "./components/CreateKpiForm";
import { getKPIs } from "service/integrationapis";
import { useQuery } from "@tanstack/react-query";

const sampleKpis = [
  {
    accordionTitle: "Leads",
    kpiList: [
      {
        title: "# of converted leads",
        checked: true,
        description:
          "Calculates how many leads have been converted into opportunities",
      },
      {
        title: "No of Leads created",
        checked: true,
        description: "This KPI presents an absolute number of leads created",
      },
    ],
  },
  {
    accordionTitle: "Opportunities",
    kpiList: [
      {
        title: "# of closed won opportunities",
        checked: true,
        description:
          "Calculates how many opportunities have been won in a selected period",
      },
      {
        title: "# of dormant opportunities this week",
        checked: true,
        description:
          "Calculates the number of dormant opportunities that has been left",
      },
      {
        title: "Total sales amount",
        checked: true,
        description:
          "Calculated total amount that has been closed won opportunites",
      },
    ],
  },
  {
    accordionTitle: "Others",
    kpiList: [
      {
        title: "# of converted leads",
        checked: true,
        description:
          "Calculates how many leads have been converted into opportunities",
      },
    ],
  },
];

const Kpis = () => {
  const [ isOpen, setIsOpen ] = useState(false);
  const [ userInfo, setUserInfo ] = useState(null);
  const [ kpis, setKpis ] = useState([]);
  const [status, setStatus] = useState(true);

  const {data: listOfKpis, isLoading: isLoadingKpis} = useQuery({
    queryKey: ['kpis', status],
    queryFn: () => getKPIs(status),
 
  })
  useEffect(() => {
    if (listOfKpis) {
      console.log("listOfKpis", listOfKpis);
      // Group KPIs by subCategory
      const groupedKpis = listOfKpis?.data?.reduce((acc, kpi) => {
        const subCategory = kpi.subCategory;
        if (!acc[subCategory]) {
          acc[subCategory] = {
            accordionTitle: subCategory,
            kpiList: []
          };
        }
        acc[subCategory].kpiList.push({
          id: kpi._id,
          title: kpi.name,
          checked: kpi.enabled,
          description: kpi.description
        });
        return acc;
      }, {});

      // Convert grouped object to array format matching original kpis structure
      const formattedKpis = Object.values(groupedKpis);
      console.log("formattedKpis", formattedKpis);
      setKpis(formattedKpis);
    }
  }, [listOfKpis,status]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('salesforce_user'));
    setUserInfo(userInfo);
  }, []);

  const handleCreateKpi = (isCreate) => {
    setIsOpen(true);
  }
  
  return (
    <>
      <div className="bg-light-primary rounded-12 mh-100 p-4 m-4">
        <CardWrapper>
          <TopHeader
            {...{
              image: salesforce,
              isDeleteBtn: true,
            }}
          />
          <div className="main-div">
            <div className="div-top">
              <div className="d-flex align-items-center">
                <Typography>KPIs</Typography>
                <button onClick={() => handleCreateKpi(true)} className="ml-2 btn-primary btn d-flex align-items-center create-kpi-btn">
                  <AddIcon sx={{ fontSize: "1rem", marginRight: "2px" }} />{" "}
                  Create KPI
                </button>
              </div>
              <MultipleSelectCheckmarks {...{ status, setStatus }} />
            </div>
            <div className="mt-3">
              <Accordions {...{ kpis }} />
            </div>
          </div>
        </CardWrapper>
      </div>
      <Drawer
        anchor={'right'}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '50vw',  // Sets the drawer to 50% of the viewport width
          },
        }}
      >
        <CreateKpiForm 
          {...{
            setIsOpen
          }}
        />
      </Drawer>
    </>
  );
};

export default Kpis;
