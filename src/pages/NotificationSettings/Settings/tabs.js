import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const TabsContainer = (props) => {
  const { t } = useTranslation();
  const [selectAll, setSelectAll] = useState(false);
  const [selectObjectives, setSelectObjectives] = useState(false);
  const [selectKeyResults, setSelectKeyResults] = useState(false);
  const [selectTasks, setSelectTasks] = useState(false);

  const updateActionsChange = (name) => {
    let updateActions = [...props.actions];
    let findIndex = updateActions.findIndex((item) => item.page === name);
    updateActions[findIndex].active = !updateActions[findIndex].active;
    props.setActions(updateActions);
    props.setSelectedIndex(findIndex);
    if (updateActions[findIndex].active) {
      if (!updateActions[findIndex].subject) {
        updateActions[findIndex].subject = "";
      }
      if (!updateActions[findIndex].message) {
        updateActions[findIndex].message = "";
      }
      if (!updateActions[findIndex].attachment) {
        updateActions[findIndex].attachment = "";
      }
      props.setRoleData(updateActions[findIndex]);
    } else {
      let emptyObj = {
        toAddress: "",
        ccAddress: "",
        subject: "",
        message: "",
        attachment: "",
      };
      props.setRoleData(emptyObj);
    }
  };

  const updateActionsChangeCategory = (name, action) => {
    let updateActions = [...props.actions];
    let updatedActions = updateActions.map((item) => {
      if (item.category === name) {
        return { ...item, active: !action };
      } else {
        return item;
      }
    });
    props.setActions(updatedActions);
  };

  const selectAllActions = () => {
    let updateActions = [...props.actions];
    let updatedActions = updateActions.map((item) => ({
      ...item,
      active: !selectAll,
    }));
    props.setActions(updatedActions);
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    if (
      props.actions &&
      props.actions.filter((item) => !item.active).length > 0
    ) {
      setSelectAll(false);
    } else {
      setSelectAll(true);
    }
    if (
      props.actions &&
      props.actions.filter(
        (item) => item.category === "Objectives" && !item.active
      ).length === 0
    ) {
      setSelectObjectives(true);
    } else {
      setSelectObjectives(false);
    }
    if (
      props.actions &&
      props.actions.filter(
        (item) => item.category === "Key Results" && !item.active
      ).length === 0
    ) {
      setSelectKeyResults(true);
    } else {
      setSelectKeyResults(false);
    }
    if (
      props.actions &&
      props.actions.filter((item) => item.category === "Tasks" && !item.active)
        .length === 0
    ) {
      setSelectTasks(true);
    } else {
      setSelectTasks(false);
    }
  }, [props.actions]);

  return (
    <div className="mt-2">
      <div>
        <input
          type="checkbox"
          id="selectAll"
          value={selectAll}
          checked={selectAll}
          onChange={() => selectAllActions()}
        />{" "}
        <label htmlFor="selectAll" className="cursor-pointer">
          {t("tabsContainer.selectAll")}
        </label>
      </div>

      <div className="mt-3 mb-3">
        <input
          type="checkbox"
          id="objectives"
          value={selectObjectives}
          checked={selectObjectives}
          onChange={() =>
            updateActionsChangeCategory("Objectives", selectObjectives)
          }
        />{" "}
        <label htmlFor="objectives" className="cursor-pointer">
          {t("tabsContainer.objectives")}
        </label>
      </div>

      <div className="mt-3 ml-3">
        {props.actions
          .filter((item) => item.category === "Objectives")
          .map((item, index) => {
            return (
              <div key={item.page} className="mt-2 mb-2">
                <input
                  style={{ borderRadius: "50%" }}
                  type="checkbox"
                  id={item.page}
                  name={item.page}
                  value={item.active}
                  checked={item.active ? true : false}
                  onChange={() => updateActionsChange(item.page)}
                />{" "}
                <label htmlFor={item.page} className="cursor-pointer">
                  {t(item.page)}
                </label>
              </div>
            );
          })}
      </div>

      <div className="mt-3 mb-3">
        <input
          type="checkbox"
          id="keyresults"
          value={selectKeyResults}
          checked={selectKeyResults}
          onChange={() =>
            updateActionsChangeCategory("Key Results", selectKeyResults)
          }
        />{" "}
        <label htmlFor="keyresults" className="cursor-pointer">
          {t("tabsContainer.keyResults")}
        </label>
      </div>

      <div className="mt-3 ml-3">
        {props.actions
          .filter((item) => item.category === "Key Results")
          .map((item, index) => {
            return (
              <div key={item.page} className="mt-2 mb-2">
                <input
                  style={{ borderRadius: "50%" }}
                  type="checkbox"
                  id={item.page}
                  name={item.page}
                  value={item.active}
                  checked={item.active ? true : false}
                  onChange={() => updateActionsChange(item.page)}
                />{" "}
                <label htmlFor={item.page} className="cursor-pointer">
                  {t(item.page)}
                </label>
              </div>
            );
          })}
      </div>

      <div className="mt-3 mb-3">
        <input
          type="checkbox"
          id="tasks"
          value={selectTasks}
          checked={selectTasks}
          onChange={() => updateActionsChangeCategory("Tasks", selectTasks)}
        />{" "}
        <label htmlFor="tasks" className="cursor-pointer">
          {t("tabsContainer.tasks")}
        </label>
      </div>

      <div className="mt-3 ml-3">
        {props.actions
          .filter((item) => item.category === "Tasks")
          .map((item, index) => {
            return (
              <div key={item.page} className="mt-2 mb-2">
                <input
                  style={{ borderRadius: "50%" }}
                  type="checkbox"
                  id={item.page}
                  name={item.page}
                  value={item.active}
                  checked={item.active ? true : false}
                  onChange={() => updateActionsChange(item.page)}
                />{" "}
                <label htmlFor={item.page} className="cursor-pointer">
                  {t(item.page)}
                </label>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default TabsContainer;
