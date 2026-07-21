import React from "react";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
const useStyles = makeStyles({
  tabRoot: {
    color: 'gray',
    fontWeight: 'normal',
    minWidth: 120,
    '&$selected': {
      color: '#84823F',
      fontWeight: 'bold',
    },
  },
  selected: {}, // required for active style to work
  indicator: {
    backgroundColor: '#84823F', // underline color
  },
});

const TabsContainer = (props) => {
   const classes = useStyles();
   const { t } = useTranslation();
  const [value, setValue] = React.useState(0);
  let userData = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null;
  const updatePrivileges = (objName, type) => {
    return ({ target: { name, value } }) => {
      let updatedPrivileges = { ...props.privileges };
      let findIndex = updatedPrivileges[objName].findIndex(item => item.page === name);
      updatedPrivileges[objName][findIndex][type] = !updatedPrivileges[objName][findIndex][type];
      props.setPrivileges(updatedPrivileges)
    }
  }
  return (
    <div className="mt-2">
      <div>
      <Tabs
  value={value}
  onChange={(event, newValue) => setValue(newValue)}
  classes={{ indicator: classes.indicator }}
  style={{ overflow: 'auto' }}
>
  <Tab label={t("RolesAndPrivileges.Tabs.Employees")} classes={{ root: classes.tabRoot, selected: classes.selected }} />
  <Tab label={t("RolesAndPrivileges.Tabs.Goals")} classes={{ root: classes.tabRoot, selected: classes.selected }} />
  {userData.role !== 'HR Admin' && (
    <Tab label={t("RolesAndPrivileges.Tabs.Privileges")} classes={{ root: classes.tabRoot, selected: classes.selected }} />
  )}
  <Tab label={t("RolesAndPrivileges.Tabs.Performance")} disabled />
  <Tab label={t("RolesAndPrivileges.Tabs.Rewards")} disabled />
</Tabs>
      </div>

      <div className="mt-3 ml-5">
        {
          value === 0 && <table className="table table-borderless">
            <thead>
              <tr>
                <th scope="col" style={{ width: "50%" }}></th>
                <th scope="col">{t("RolesAndPrivileges.Tabs.View")}</th>
                <th scope="col">{t("RolesAndPrivileges.Tabs.Edit")}</th>
                <th scope="col">{t("RolesAndPrivileges.Tabs.Delete")}</th>
              </tr>
            </thead>
            <tbody>
              {props.privileges.employees.map((item, index) => {
                return (
                  <tr key={item.page}>
                    <th scope="row">{item.page}</th>
                    <td>
                      <input
                        style={{ borderRadius: '50%' }}
                        type="checkbox"
                        name={item.page}
                        value={item.view}
                        checked={item.view ? true : false}
                        onChange={updatePrivileges("employees", "view")}
                      />
                    </td>
                    <td>
                      {" "}
                      <input
                        type="checkbox"
                        name={item.page}
                        value={item.edit}
                        checked={item.edit ? true : false}
                        onChange={updatePrivileges("employees", "edit")}
                      />
                    </td>
                    <td>
                      {" "}
                      <input
                        type="checkbox"
                        name={item.page}
                        value={item.delete}
                        checked={item.delete ? true : false}
                        onChange={updatePrivileges("employees", "delete")}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>}
        {value === 1 && <table className="table table-borderless">
          <thead>
            <tr>
              <th scope="col" style={{ width: "50%" }}></th>
              <th scope="col">{t("RolesAndPrivileges.Tabs.View")}</th>
              <th scope="col">{t("RolesAndPrivileges.Tabs.Edit")}</th>
              <th scope="col">{t("RolesAndPrivileges.Tabs.Delete")}</th>
            </tr>
          </thead>
          <tbody>
            {props.privileges.goals.map((item, index) => {
              return (
                <tr key={item.page}>
                  <th scope="row">{item.page}</th>
                  <td>
                    <input
                      style={{ borderRadius: '50%' }}
                      type="checkbox"
                      name={item.page}
                      value={item.view}
                      checked={item.view ? true : false}
                      onChange={updatePrivileges("goals", "view")}
                    />
                  </td>
                  <td>
                    {" "}
                    <input
                      type="checkbox"
                      name={item.page}
                      value={item.edit}
                      checked={item.edit ? true : false}
                      onChange={updatePrivileges("goals", "edit")}
                    />
                  </td>
                  <td>
                    {" "}
                    <input
                      type="checkbox"
                      name={item.page}
                      value={item.delete}
                      checked={item.delete ? true : false}
                      onChange={updatePrivileges("goals", "delete")}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        }
        {value === 2 && <table className="table table-borderless">
          <thead>
            <tr>
              <th scope="col" style={{ width: "50%" }}></th>
              <th scope="col">{t("RolesAndPrivileges.Tabs.View")}</th>
              <th scope="col">{t("RolesAndPrivileges.Tabs.Edit")}</th>
              <th scope="col">{t("RolesAndPrivileges.Tabs.Delete")}</th>
            </tr>
          </thead>
          <tbody>
            {props.privileges.previliges.map((item, index) => {
              return (
                <tr key={item.page}>
                  <th scope="row">{item.page}</th>
                  <td>
                    <input
                      style={{ borderRadius: '50%' }}
                      type="checkbox"
                      name={item.page}
                      value={item.view}
                      checked={item.view ? true : false}
                      onChange={updatePrivileges("previliges", "view")}
                    />
                  </td>
                  <td>
                    {" "}
                    <input
                      type="checkbox"
                      name={item.page}
                      value={item.edit}
                      checked={item.edit ? true : false}
                      onChange={updatePrivileges("previliges", "edit")}
                    />
                  </td>
                  <td>
                    {" "}
                    <input
                      type="checkbox"
                      name={item.page}
                      value={item.delete}
                      checked={item.delete ? true : false}
                      onChange={updatePrivileges("previliges", "delete")}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        } 
      </div>


    </div>
  );
};

export default TabsContainer;
