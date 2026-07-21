import { Toast } from "service/toast";

export const handleSureDelete = (selectedUsers, setOrderModalShow3) => {
  if (selectedUsers.length > 0) {
    setOrderModalShow3(true);
  } else {
    Toast({ message: "Please Select Users", type: "warning", time: 4000 });
  }
};

export const handleCascade = (setMultipleObjectives, selectedUsers, setObjectiveId, setOrderModalShow4, setSelectedObjective) => {

  
  // Filter out key results and keep only objectives
  const filteredObjectives = selectedUsers.filter((user) => {
    const isObjective = user.type === "objective" || user.type === "Objective";
    return isObjective;
  });
  
  if (filteredObjectives.length === 0) {
    Toast({ message: "Please Select Objectives (not Key Results)", type: "warning", time: 4000 });
    return;
  }
  
  if (filteredObjectives.length === 1) {
    // Single objective selected
    setMultipleObjectives(false);
    const selectedObjective = filteredObjectives[0];
    const objectiveData = {
      objectiveId: selectedObjective.id || selectedObjective._id,
      weight: selectedObjective.weight || 0
    };
    setSelectedObjective(objectiveData);
  } else {
    // Multiple objectives selected
    setMultipleObjectives(true);
    const selectedObjectivesId = filteredObjectives.map((user) => {
      return { objectiveId: user.id || user._id, weight: user.weight || 0 };
    });
    setObjectiveId(selectedObjectivesId);
  }
  setOrderModalShow4(true);
}; 