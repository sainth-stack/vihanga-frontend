import React, { useState, useEffect } from "react";
import { Card, Box } from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next"; // ✅ Import translation hook

import Card1 from "./bodySection/card1";
import Card2 from "./bodySection/card2";
import Card3 from "./bodySection/card3";
import Card4 from "./bodySection/card4";
import Card5 from "./bodySection/card5";
import Card6 from "./bodySection/card6";
import SelectedApproversCard from "./bodySection/card7";
import UserList from "./bodySection/UserList";
import FormNavigationButtons from "./components/fotterBottom";

const SelectCard = ({
  selected,
  workflowDetails,
  approvalChain,
  step = 0,
  isEdit,
  workflowId,
  activeTab,
  searchTerm
}) => {
  const { t } = useTranslation(); // ✅ useTranslation initialized
  const history = useHistory();
  const location = useLocation();

  // Initialize approvers with approvalChain data for the current step
  const [approvers, setApprovers] = useState(() => {
    const existingApprovers = approvalChain || {};
    return {
      ...existingApprovers,
      [step.toString()]: existingApprovers[step.toString()] || [],
    };
  });

  // Update approvers when step changes
  useEffect(() => {
    setApprovers((prev) => ({
      ...prev,
      [step.toString()]: prev[step.toString()] || [],
    }));
  }, [step]);

  const handleSelect = (cardData, isSelected) => {
    const currentStep = step.toString();
    setApprovers((prev) => {
      const updated = { ...prev };
      if (isSelected) {
        updated[currentStep] = [...(updated[currentStep] || []), cardData];
      } else {
        updated[currentStep] = (updated[currentStep] || []).filter(
          (item) => item.id !== cardData.id
        );
      }
      return updated;
    });
  };

  const handlePrevious = () => {
    history.push({
      pathname: "/admin/approval",
      state: {
        selected,
        workflowDetails,
        approvalChain: approvers,
        step,
        fromAddApproval: true,
        isEdit,
        workflowId,
      },
    });
  };

  const handleCancel = () => {
    history.push({
      pathname: "/admin/approval",
      state: {
        selected,
        workflowDetails,
        approvalChain: approvalChain || {},
        step,
        fromAddApproval: true,
        isEdit,
        workflowId,
      },
    });
  };

  const handleSubmit = () => {
    history.push({
      pathname: "/admin/approval",
      state: {
        selected,
        workflowDetails,
        approvalChain: approvers,
        step: step + 1,
        fromAddApproval: true,
        isEdit,
        workflowId,
      },
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Card
        sx={{
          borderRadius: "20px",
          p: 2,
          boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        }}
      >
        <Box display="flex" flexDirection="column" gap={3}>
          {activeTab === 'user' ? (
            <UserList
              onSelect={handleSelect}
              selectedApprovers={approvers[step.toString()] || []}
              searchTerm={searchTerm}
            />
          ) : (
            [Card1, Card2, Card3, Card4, Card5, Card6].map(
              (CardComponent, index) => (
                <Card
                  key={index}
                  sx={{
                    borderRadius: "20px",
                    p: 1,
                    border: "1px solid #eee",
                    boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
                  }}
                >
                  <CardComponent
                    onSelect={handleSelect}
                    selectedApprovers={approvers[step.toString()] || []}
                  />
                </Card>
              )
            )
          )}
        </Box>

        <SelectedApproversCard
          approvers={approvers[step.toString()] || []}
          onSave={handleSubmit}
          onCancel={handleCancel}
        />

        <FormNavigationButtons
          onPrevious={handlePrevious}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          submitText={t("approval.saveApprovers")} // ✅ Translated text here
        />
      </Card>
    </Box>
  );
};

export default SelectCard;
