// Small, defensive helpers around localStorage. Some browsers/devices block
// access entirely (SecurityError on reading 'localStorage' from Window).
export const canUseLocalStorage = () => {
  try {
    const testKey = "__ts_ls_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

export const getItemFromLocalStorage = (key) => {
  try {
    if (!canUseLocalStorage()) return null;
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error parsing localStorage item: ${key}`, error);
    return null;
  }
};



export const setItemToLocalStorage = (key, value) => {
  try {
    if (!canUseLocalStorage()) return;
    const jsonValue = JSON.stringify(value);
    window.localStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error setting localStorage item: ${key}`, error);
  }
};


export const storeEmployeeId = (employeeId) => {
  if (employeeId) {
    try {
      const jsonValue = JSON.stringify(employeeId);
      if (canUseLocalStorage()) {
        window.localStorage.setItem("employeeId", jsonValue);
      }
    } catch (error) {
      console.error("Error storing employeeId", error);
    }
  }
}

export const getSelectedTabType = () => {
  let type = 'me';
  try {
    if (!canUseLocalStorage()) return type;
    const storedTab = window.localStorage.getItem('selectedTab');
    if (storedTab) {
      const parsed = JSON.parse(storedTab);
      if (parsed && parsed.tab) {
        type = parsed.tab;
      }
    }
  } catch (e) {}
  return type;
};
