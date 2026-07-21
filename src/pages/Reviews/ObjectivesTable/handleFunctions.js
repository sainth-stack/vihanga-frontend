import { Toast } from "service/toast";

export const handleSureDelete = (selectedUsers, setOrderModalShow3) => {
  if (selectedUsers.length > 0) {
    setOrderModalShow3(true);
  } else {
    Toast({ message: "Please Select Users", type: "warning", time: 4000 });
  }
};


export const handleCascade = (setMultipleObjectives, selectedUsers, selectedObjectiveId, setOrderModalShow4) => {
  setMultipleObjectives(true);
  const selectedObjectivesId = selectedUsers.map((user) => {
    return { objectiveId: user._id, weight: user.weight };
  });
  selectedObjectiveId(selectedObjectivesId);
  setOrderModalShow4(true);
};