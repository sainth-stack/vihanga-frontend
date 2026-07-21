
import { Toast } from "service/toast";
import * as XLSX from "xlsx";
export const downloadExcel = (data, roleData) => {
  if (data.length > 0) {
    let allObjectives = [];
    data.forEach((item) => {
      let objectives = item.objectiveKeyResults.map((obj) => {
        let objj = {
          ...obj,
          dueDate: obj.dueDate !== "Invalid date" ? window.moment(obj.dueDate).format("YYYY-MM-DD") : ""
        };
        objj.keyResults = objj.keyResults.map((keyResult) => ({
          ...keyResult,
          objective: obj.name,
          okrFunction: obj.okrFunction,
          okrCategory: obj.okrCategory,
        }));
        return objj;
      });
      allObjectives = [...allObjectives, ...objectives];
    });
    let updatedObjectives = allObjectives;
    let okrResults = [];
    updatedObjectives.forEach((objective) => {
      objective.keyResults.forEach((keyResult) => {
        okrResults.push(keyResult);
      });
    });
    let finalObjandKRs = roleData.exportOKRLibrary ? [...updatedObjectives, ...okrResults] : [...updatedObjectives];
    let finalData = finalObjandKRs.map((item) => {
      let newObj = { ...item };
      delete newObj.objective;
      delete newObj.keyResults;
      return newObj;
    });
    const worksheet = XLSX.utils.json_to_sheet(finalData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "OKRLibrary" + Date.now() + ".xlsx");
  } else {
    Toast({ message: "No Data Found!", type: "warning", time: 4000 })
  }
};


export const downloadTemplate = () => {
  let finalData = [
    { objectiveID: 1, type: "obj", name: "Sample Objective", okrFunction: "Human Resources", okrCategory: "Operational" },
    { objectiveID: 1, type: "kr", name: "Sample KR", okrFunction: "Human Resources", okrCategory: "Operational" }
  ];
  const worksheet = XLSX.utils.json_to_sheet(finalData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "OKRLibrary_Template.xlsx");
};

export const downloadTemplate2 = () => {
  let finalData = [
    {
      dueDate: window.moment(new Date()).format("YYYY-MM-DD"),
      status: "Active",
      cacaded: "FALSE",
      objectiveStatus: "Create",
      employeeNumber: "EMP_12345",
      okrPeriod: "Q1",
      okrYear: "2022",
      objective: "sample new objective",
      weight: "10",
      owner: "User Emp",
      progressStatus: "50",
      objectiveID: "",
    },
    {
      dueDate: window.moment(new Date()).format("YYYY-MM-DD"),
      status: "Active",
      cacaded: "FALSE",
      objectiveStatus: "Update",
      employeeNumber: "EMP_12345",
      okrPeriod: "Q1",
      okrYear: "2022",
      objective: "sample old objective",
      weight: "10",
      owner: "User Emp",
      progressStatus: "50",
      objectiveID: "OBJ_12345",
    },
    {
      dueDate: window.moment(new Date()).format("YYYY-MM-DD"),
      status: "Active",
      cacaded: "FALSE",
      objectiveStatus: "Update",
      okrPeriod: "Q1",
      okrYear: "2022",
      objective: "sample old objective",
      weight: "2",
      owner: "Super Admin",
      progressStatus: "100",
      objectiveID: "OBJ_12345",
      employeeNumber: "SUP_12345",
      isAlignedToCompany: "Yes",
      dimension: "Operational",
      keyResultName: "sample new kr",
      frequency: "Monthly",
      polarity: "Number",
      target: 5,
      actual: 5,
      baseValue: 5,
      actualDate: window.moment(new Date()).format("YYYY-MM-DD"),
      targetDate: window.moment(new Date()).format("YYYY-MM-DD"),
      krID: "",
      krProgress: "100",
      KRObjectiveID: "OBJ_12345",
    },
    {
      dueDate: window.moment(new Date()).format("YYYY-MM-DD"),
      status: "Active",
      cacaded: "FALSE",
      objectiveStatus: "Update",
      okrPeriod: "Q1",
      okrYear: "2022",
      objective: "sample old objective",
      weight: "2",
      owner: "Super Admin",
      progressStatus: "100",
      objectiveID: "OBJ_12345",
      employeeNumber: "SUP_12345",
      isAlignedToCompany: "Yes",
      dimension: "Operational",
      keyResultName: "sample old kr",
      frequency: "Monthly",
      polarity: "Number",
      target: 5,
      actual: 5,
      baseValue: 5,
      actualDate: window.moment(new Date()).format("YYYY-MM-DD"),
      targetDate: window.moment(new Date()).format("YYYY-MM-DD"),
      krID: "KR_12345",
      krProgress: "100",
      KRObjectiveID: "OBJ_12345",
    },
  ];
  const worksheet = XLSX.utils.json_to_sheet(finalData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "OKR_Template.xlsx");
};
export const downloadExcel2 = (okrData, objectives2, keyResults2) => {
  let data2 = []
  if (okrData.isExportOKRs && okrData.includingKeyResults) {
    let updatedObjectives = objectives2.length > 0 ? objectives2 : [];
    let updatedObjectives2 = updatedObjectives.map((item) => {
      let data = { ...item, dueDate: item.dueDate !== "Invalid date" ? window.moment(item.dueDate).format("YYYY-MM-DD") : "" };
      delete data.keyResults;
      delete data.children;
      delete data.__v;
      delete data.employeeReferenceId;
      delete data.comments;
      delete data.successMetrics;
      delete data.feedAttachment;
      delete data.cascadedType;
      return data;
    })
    updatedObjectives2 = updatedObjectives2.map((item) => {
      let data = { ...item };
      delete data._id;
      return data;
    })
    data2 = data2.map((item) => {
      let data = { ...item };
      delete data._id;
      delete data.objectiveId;
      return data;
    })
    let finalData = [...updatedObjectives2, ...data2];
    const worksheet = XLSX.utils.json_to_sheet(finalData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "OKRLibrary" + Date.now() + ".xlsx");
  } else if (okrData.isExportOKRs) {
    let finalData = [...objectives2];
    let updatedObjectives2 = finalData.map((item) => {
      let data = { ...item, dueDate: item.dueDate !== "Invalid date" ? window.moment(item.dueDate).format("YYYY-MM-DD") : "" };
      delete data.keyResults;
      delete data.children;
      delete data.__v;
      delete data.employeeReferenceId;
      delete data.comments;
      delete data.successMetrics;
      delete data.feedAttachment;
      delete data.cascadedType;
      delete data.employeeName;
      delete data._id;
      return data;
    })
    const worksheet = XLSX.utils.json_to_sheet(updatedObjectives2);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "OKRLibrary" + Date.now() + ".xlsx");
  }
};

