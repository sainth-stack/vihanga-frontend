
const startMonth = 1;

export const getMonths1 = () => {
  let result = [];
  if (startMonth === 1) {
    result = ['1', '2', '3'];
  } else {
    result = ['4', '5', '6'];
  }
  return result;
}
export const getMonths2 = () => {
  let result = [];
  if (startMonth === 1) {
    result = ['4', '5', '6'];
  } else {
    result = ['7', '8', '9'];
  }
  return result;
}
export const getMonths3 = () => {
  let result = [];
  if (startMonth === 1) {
    result = ['7', '8', '9'];
  } else {
    result = ['10', '11', '12'];
  }
  return result;
}
export const getMonths4 = () => {
  let result = [];
  if (startMonth === 1) {
    result = ['10', '11', '12'];
  } else {
    result = ['1', '2', '3'];
  }
  return result;
}
export const totalQuartersData = (result, companyInfo) => {
  let totalWeights = result.reduce((prev, current) => {
    return prev + Number(current.weight);
  }, 0)
  totalWeights = Number(totalWeights).toFixed(2);
  let totalWeightsPercent = result.reduce((prev, current) => {
    return prev + Number(current.weight) * Number(current.progressStatus);
  }, 0)
  let totalEmployeeRating = result.reduce((prev, current) => {
    return prev + Number(current.employeeRating)
  }, 0)
  let totalManagerRating = result.reduce((prev, current) => {
    return prev + Number(current.managerRating)
  }, 0)
  totalWeightsPercent = Number(totalWeightsPercent / 100).toFixed(1);
  let totalQ1 = result.reduce((prev, current) => {
    return prev + (getMonths1().includes(window.moment(current.dueDate).format("M")) && window.moment(current.dueDate).format("YYYY") === companyInfo.okrYear ? Number(current.weight) * Number(current.progressStatus) : 0);
  }, 0)
  totalQ1 = Number(totalQ1 / 100).toFixed(2);
  let totalQ2 = result.reduce((prev, current) => {
    return prev + (getMonths2().includes(window.moment(current.dueDate).format("M")) && window.moment(current.dueDate).format("YYYY") === companyInfo.okrYear ? Number(current.weight) * Number(current.progressStatus) : 0);
  }, 0)
  totalQ2 = Number(totalQ2 / 100).toFixed(2);
  let totalQ3 = result.reduce((prev, current) => {
    return prev + (getMonths3().includes(window.moment(current.dueDate).format("M")) && window.moment(current.dueDate).format("YYYY") === companyInfo.okrYear ? Number(current.weight) * Number(current.progressStatus) : 0);
  }, 0)
  totalQ3 = Number(totalQ3 / 100).toFixed(2);
  let totalQ4 = result.reduce((prev, current) => {
    return prev + (getMonths4().includes(window.moment(current.dueDate).format("M")) && window.moment(current.dueDate).format("YYYY") === companyInfo.okrYear ? Number(current.weight) * Number(current.progressStatus) : 0);
  }, 0)
  totalQ4 = Number(totalQ4 / 100).toFixed(2);
  return { totalWeights, totalWeightsPercent, totalQ1, totalQ2, totalQ3, totalQ4, totalEmployeeRating, totalManagerRating };
}