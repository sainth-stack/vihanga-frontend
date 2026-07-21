import { employeeApi } from "../service/apiVariables";

export const createEmployee = (body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...employeeApi.createEmployee, body })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        Toast({ type: "success", message, time: 5000 });
      })
      .catch(({ message }) => {
        Toast({ type: "error", message });
      });
  });
};

export const updateEmployee = (id, body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...employeeApi.updateEmployee(id), body })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        Toast({ type: "success", message, time: 5000 });
      })
      .catch(({ message }) => {
        Toast({ type: "error", message });
      });
  });
};

export const createOrUpdateMultipleCompanies = (body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...employeeApi.createOrUpdateMultipleCompanies, body })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        Toast({ type: "success", message, time: 5000 });
      })
      .catch(({ message }) => {
        Toast({ type: "error", message });
      });
  });
};

export const getEmployees = () => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...employeeApi.getEmployees })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        //Toast({ type: "success", message, time: 5000 });
      })
      .catch(({ message }) => {
        //reject(Toast({ type: "error", message }));
        console.log("get error", message);
      });
  });
};
export const getEmployeesAll = () => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...employeeApi.getEmployeesAll })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        //Toast({ type: "success", message, time: 5000 });
      })
      .catch(({ message }) => {
        //reject(Toast({ type: "error", message }));
        console.log("get error", message);
      });
  });
};
export const getEmployeeById = (id) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...employeeApi.getEmployeeById(id) })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        //Toast({ type: "success", message, time: 5000 });
      })
      .catch(({ message }) => {
        //reject(Toast({ type: "error", message }));
        console.log("get error", message);
      });
  });
};
export const getEmployeByHireDate1 = () => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...employeeApi.getEmployeeByHireDate })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        //Toast({ type: "success", message, time: 5000 });
      })
      .catch(({ message }) => {
        //reject(Toast({ type: "error", message }));
        console.log("get error", message);
      });
  });
};

export const getEmployeByDateOfBirth1 = () => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...employeeApi.getEmployeByDateOfBirth })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        //Toast({ type: "success", message, time: 5000 });
      })
      .catch(({ message }) => {
        //reject(Toast({ type: "error", message }));
        console.log("get error", message);
      });
  });
};

export const getOrgChart = () => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...employeeApi.getOrgChartData })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        //Toast({ type: "success", message, time: 5000 });
      })
      .catch(({ message }) => {
        //reject(Toast({ type: "error", message }));
        console.log("get error", message);
      });
  });
};

export const deleteEmployee = (id) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...employeeApi.deleteEmployee(id) })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        Toast({ type: "success", message, time: 5000 });
      })
      .catch(({ message }) => {
        // reject(Toast({ type: "error", message }));
        Toast({ type: "error", message });
      });
  });
};

export const deleteEmployees = (body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...employeeApi.deleteEmployees, body })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        Toast({ type: "success", message, time: 5000 });
      })
      .catch(({ message }) => {
        // reject(Toast({ type: "error", message }));
        Toast({ type: "error", message });
      });
  });
};
export const changePassword = (body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...employeeApi.changePassword, body })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        Toast({ type: "success", message, time: 5000 });
      })
      .catch(({ message }) => {
        // reject(Toast({ type: "error", message }));
        Toast({ type: "error", message });
      });
  })
}