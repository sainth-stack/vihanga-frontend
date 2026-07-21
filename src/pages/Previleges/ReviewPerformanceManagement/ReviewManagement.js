import SelectInput from 'components/Company/SelectInput';
import useGetEmployees from 'pages/Objectives/hooks/useGetEmployees';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import TextInput from 'components/Company/TextInput';
import { LoadingIndicator } from 'utilities';
import TableNormal from 'components/TableNormal';
import more from 'assets/svg/More.svg';
import trashIcon from "assets/svg/trashIcon.svg";
import editTableIcon from "assets/svg/editTableIcon.svg";
import { useDispatch } from 'react-redux';
import {getAllTemplates } from 'action/TemplatesAct';
import paginationFactory from "react-bootstrap-table2-paginator";
import Button from 'components/Company/Button';
import { createForm, deleteForm, getAllForms, updateForm } from 'action/LaunchFormAct';
import { createMultipleReviewForm, createReviewForm } from 'action/ReviewFormAct';
import { getAllPrivilegesGroup } from 'action/PrivilegesGroupAct';
import ViewEmployeesPopup from './ViewEmployeesPopup';

export default function ReviewManagement() {
  let companyObj = {
    formType: "",
    formTemplate: "",
    launchDate: null,
    reviewPeriodStartDate: null,
    reviewPeriodEndDate: null,
    employees: "",
    templateName: ""
  };
  const [companyInfo, setCompanyInfo] = useState(companyObj);
  const [templateInfo, setTemplateInfo] = useState({
    formType: "",
    formTemplate: "",
    launchDate: null,
    reviewPeriodStartDate: null,
    reviewPeriodEndDate: null,
    employees: [],
    employeesGroup: "",
    employeesDetails: [],
    templateName: ""
  });
  const { data: employeeResponse, message, success, isLoading } = useGetEmployees();
  const [empData, setEmpData] = useState([]);
  const [, setShowOkrs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEmployees, setShowEmployees] = useState(false);
  const [data, setData] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [previlegeGroups, setPrivilegeGroups] = useState([]);
  const [previlegeGroupsData, setPrivilegeGroupsData] = useState([]);
  const [formTypes,] = useState([
    {
      key: "Performance Management",
      value: "Performance Management",
    }
  ]);
  const [formTemplates, setFormTemplates] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLoading && employeeResponse && employeeResponse.data.length > 0) {
      let employeeData = employeeResponse && employeeResponse.data.length > 0 && employeeResponse.data.map((item) => {
        return {
          key:
            item.personalInformation.firstName +
            " " +
            item.personalInformation.lastName,
          value: item._id,
          role: item.employmentInformation.role
        };
      });
      setEmpData(employeeData);
    }
  }, [isLoading, employeeResponse])

  const handleInput = ({ target: { name, value } }) => {
    if (name === "employeesGroup") {
      let { activeGroupMembers = [] } = previlegeGroupsData.find(item => item._id === value);
      activeGroupMembers = activeGroupMembers.map((item) => {
        return {
          key:
            item.personalInformation.firstName +
            " " +
            item.personalInformation.lastName,
          value: item._id,
          profilePicture: item.personalInformation.profilePicture,
          role: item.employmentInformation.role
        };
      });
      templateInfo.employeesDetails = activeGroupMembers;
    }
    setTemplateInfo({ ...templateInfo, [name]: value });
  }

  const handleEdit = (row) => {
    setTemplateInfo(row);
    setShowForm(true);
  }


  const handleDelete = (id) => {
    setLoading(true);
    let response = dispatch(deleteForm(id));
    response.then(({ success, message, data }) => {
      if (success) {
        getLaunchForms();
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }

  const getLaunchForms = () => {
    setLoading(true);
    let response = dispatch(getAllForms());
    response.then(({ success, message, data }) => {
      if (success) {
        setData(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }

  const getTemplates = () => {
    setLoading(true);
    let response = dispatch(getAllTemplates());
    response.then(({ success, message, data }) => {
      if (success) {
        let updatedData = data.map(item => {
          return {
            key: item.templateName,
            value: item._id
          }
        })
        setFormTemplates(updatedData);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }
  const columns = [
    {
      dataField: "templateName",
      text: "NAME",
      sort: true,
      sortCaret: (order, column) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return (
          <p>
            {row.templateName}
          </p>
        );
      },
    },
    {
      dataField: "launchDate",
      text: "Launch Date",
      sort: true,
      sortCaret: (order, column) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return (
          <p>
            {row.launchDate}
          </p>
        );
      },
    },
    {
      dataField: "action",
      text: "ACTION",
      formatter: (cellContent, row) => {
        return (
          <div className="d-flex flex-wrap">
            <div className="dropdown actionDropdown">
              <button className="dropdown-toggle d-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img src={more} alt={more} style={{ height: 15 }} />
              </button>
              <div className="dropdown-menu text-left " aria-labelledby="dropdownMenuButton">
                <button className="btn btn-default dropdown-item text-capitalize text-left justify-content-start" onClick={() => handleEdit(row)}><img src={editTableIcon} alt="edit table icon" />&nbsp;Edit</button>
                <button className="btn btn-default dropdown-item text-capitalize text-left justify-content-start" onClick={() => handleDelete(row._id)}><img src={trashIcon} alt="edit table icon" />&nbsp;Delete</button>
              </div>
            </div>
          </div>
        );
      },
    }
  ]
  const selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    onSelect: (row) => {
      let totalData = [...selectedUsers];
      let filterData = totalData.findIndex(item => item._id === row._id);
      if (filterData < 0) {
        totalData.push(row);
        setSelectedUsers(totalData);
      } else {
        totalData.splice(filterData, 1);
        setSelectedUsers(totalData);
      }
    },
    onSelectAll: (isSelected) => {
      if (isSelected) {
        setSelectedUsers(data);
      } else {
        setSelectedUsers([]);
      }
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    let { activeGroupMembers = [] } = previlegeGroupsData.find(item => item._id === templateInfo.employeesGroup);
    templateInfo.employees = activeGroupMembers.map(item => item._id);
    templateInfo.templateName = formTemplates.filter(item => item.value === templateInfo.formTemplate)[0].key;
    let response = dispatch(createForm(templateInfo));
    response.then(({ success, message }) => {
      if (success) {
        let reqBody = templateInfo.employees.map((employee, index) => {
          let reqBody = {
            employeeName: employee,
            employeeFullName: empData.filter(item => item.value === employee)[0].key,
            reviewPeriod: templateInfo.reviewPeriodStartDate,
            totalAchievement: "0",
            overallRating: "0",
            goals: [],
            competencies: [],
            attachment: "",
            status: "Submit",
            templateName: templateInfo.templateName,
            templateId: templateInfo.formTemplate,
            companyId: localStorage.getItem("companyId") !== null ? JSON.parse(localStorage.getItem("companyId")) : null
          }
          return reqBody;
        })
        let response = dispatch(createMultipleReviewForm(reqBody));
        response.then(({ success, message }) => {
          if (success) {
            setLoading(false);
            getLaunchForms();
            setTemplateInfo({
              formType: "",
              formTemplate: "",
              launchDate: null,
              reviewPeriodStartDate: null,
              reviewPeriodEndDate: null,
              employees: "",
              templateName: ""
            })
            setShowForm(false);
          } else {
            setLoading(false);
          }
        })
      } else {
        setLoading(false);
      }
    });
  }

  const handleUpdate = () => {
    setLoading(true);
    let id = templateInfo._id;
    delete templateInfo.__v;
    delete templateInfo.createdAt;
    delete templateInfo.updatedAt;
    delete templateInfo._id;
    let { activeGroupMembers = [] } = previlegeGroupsData.find(item => item._id === templateInfo.employeesGroup);
    templateInfo.employees = activeGroupMembers.map(item => item._id);
    templateInfo.templateName = formTemplates.filter(item => item.value === templateInfo.formTemplate)[0].key;
    let response = dispatch(updateForm(id, templateInfo));
    response.then(({ success, message }) => {
      if (success) {
        let reqBody = templateInfo.employees.map((employee, index) => {
          let reqBody = {
            employeeName: employee,
            employeeFullName: empData.filter(item => item.value === employee)[0].key,
            reviewPeriod: templateInfo.reviewPeriodStartDate,
            totalAchievement: "0",
            overallRating: "0",
            goals: [],
            competencies: [],
            attachment: "",
            status: "Submit",
            templateName: templateInfo.templateName,
            templateId: templateInfo.formTemplate,
            companyId: localStorage.getItem("companyId") !== null ? JSON.parse(localStorage.getItem("companyId")) : null
          }
          return reqBody;
        })
        let response = dispatch(createReviewForm(reqBody));
        response.then(({ success, message }) => {
          if (success) {
            setLoading(false);
            getLaunchForms();
            setTemplateInfo({
              formType: "",
              formTemplate: "",
              launchDate: null,
              reviewPeriodStartDate: null,
              reviewPeriodEndDate: null,
              employees: "",
              templateName: ""
            })
            setShowForm(false);
          } else {
            setLoading(false);
          }
        })
      } else {
        setLoading(false);
      }
    });
  }


  const getPrevilegeGroups = () => {
    setLoading(true);
    let response = dispatch(getAllPrivilegesGroup());
    response.then(({ success, message, data }) => {
      if (success) {
        let { privilegeGroups } = data;
        let updatedData = privilegeGroups.map(item => ({ key: item.groupName, value: item._id }))
        console.log("Pre groups", privilegeGroups)
        setPrivilegeGroups(updatedData);
        setPrivilegeGroupsData(privilegeGroups);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }

  useEffect(() => {
    getTemplates();
    getLaunchForms();
  }, [])
  useEffect(() => {
    getPrevilegeGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm])
  return (
    <div className='p-4'>
      <h5>Advanced Review Management</h5>
      <div className=" m-0 p-0  mt-3 col-12 d-flex align-items-center">
        <TextInput label="Launch Form Name" name="searchKey"
          value={searchKey}
          onChangeText={setSearchKey}
          className=" form-control p-0 m-0" />

        <Button
          text="Create"
          className="bg-green border text-white"
          handleClick={() => setShowForm(!showForm)}
        />
      </div>


      {loading ? <div className="text-center"><LoadingIndicator size={3} /></div> :
        <TableNormal
          data={data}
          columns={columns}
          paginationFactory={paginationFactory}
          searchKey={searchKey}
          selectRow={selectRow}
          keyField="_id"
        />}

      {showForm && (
        <div className='mt-2'>
          <div className="row">
            <p className="col-sm-12 col-md-3">Form Type:</p>
            <div className="col-9">
              <SelectInput
                placeholder="Please select a form type..."
                name="formType"
                options={formTypes}
                value={templateInfo.formType}
                onChangeText={handleInput}
              />
            </div>
          </div>

          <div className="row">
            <p className="col-sm-12 col-md-3">Form Template:</p>
            <div className="col-9">
              <SelectInput
                placeholder="Please select a form template..."
                name="formTemplate"
                options={formTemplates}
                value={templateInfo.formTemplate}
                onChangeText={handleInput}
              />
            </div>
          </div>

          <div className="row">
            <p className="col-sm-12 col-md-3">Launch Date:</p>
            <div className="col-9">
              <TextInput
                label=""
                placeholder="Enter Launch Date"
                name="launchDate"
                dateType={"date"}
                value={templateInfo.launchDate}
                onChangeText={handleInput}
              />
            </div>
          </div>
          <br />
          <div className="row">
            <p className="col-sm-12 col-md-3">Review Period Start Date:</p>
            <div className="col-9">
              <TextInput
                label=""
                placeholder="Enter Start Date"
                name="reviewPeriodStartDate"
                value={templateInfo.reviewPeriodStartDate}
                onChangeText={handleInput}
                dateType={"date"}
              />
            </div>
          </div>
          <br />
          <div className="row">
            <p className="col-sm-12 col-md-3">Review Period End Date:</p>
            <div className="col-9">
              <TextInput
                label=""
                placeholder="Enter End Date"
                name="reviewPeriodEndDate"
                value={templateInfo.reviewPeriodEndDate}
                onChangeText={handleInput}
                dateType={"date"}
              />
            </div>
          </div>
          <br />

          <div className="d-flex">
            <p className="col-sm-12 col-md-3">Employees:</p>
            <div className="col-9">
              <SelectInput
                placeholder="Please select a form template..."
                name="employeesGroup"
                options={previlegeGroups}
                value={templateInfo.employeesGroup}
                onChangeText={handleInput}
              />
              <a href={null} className='link cursor-pointer usersList' onClick={() => setShowEmployees(!showEmployees)}>
                {templateInfo.employeesGroup ? templateInfo.employeesDetails.length : ""}
              </a>
            </div>
          </div>
          <br />
          <hr />
          <div>
            <div className="buttons ">
              <Button
                text="Cancel"
                className="bg-white border-grey"
                handleClick={() => setShowForm(false)}
              />
              <Button
                text={`${!!templateInfo._id ? "Update" : "Save"}`}
                className="bg-green border text-white"
                handleClick={!!templateInfo._id ? handleUpdate : handleSubmit}
              />
            </div>
          </div>
        </div>
      )}
      {showEmployees &&
        <ViewEmployeesPopup
          employees={templateInfo.employeesDetails}
          show={showEmployees}
          onHide={() => setShowEmployees(!showEmployees)}
        />}

    </div>
  )
}
