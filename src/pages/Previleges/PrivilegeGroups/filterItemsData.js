/* eslint-disable array-callback-return */

import { previleges } from "reducer/privilegesGroup";
export const filterFinalItems = (activeGroupMembersData, updatedDatas, groupMembers, dispatch) => {
  let activeGroupMembers = [...activeGroupMembersData];
  let updatedData = [...groupMembers];
  let finalData = { ...updatedDatas }
  let designation = updatedData.filter(item => item.categoryName === "Designation").length > 0 ? updatedData.filter(item => item.categoryName === "Designation")[0].categoryValue : "";
  let department = updatedData.filter(item => item.categoryName === "Department").length > 0 ? updatedData.filter(item => item.categoryName === "Department")[0].categoryValue : "";
  let grade = updatedData.filter(item => item.categoryName === "Grade").length > 0 ? updatedData.filter(item => item.categoryName === "Grade")[0].categoryValue : "";
  let hireDate = updatedData.filter(item => item.categoryName === "Hire Date").length > 0 ? updatedData.filter(item => item.categoryName === "Hire Date")[0].categoryValue : "";
  let hireDateValue = updatedData.filter(item => item.categoryName === "Hire Date").length > 0 ? updatedData.filter(item => item.categoryName === "Hire Date")[0].categoryValueText : "";
  if (designation.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (designation.length > 0 && item.employmentInformation.designation !== designation) {
        return { ...item, statuss: false }
      }
      if (designation.length > 0 && item.employmentInformation.designation === designation) {
        return { ...item, statuss: true }
      }
      return null;
    });
  }
  if (department.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (department.length > 0 && item.employmentInformation.department !== department) {
        return { ...item, statuss: false };
      }
      if (department.length > 0 && item.employmentInformation.department === department) {
        return { ...item, statuss: true };
      }
    });
  }
  if (grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map(item => {
      if (grade.length > 0 && item.employmentInformation.grade !== grade) {
        return { ...item, statuss: false };
      }
      if (grade.length > 0 && item.employmentInformation.grade === grade) {
        return { ...item, statuss: true };
      }
    });
  }
  if (hireDate.length > 0) {
    activeGroupMembers = activeGroupMembers.map(item => {
      if (hireDate === "<" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") < window.moment(hireDateValue).format("DD-MM-YYYY")) {
        return { ...item, statuss: true };
      } else if (hireDate === ">" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") > window.moment(hireDateValue).format("DD-MM-YYYY")) {
        return { ...item, statuss: true };
      } else if (hireDate === "==" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") === window.moment(hireDateValue).format("DD-MM-YYYY")) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false }
      }
    });
  }
  activeGroupMembers = finalFiltering(activeGroupMembers, groupMembers);
  finalData.activeGroupMembers = activeGroupMembers
  dispatch(previleges(finalData));
}
export const finalFiltering = (activeGroupMembersData, groupMembers) => {
  let activeGroupMembers = [...activeGroupMembersData];
  let updatedData = [...groupMembers];
  let designation = updatedData.filter(item => item.categoryName === "Designation").length > 0 ? updatedData.filter(item => item.categoryName === "Designation")[0].categoryValue : "";
  let department = updatedData.filter(item => item.categoryName === "Department").length > 0 ? updatedData.filter(item => item.categoryName === "Department")[0].categoryValue : "";
  let grade = updatedData.filter(item => item.categoryName === "Grade").length > 0 ? updatedData.filter(item => item.categoryName === "Grade")[0].categoryValue : "";
  let hireDate = updatedData.filter(item => item.categoryName === "Hire Date").length > 0 ? updatedData.filter(item => item.categoryName === "Hire Date")[0].categoryValue : "";
  let hireDateValue = updatedData.filter(item => item.categoryName === "Hire Date").length > 0 ? updatedData.filter(item => item.categoryName === "Hire Date")[0].categoryValueText : "";
  if (hireDate.length > 0 && designation.length > 0 && department.length > 0 && grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.designation === designation && item.employmentInformation.department === department && item.employmentInformation.grade === grade) {
        if (hireDate === "<" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") < window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === ">" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") > window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === "==" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") === window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else {
          return { ...item, statuss: false };
        }
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (hireDate.length > 0 && designation.length > 0 && department.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.designation === designation && item.employmentInformation.department === department) {
        if (hireDate === "<" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") < window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === ">" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") > window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === "==" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") === window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else {
          return { ...item, statuss: false };
        }
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (hireDate.length > 0 && designation.length > 0 && grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.designation === designation && item.employmentInformation.grade === grade) {
        if (hireDate === "<" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") < window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === ">" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") > window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === "==" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") === window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else {
          return { ...item, statuss: false };
        }
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (hireDate.length > 0 && department.length > 0 && grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.department === department && item.employmentInformation.grade === grade) {
        if (hireDate === "<" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") < window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === ">" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") > window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === "==" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") === window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else {
          return { ...item, statuss: false };
        }
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (designation.length > 0 && department.length > 0 && grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.designation === designation && item.employmentInformation.department === department && item.employmentInformation.grade === grade) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (hireDate.length > 0 && designation.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.designation === designation) {
        if (hireDate === "<" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") < window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === ">" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") > window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === "==" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") === window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else {
          return { ...item, statuss: false };
        }
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (hireDate.length > 0 && department.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.department === department) {
        if (hireDate === "<" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") < window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === ">" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") > window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === "==" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") === window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else {
          return { ...item, statuss: false };
        }
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (hireDate.length > 0 && grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.grade === grade) {
        if (hireDate === "<" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") < window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === ">" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") > window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === "==" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") === window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else {
          return { ...item, statuss: false };
        }
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (designation.length > 0 && department.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.designation === designation && item.employmentInformation.department === department) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (designation.length > 0 && grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.designation === designation && item.employmentInformation.grade === grade) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (department.length > 0 && grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.department === department && item.employmentInformation.grade === grade) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (hireDate.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (hireDate === "<" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") < window.moment(hireDateValue).format("DD-MM-YYYY")) {
        return { ...item, statuss: true };
      } else if (hireDate === ">" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") > window.moment(hireDateValue).format("DD-MM-YYYY")) {
        return { ...item, statuss: true };
      } else if (hireDate === "==" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") === window.moment(hireDateValue).format("DD-MM-YYYY")) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (designation.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.designation === designation) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (department.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.department === department) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.grade === grade) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  }
  return activeGroupMembers;
}
export const filterFinalItemsDelete = (activeGroupMembersData, groupMembers, roleData, category, index, dispatch) => {
  let activeGroupMembers = [...activeGroupMembersData];
  let updatedData = [...groupMembers];
  let finalData = { ...roleData }
  let categoryValue = updatedData.filter(item => item.categoryName === category).length > 0 ? updatedData.filter(item => item.categoryName === category)[0].categoryValue : "";
  if (categoryValue.length > 0) {
    activeGroupMembers = activeGroupMembers.map(item => {
      category = category.toLowerCase();
      if (categoryValue.length > 0 && item.employmentInformation[category] === categoryValue) {
        return { ...item, statuss: false };
      } else {
        return item;
      }
    });
  }
  finalData.activeGroupMembers = index === 0 && updatedData.length === 1 ? [] : activeGroupMembers;
  dispatch(previleges(finalData));
  return finalData.activeGroupMembers;
}

export const inActivefilterFinalItems = (activeGroupMembersData, updatedDatas, groupMembers, dispatch) => {
  let activeGroupMembers = [...activeGroupMembersData];
  let updatedData = [...groupMembers];
  let finalData = { ...updatedDatas }
  let designation = updatedData.filter(item => item.categoryName === "Designation").length > 0 ? updatedData.filter(item => item.categoryName === "Designation")[0].categoryValue : "";
  let department = updatedData.filter(item => item.categoryName === "Department").length > 0 ? updatedData.filter(item => item.categoryName === "Department")[0].categoryValue : "";
  let grade = updatedData.filter(item => item.categoryName === "Grade").length > 0 ? updatedData.filter(item => item.categoryName === "Grade")[0].categoryValue : "";
  let email = updatedData.filter(item => item.categoryName === "Email").length > 0 ? updatedData.filter(item => item.categoryName === "Email")[0].categoryValue : "";
  if (designation.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (designation.length > 0 && item.employmentInformation.designation !== designation) {
        return { ...item, statuss: false }
      }
      if (designation.length > 0 && item.employmentInformation.designation === designation) {
        return { ...item, statuss: true }
      }
    });
  }
  if (department.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (department.length > 0 && item.employmentInformation.department !== department) {
        return { ...item, statuss: false };
      }
      if (department.length > 0 && item.employmentInformation.department === department) {
        return { ...item, statuss: true };
      }
    });
  }
  if (grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map(item => {
      if (grade.length > 0 && item.employmentInformation.grade !== grade) {
        return { ...item, statuss: false };
      }
      if (grade.length > 0 && item.employmentInformation.grade === grade) {
        return { ...item, statuss: true };
      }
    });
  }
  if (email.length > 0) {
    activeGroupMembers = activeGroupMembers.map(item => {
      if (email.length > 0 && item.contactInformation.email !== email) {
        return { ...item, statuss: false };
      }
      if (email.length > 0 && item.contactInformation.email === email) {
        return { ...item, statuss: true };
      }
    });
  }
  activeGroupMembers = finalFiltering(activeGroupMembers, groupMembers);
  finalData.inActiveGroupMembers = activeGroupMembers
  dispatch(previleges(finalData));
}
export const inActivefinalFiltering = (activeGroupMembersData, groupMembers) => {
  let activeGroupMembers = [...activeGroupMembersData];
  let updatedData = [...groupMembers];
  let designation = updatedData.filter(item => item.categoryName === "Designation").length > 0 ? updatedData.filter(item => item.categoryName === "Designation")[0].categoryValue : "";
  let department = updatedData.filter(item => item.categoryName === "Department").length > 0 ? updatedData.filter(item => item.categoryName === "Department")[0].categoryValue : "";
  let grade = updatedData.filter(item => item.categoryName === "Grade").length > 0 ? updatedData.filter(item => item.categoryName === "Grade")[0].categoryValue : "";
  let hireDate = updatedData.filter(item => item.categoryName === "Hire Date").length > 0 ? updatedData.filter(item => item.categoryName === "Hire Date")[0].categoryValue : "";
  let hireDateValue = updatedData.filter(item => item.categoryName === "Hire Date").length > 0 ? updatedData.filter(item => item.categoryName === "Hire Date")[0].categoryValueText : "";
  let email = updatedData.filter(item => item.categoryName === "Email").length > 0 ? updatedData.filter(item => item.categoryName === "Email")[0].categoryValueText : "";
  if (email.length > 0 && hireDate.length > 0 && designation.length > 0 && department.length > 0 && grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.designation === designation && item.employmentInformation.department === department && item.employmentInformation.grade === grade && item.contactInformation.email === email) {
        if (hireDate === "<" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") < window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === ">" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") > window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === "==" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") === window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else {
          return { ...item, statuss: false };
        }
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (email.length > 0 && hireDate.length > 0 && designation.length > 0 && department.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.designation === designation && item.employmentInformation.department === department && item.contactInformation.email === email) {
        if (hireDate === "<" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") < window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === ">" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") > window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === "==" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") === window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else {
          return { ...item, statuss: false };
        }
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (email.length > 0 && hireDate.length > 0 && designation.length > 0 && grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.designation === designation && item.employmentInformation.grade === grade && item.contactInformation.email === email) {
        if (hireDate === "<" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") < window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === ">" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") > window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === "==" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") === window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else {
          return { ...item, statuss: false };
        }
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (email.length > 0 && hireDate.length > 0 && department.length > 0 && grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.department === department && item.employmentInformation.grade === grade && item.contactInformation.email === email) {
        if (hireDate === "<" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") < window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === ">" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") > window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === "==" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") === window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else {
          return { ...item, statuss: false };
        }
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (email.length > 0 && designation.length > 0 && department.length > 0 && grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.designation === designation && item.employmentInformation.department === department && item.employmentInformation.grade === grade && item.contactInformation.email === email) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (hireDate.length > 0 && designation.length > 0 && department.length > 0 && grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.designation === designation && item.employmentInformation.department === department && item.employmentInformation.grade === grade) {
        if (hireDate === "<" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") < window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === ">" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") > window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === "==" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") === window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else {
          return { ...item, statuss: false };
        }
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (email.length > 0 && designation.length > 0 && department.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.designation === designation && item.employmentInformation.department === department && item.contactInformation.email === email) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (email.length > 0 && designation.length > 0 && grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.designation === designation && item.employmentInformation.grade === grade && item.contactInformation.email === email) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (email.length > 0 && hireDate.length > 0 && grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.contactInformation.email === email && item.employmentInformation.grade === grade) {
        if (hireDate === "<" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") < window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === ">" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") > window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === "==" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") === window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else {
          return { ...item, statuss: false };
        }
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (email.length > 0 && designation.length > 0 && department.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.contactInformation.email === email && item.employmentInformation.designation === designation && item.employmentInformation.department === department) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (email.length > 0 && designation.length > 0 && grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.contactInformation.email === email && item.employmentInformation.designation === designation && item.employmentInformation.grade === grade) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (email.length > 0 && department.length > 0 && grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.contactInformation.email === email && item.employmentInformation.department === department && item.employmentInformation.grade === grade) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (hireDate.length > 0 && designation.length > 0 && department.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.designation === designation && item.employmentInformation.department === department) {
        if (hireDate === "<" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") < window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === ">" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") > window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === "==" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") === window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else {
          return { ...item, statuss: false };
        }
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (hireDate.length > 0 && designation.length > 0 && grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.designation === designation && item.employmentInformation.grade === grade) {
        if (hireDate === "<" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") < window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === ">" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") > window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === "==" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") === window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else {
          return { ...item, statuss: false };
        }
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (hireDate.length > 0 && department.length > 0 && grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.department === department && item.employmentInformation.grade === grade) {
        if (hireDate === "<" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") < window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === ">" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") > window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === "==" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") === window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else {
          return { ...item, statuss: false };
        }
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (designation.length > 0 && department.length > 0 && grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.designation === designation && item.employmentInformation.department === department && item.employmentInformation.grade === grade) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (email.length > 0 && hireDate.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.contactInformation.email === email) {
        if (hireDate === "<" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") < window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === ">" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") > window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === "==" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") === window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else {
          return { ...item, statuss: false };
        }
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (email.length > 0 && designation.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.contactInformation.email === email && item.employmentInformation.designation === designation) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (email.length > 0 && department.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.contactInformation.email === email && item.employmentInformation.department === department) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (email.length > 0 && grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.contactInformation.email === email && item.employmentInformation.grade === grade) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (hireDate.length > 0 && designation.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.designation === designation) {
        if (hireDate === "<" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") < window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === ">" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") > window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === "==" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") === window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else {
          return { ...item, statuss: false };
        }
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (hireDate.length > 0 && department.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.department === department) {
        if (hireDate === "<" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") < window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === ">" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") > window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === "==" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") === window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else {
          return { ...item, statuss: false };
        }
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (hireDate.length > 0 && grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.grade === grade) {
        if (hireDate === "<" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") < window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === ">" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") > window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else if (hireDate === "==" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") === window.moment(hireDateValue).format("DD-MM-YYYY")) {
          return { ...item, statuss: true };
        } else {
          return { ...item, statuss: false };
        }
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (designation.length > 0 && department.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.designation === designation && item.employmentInformation.department === department) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (designation.length > 0 && grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.designation === designation && item.employmentInformation.grade === grade) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (department.length > 0 && grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.department === department && item.employmentInformation.grade === grade) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (email.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.contactInformation.email === email) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (hireDate.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (hireDate === "<" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") < window.moment(hireDateValue).format("DD-MM-YYYY")) {
        return { ...item, statuss: true };
      } else if (hireDate === ">" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") > window.moment(hireDateValue).format("DD-MM-YYYY")) {
        return { ...item, statuss: true };
      } else if (hireDate === "==" && window.moment(item.employmentInformation.hireDate).format("DD-MM-YYYY") === window.moment(hireDateValue).format("DD-MM-YYYY")) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (designation.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.designation === designation) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (department.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.department === department) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  } else if (grade.length > 0) {
    activeGroupMembers = activeGroupMembers.map((item) => {
      if (item.employmentInformation.grade === grade) {
        return { ...item, statuss: true };
      } else {
        return { ...item, statuss: false };
      }
    });
  }
  return activeGroupMembers;
}
export const inActivefilterFinalItemsDelete = (activeGroupMembersData, groupMembers, roleData, category, index, dispatch) => {
  let activeGroupMembers = [...activeGroupMembersData];
  let updatedData = [...groupMembers];
  let finalData = { ...roleData }
  let categoryValue = updatedData.filter(item => item.categoryName === category).length > 0 ? updatedData.filter(item => item.categoryName === category)[0].categoryValue : "";
  if (categoryValue.length > 0) {
    activeGroupMembers = activeGroupMembers.map(item => {
      category = category.toLowerCase();
      if (categoryValue.length > 0 && item.employmentInformation[category] === categoryValue) {
        return { ...item, statuss: false };
      } else {
        return item;
      }
    });
  }
  finalData.inActiveGroupMembers = index === 0 && updatedData.length === 1 ? [] : activeGroupMembers;
  dispatch(previleges(finalData));
  return finalData.inActiveGroupMembers;
}