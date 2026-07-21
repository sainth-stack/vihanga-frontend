
import { Toast } from "service/toast";
import * as XLSX from "xlsx";
export const downloadExcel = (data, roleData) => {
  if (data.length > 0) {
    let allObjectives = [];
    data.forEach((item) => {
      const objectiveKeyResults = Array.isArray(item.objectiveKeyResults) ? item.objectiveKeyResults : [];
      let objectives = objectiveKeyResults.map((obj) => {
        let objj = {
          ...obj,
          dueDate: obj.dueDate !== "Invalid date" ? window.moment(obj.dueDate).format("YYYY-MM-DD") : ""
        };
        const keyResults = Array.isArray(objj.keyResults) ? objj.keyResults : [];
        objj.keyResults = keyResults.map((keyResult) => ({
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
    let tasks = [];
    updatedObjectives.forEach((objective) => {
      const keyResults = Array.isArray(objective.keyResults) ? objective.keyResults : [];
      keyResults.forEach((keyResult) => {
        okrResults.push(keyResult);
        const children = Array.isArray(keyResult.children) ? keyResult.children : [];
        children.forEach((task) => {
          // Ensure exported task row carries enough context
          tasks.push({
            ...task,
            type: task.type || "task",
            objective: objective.name,
            keyResult: keyResult.name,
            okrFunction: objective.okrFunction,
            okrCategory: objective.okrCategory,
          });
        });
      });
    });
    let finalObjandKRs = roleData.exportOKRLibrary ? [...updatedObjectives, ...okrResults, ...tasks] : [...updatedObjectives];
    let finalData = finalObjandKRs.map((item) => {
      let newObj = { ...item };
      delete newObj.objective;
      delete newObj.keyResults;
      delete newObj.children; // remove nested tasks if any remain
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
    { 
      type: "obj", 
      title: "Sample Objective", 
      objectiveStatus: "Create",
      status: "Active",
      employeeNumber: "EMP0001",
      weight: 10,
      dueDate: window.moment(new Date()).format("YYYY-MM-DD"),
      okrPeriod: "Q1",
      okrYear: 2022,
      objectiveID: "",
      progressStatus: 0
    },
    { 
      type: "kr", 
      title: "Sample Key Result (increase revenue)", 
      objectiveStatus: "Create",
      target: 100,
      actual: 0,
      status: "Active",
      employeeNumber: "EMP0001",
      weight: 5,
      dueDate: window.moment(new Date()).format("YYYY-MM-DD"),
      okrPeriod: "Q1",
      okrYear: 2022,
      isAlignedToCompany: "Yes",
      objectiveID: 1,
      krID: "",
      polarity: "Positive"
    },
    { 
      type: "task", 
      title: "Sample Task (child of above KR)", 
      status: "Active",
      employeeNumber: "EMP0001",
      dueDate: window.moment(new Date()).format("YYYY-MM-DD"),
      objectiveID: 1,
      krID: 1
    },
  ];
  const worksheet = XLSX.utils.json_to_sheet(finalData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "OKRLibrary_Template.xlsx");
};

const OKR_TEMPLATE_COLUMN_ORDER = [
  "type",
  "title",
  "cacaded",
  "objectiveStatus",
  "Unit of Measurement",
  "polarity",
  "target",
  "actual",
  "progressStatus",
  "status",
  "employeeNumber",
  "weight",
  "dueDate",
  "okrPeriod",
  "okrYear",
  "isAlignedToCompany",
  // Right-side columns (moved to the end)
  "objectiveID",
  "frequency",
  "baseValue",
  "actualDate",
  "targetDate",
  "krID",
  "krProgress",
  "KRObjectiveID"
];

/**
 * Maps display headers from Excel template to API keys for import.
 * Uses unified "title" for obj/kr/task based on type. Supports legacy Title, keyResultName, taskName.
 */
export const mapOKRImportData = (data) => {
  if (!Array.isArray(data) || data.length === 0) return data;
  return data.map((row) => {
    const mapped = { ...row };
    
    if (mapped.type === "tasks") {
      mapped.type = "task";
    }
    
    const title = mapped.title ?? mapped.Title ?? (mapped.type === "kr" ? mapped.keyResultName : mapped.type === "task" ? mapped.taskName : mapped.objective);
    if (title !== undefined) {
      if (mapped.type === "obj") {
        mapped.objective = title;
        mapped.name = title;
      } else if (mapped.type === "kr") {
        mapped.keyResultName = title;
        mapped.name = title;
      } else if (mapped.type === "task") {
        mapped.title = title;
        mapped.name = title;
      } else {
        mapped.objective = mapped.objective ?? title;
      }
    }
    
    // For tasks, ensure objectiveID is set from KRObjectiveID if not present
    if (mapped.type === "task") {
      if (!mapped.objectiveID && mapped.KRObjectiveID) {
        mapped.objectiveID = mapped.KRObjectiveID;
      }
      // Ensure dueDate is present for tasks
      if (!mapped.dueDate && mapped.targetDate) {
        mapped.dueDate = mapped.targetDate;
      }
      // Ensure status is present
      if (!mapped.status) {
        mapped.status = "Active";
      }
    }
    
    if (mapped["Function Name"] !== undefined && mapped.okrFunction === undefined) mapped.okrFunction = mapped["Function Name"];
    if (mapped["Designation Name"] !== undefined && mapped.okrCategory === undefined) mapped.okrCategory = mapped["Designation Name"];
    
    // Handle Unit of Measurement / polarity / uom mapping
    // Prioritize: polarity > Unit of Measurement > uom
    if (mapped["Unit of Measurement"] !== undefined) {
      if (mapped.polarity === undefined) mapped.polarity = mapped["Unit of Measurement"];
      if (mapped.uom === undefined) mapped.uom = mapped["Unit of Measurement"];
    }
    // If polarity is provided but Unit of Measurement is not, use polarity for uom
    if (mapped.polarity !== undefined && mapped.uom === undefined) {
      mapped.uom = mapped.polarity;
    }
    // If uom is provided but polarity is not, use uom for polarity
    if (mapped.uom !== undefined && mapped.polarity === undefined) {
      mapped.polarity = mapped.uom;
    }
    
    delete mapped.dimension;
    delete mapped.Title;
    delete mapped["Function Name"];
    delete mapped["Designation Name"];
    delete mapped["Unit of Measurement"];
    return mapped;
  });
};

const reorderRowForTemplate = (row) => {
  const result = {};
  OKR_TEMPLATE_COLUMN_ORDER.forEach((key) => {
    if (row[key] !== undefined) result[key] = row[key];
  });
  return result;
};

const buildTemplateRow = (base, overrides) => reorderRowForTemplate({ ...base, ...overrides });

/**
 * Downloads OKR template with examples of Positive and Negative polarity.
 * 
 * POLARITY VALUES:
 * - "Positive": Higher actual is better (e.g., Increase sales, Increase customers, Increase revenue)
 *   Progress = (actual / target) * 100
 *   Example: target=100, actual=80 → 80% complete
 * 
 * - "Negative": Lower actual is better (e.g., Reduce defects, Reduce costs, Reduce complaints)
 *   Progress = (target / actual) * 100
 *   Example: target=5, actual=10 → 50% complete (need to reduce more)
 *   Example: target=5, actual=3 → 100% complete (exceeded target)
 */
export const downloadTemplate2 = () => {
  const d = window.moment(new Date()).format("YYYY-MM-DD");
  const objBase = {
    type: "obj",
    cacaded: "FALSE",
    status: "Active",
    employeeNumber: "EMP_12345",

    weight: "10",
    dueDate: d,
    okrPeriod: "Q1",
    okrYear: "2022",
    progressStatus: "NA",
  };
  const krBase = {
    type: "kr",
    title: "sample key result",
    cacaded: "FALSE",
    objectiveStatus: "Update",
    "Unit of Measurement": "Positive",
    polarity: "Positive",
    target: 5,
    actual: "NA",
    progressStatus: "NA",
    status: "Active",
    employeeNumber: "SUP_12345",
    owner: "Super Admin",
    weight: "2",
    dueDate: d,
    okrPeriod: "Q1",
    okrYear: "2022",
    isAlignedToCompany: "Yes",
    frequency: "Monthly",
    baseValue: 5,
    targetDate: d,
    krProgress: "NA",
    objectiveID: "OBJ_12345",
    actualDate: d,
    KRObjectiveID: "OBJ_12345",
  };
  const taskBase = { type: "task", dueDate: d, status: "Active", owner: "Super Admin", employeeNumber: "SUP_12345", krID: "KR_12345", objectiveID: "OBJ_12345" };
  const finalData = [
    buildTemplateRow(objBase, { title: "sample new objective", objectiveStatus: "Create", objectiveID: "" }),
    buildTemplateRow(objBase, { title: "sample old objective", objectiveStatus: "Update", objectiveID: "OBJ_12345" }),
    buildTemplateRow(krBase, { title: "Increase Revenue (Positive: higher is better)", krID: "", polarity: "Positive", "Unit of Measurement": "Positive", target: 100, actual: "NA" }),
    buildTemplateRow(krBase, { title: "Reduce Customer Complaints (Negative: lower is better)", krID: "", polarity: "Negative", "Unit of Measurement": "Negative", target: 5, actual: "NA" }),
    buildTemplateRow(krBase, { title: "sample old kr", krID: "KR_12345", polarity: "Positive", "Unit of Measurement": "Positive" }),
    buildTemplateRow(taskBase, { title: "sample task for new KR" }),
    buildTemplateRow(taskBase, { title: "sample task for existing KR" }),
  ];
  const worksheet = XLSX.utils.json_to_sheet(finalData, { header: OKR_TEMPLATE_COLUMN_ORDER });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "OKR_Template.xlsx");
};
/**
 * Transforms API data to template format: unified "title" for obj/kr/task, Function Name, Designation Name,
 * Unit of Measurement, dimension removed.
 */
const transformForExport = (row) => {
  const transformed = { ...row };
  const type = transformed.type || "obj";
  if (type === "obj") transformed.title = transformed.objective ?? transformed.name ?? transformed.title;
  else if (type === "kr") transformed.title = transformed.keyResultName ?? transformed.name ?? transformed.title;
  else if (type === "task") transformed.title = transformed.title ?? transformed.taskName ?? transformed.name;
  else transformed.title = transformed.objective ?? transformed.keyResultName ?? transformed.title ?? transformed.name;
  if (transformed.okrFunction !== undefined) transformed["Function Name"] = transformed.okrFunction;
  if (transformed.okrCategory !== undefined) transformed["Designation Name"] = transformed.okrCategory;
  
  // Handle polarity and Unit of Measurement
  if (transformed.polarity !== undefined || transformed.uom !== undefined) {
    const polarityValue = transformed.polarity || transformed.uom;
    transformed["Unit of Measurement"] = polarityValue;
    transformed.polarity = polarityValue; // Keep polarity column
  }
  
  delete transformed.objective;
  delete transformed.okrFunction;
  delete transformed.okrCategory;
  delete transformed.uom;
  delete transformed.dimension;
  delete transformed._id;
  delete transformed.objectiveId;
  delete transformed.__v;
  delete transformed.employeeReferenceId;
  delete transformed.comments;
  delete transformed.successMetrics;
  delete transformed.feedAttachment;
  delete transformed.cascadedType;
  delete transformed.keyResultName;
  delete transformed.taskName;
  return reorderRowForTemplate(transformed);
};

export const downloadExcel2 = (okrData, objectives2, keyResults2) => {
  const formatDate = (d) => (d && d !== "Invalid date" ? window.moment(d).format("YYYY-MM-DD") : "");
  let flatRows = [];

  if (okrData.isExportOKRs && okrData.includingKeyResults) {
    const objectives = objectives2.length > 0 ? objectives2 : [];
    objectives.forEach((obj) => {
      const objRow = { ...obj, type: "obj", dueDate: formatDate(obj.dueDate) };
      flatRows.push(transformForExport(objRow));
      const keyResults = Array.isArray(obj.children) ? obj.children : (Array.isArray(obj.keyResults) ? obj.keyResults : []);
      keyResults.forEach((kr) => {
        const krRow = {
          ...kr,
          type: "kr",
          objective: obj.objective || obj.name || kr.objective,
          objectiveID: obj.objectiveID,
          title: kr.keyResultName || kr.name,
          dueDate: formatDate(kr.dueDate || obj.dueDate),
          actualDate: formatDate(kr.actualDate),
          targetDate: formatDate(kr.targetDate),
          employeeNumber: kr.employeeNumber || obj.employeeNumber,
          owner: kr.ownerName || kr.owner || obj.ownerName || obj.owner,
        };
        flatRows.push(transformForExport(krRow));
        const tasks = Array.isArray(kr.children) ? kr.children : [];
        tasks.forEach((task) => {
          const taskRow = {
            ...task,
            type: "task",
            krID: kr.krID,
            objectiveID: obj.objectiveID,
            title: task.title || task.taskName,
            dueDate: formatDate(task.dueDate),
            employeeNumber: task.employeeNumber || obj.employeeNumber,
            owner: task.owner || obj.ownerName || obj.owner,
          };
          flatRows.push(transformForExport(taskRow));
        });
      });
    });
  } else if (okrData.isExportOKRs) {
    const objectives = objectives2.length > 0 ? objectives2 : [];
    flatRows = objectives.map((obj) => {
      const objRow = { ...obj, type: "obj", dueDate: formatDate(obj.dueDate) };
      return transformForExport(objRow);
    });
  }

  if (flatRows.length > 0) {
    // Ensure columns order matches template (right-side columns appear at the end)
    const worksheet = XLSX.utils.json_to_sheet(flatRows, { header: OKR_TEMPLATE_COLUMN_ORDER });
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