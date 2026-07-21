import React from "react";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

const TabsContainer = (props) => {
  const [value, setValue] = React.useState(0);
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
          textColor="primary"
          indicatorColor="primary"
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <Tab label="EMPLOYEES" />
          <Tab label="GOALS" />
          <Tab label="PERFORMANCE" disabled />
          <Tab label="REWARDS" disabled />
        </Tabs>
      </div>

      <div className="mt-3 ml-5">
        {
          value === 0 && <table className="table table-borderless">
            <thead>
              <tr>
                <th scope="col" style={{ width: "50%" }}></th>
                <th scope="col">View</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
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
              <th scope="col">View</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
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
      </div>


    </div>
  );
};

export default TabsContainer;