export const downloadTasksExcel = (data) => {
  let tasks = data;
  let allTasks = [];
  tasks.forEach(item => {
    if (item.children.length > 0) {
      item.children.forEach(child => allTasks.push(child));
    }
    allTasks.push(item);
  });
  let allComments = [];
  allTasks.forEach(item => {
    if (item.comments.length > 0) {
      item.comments.forEach(child => allComments.push({
        ...item,
        comment: child.comment,
      }))
    } else {
      allComments.push({ ...item, comment: "" });
    }
  })

  let finalData = allComments.map(item => {
    item.owner = item.owner;
    item.title = item.title;
    item.priority = item.priority;
    delete item.comments;
    delete item.children;
    delete item.krReferenceId;
    delete item.__v;
    delete item.linkToKR;
    delete item.recurrenceDetails;
    delete item.assignTo;
    delete item.targetDate;
    item.startDate = window.moment(item.startDate).format("YYYY-MM-DD");
    item.dueDate = window.moment(item.dueDate).format("YYYY-MM-DD");
    item.actualCompletionDate = item.actualCompletionDate ? window.moment(item.actualCompletionDate).format("YYYY-MM-DD") : "";
    item.comment = item.comment;
    return {
      owner: item.owner,
      employeeName: item.employeeName,
      title: item.title,
      description: item.description,
      priority: item.priority,
      status: item.status,
      recurrence: item.recurrence,
      mainTask: item.mainTask,
      progress: item.progressStatus,
      startDate: item.startDate,
      dueDate: item.dueDate,
      actualCompletionDate: item.actualCompletionDate,
      actualEffort: item.actualEffort,
      estimationEffort: item.estimationEffort,
      rewardPoints: item.rewardPoints,
      companyId: item.companyId,
      userId: item.userId,
      _id: item._id,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      comment: item.comment
    }
  })
  const worksheet = XLSX.utils.json_to_sheet(finalData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "Tasks_Data_" + window.moment(new Date()).format("YYYY-MM-DD-hh-mm-ss") + ".xlsx");
};