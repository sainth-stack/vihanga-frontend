
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
  // Helper: checks if a given date string falls into provided quarter months for the specified OKR year
  const isDateInQuarterAndYear = (dateString, quarterMonths, okrYearString) => {
    const m = window.moment(dateString);
    if (!m.isValid()) return false;
    return quarterMonths.includes(m.format("M")) && m.format("YYYY") === okrYearString;
  };

  // Helper: checks if item (parent or any child) is in the OKR year
  const isItemInOkrYear = (item, okrYearString) => {
    const parentYearMatch = window.moment(item.dueDate).isValid() && window.moment(item.dueDate).format("YYYY") === okrYearString;
    if (parentYearMatch) return true;
    if (Array.isArray(item.children)) {
      return item.children.some((child) => {
        const dateString = child.dueDate || child.targetDate;
        return window.moment(dateString).isValid() && window.moment(dateString).format("YYYY") === okrYearString;
      });
    }
    return false;
  };

  // Helper: get sum of children weights for an objective (only children, not parent)
  const getChildrenWeightSum = (item) => {
    if (!Array.isArray(item.children) || item.children.length === 0) {
      return 0;
    }
    return item.children.reduce((sum, child) => sum + Number(child.weight || 0), 0);
  };

  // Helper: get weighted achievement from children (only children, not parent)
  const getChildrenWeightedAchievement = (item) => {
    if (!Array.isArray(item.children) || item.children.length === 0) {
      return 0;
    }
    return item.children.reduce((sum, child) => {
      const childWeight = Number(child.weight || 0);
      const childPercent = Number(child.percent || 0);
      return sum + (childWeight * childPercent) / 100;
    }, 0);
  };

  const okrYearString = String(companyInfo.okrYear);
  // Sum of all weights (sum of children weights for each objective)
  let totalWeights = result.reduce((prev, current) => prev + getChildrenWeightSum(current), 0);
  totalWeights = Number(totalWeights).toFixed(2);

  // Year-filtered items (for quarter breakdown only)
  const yearItems = result.filter((item) => isItemInOkrYear(item, okrYearString));

  // Total Weight Achievement: sum of (children weight × children percent) for all objectives
  const totalAllWeights = result.reduce((sum, item) => sum + getChildrenWeightSum(item), 0);
  const totalAchievedAll = result.reduce(
    (sum, item) => sum + getChildrenWeightedAchievement(item),
    0
  );
  let totalWeightsPercent = totalAllWeights > 0 ? (totalAchievedAll / totalAllWeights) * 100 : 0;
  totalWeightsPercent = Number(Number(totalWeightsPercent).toFixed(2));
  
  const percentForQuarter = (months) => {
    const itemsInQuarter = yearItems.filter((current) => {
      const parentInQ = isDateInQuarterAndYear(current.dueDate, months, okrYearString);
      const childInQ = !parentInQ && Array.isArray(current.children)
        ? current.children.some((child) =>
            isDateInQuarterAndYear(child.dueDate || child.targetDate, months, okrYearString)
          )
        : false;
      return parentInQ || childInQ;
    });
    const weights = itemsInQuarter.reduce((sum, it) => sum + getChildrenWeightSum(it), 0);
    const achieved = itemsInQuarter.reduce((sum, it) => sum + getChildrenWeightedAchievement(it), 0);
    const percent = weights > 0 ? (achieved / weights) * 100 : 0;
    return Number(percent).toFixed(2);
  };

  const totalQ1 = percentForQuarter(getMonths1());
  const totalQ2 = percentForQuarter(getMonths2());
  const totalQ3 = percentForQuarter(getMonths3());
  const totalQ4 = percentForQuarter(getMonths4());
  return { totalWeights, totalWeightsPercent, totalQ1, totalQ2, totalQ3, totalQ4 }
}