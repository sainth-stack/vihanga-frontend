import { Toast } from "service/toast";
import * as XLSX from "xlsx";
export const downloadExcel = (data, roleData) => {
  if (data.length > 0) {
    let allObjectives = [];
    data.forEach((item) => {
      let objectives = item.objectiveKeyResults.map((obj) => {
        let objj = {
          ...obj,
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
      //newObj.okrFunction = roleData.okrFunction;
      //newObj.okrCategory = roleData.okrCategory;
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
export const downloadExcel2 = (okrData, objectives2, keyResults2) => {
  let updatedObjectives = objectives2.length > 0 ? objectives2 : [];
  let finalData = okrData.includingKeyResults ? [...updatedObjectives, ...keyResults2] : [...updatedObjectives];
  const worksheet = XLSX.utils.json_to_sheet(finalData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "OKRLibrary" + Date.now() + ".xlsx");
};