import React, { useState, useEffect } from "react";
import "./styles.scss";
import Button from "components/Company/Button";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import search from "assets/svg/search.svg";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CheckboxInput2 from "components/Company/CheckboxInput2";
import {
  removeDuplicates,
  LoadingIndicator,
  AuthUserId,
  AuthUserName,
} from "utilities";
import { getEmployees } from "action/EmployeeAct";
import useWindowSize from "components/UseWindowSize";

import {
  cascadeObjective,
  cascadeObjectiveWithKeyResults,
} from "action/UserAct";
import { useTranslation } from "react-i18next";
import { Chip } from "@mui/material";

const ASSIGNEE_TYPES = {
  EMPLOYEES: "employees",
  ORGANIZATION: "organization",
  FUNCTION: "function",
  TEAMS: "teams",
};

// isAlignedToCompany: "Yes" for company/org/function/team aligned, "No" for individual
const getIsAlignedToCompany = (assigneeType) => {
  return assigneeType === ASSIGNEE_TYPES.EMPLOYEES ? "No" : "Yes";
};

const getAssigneeTypeLabel = (type, t) => {
  const labels = {
    [ASSIGNEE_TYPES.EMPLOYEES]: t("OKR Details.Employees"),
    [ASSIGNEE_TYPES.ORGANIZATION]: t("OKR Details.Organization"),
    [ASSIGNEE_TYPES.FUNCTION]: t("OKR Details.Function"),
    [ASSIGNEE_TYPES.TEAMS]: t("OKR Details.Team"),
  };
  return labels[type] || type;
};

export const tableGenerator = (data, length) => {
  const display = {};
  data.map((item) => (display[item._id] = true));
  return display;
};

export default function SearchEmployees(props) {
  const dispatch = useDispatch();
  const revampCascade = useSelector((state) => state.companyConfig?.revampCascade === true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [personalInformation, setPersonalInformation] = useState([]);
  const [searchEmployee, setSearchEmployee] = useState("");
  const [assigneeType, setAssigneeType] = useState(ASSIGNEE_TYPES.ORGANIZATION);
  const [expandedAssignees, setExpandedAssignees] = useState({});
  const [krDetailsPerAssignee, setKrDetailsPerAssignee] = useState({});
  const isMobile = useWindowSize();

  const selectedTab =
    JSON.parse(localStorage.getItem("selectedTab")) || { tab: "me" };
  const user = JSON.parse(localStorage.getItem("user")) || null;

  const fetchEmployees = () => {
    try {
      setLoading(true);
      let response = dispatch(getEmployees());
      response.then(({ data, message }) => {
        let filterData = (data || []).filter(
          (item) => item.userType !== "Testing"
        );

        if (selectedTab?.tab === "me" || selectedTab?.tab === "myteam") {
          filterData = filterData.filter(
            (item) => item.employmentInformation?.lineManager === user?._id
          );
        } else if (selectedTab?.tab === "mycompany") {
          // No additional filtering for mycompany
        }

        if (filterData !== undefined && filterData.length > 0) {
          const personalInfo = filterData.map((item) => ({
            label:
              item.personalInformation.firstName +
              " " +
              item.personalInformation.lastName,
            value: false,
            name: item._id,
            _id: item._id,
          }));
          let nonduplicates = removeDuplicates(personalInfo, "label");
          setPersonalInformation(nonduplicates);
          setError("");
        } else if ((filterData || []).length === 0) {
          setPersonalInformation([]);
          setError("No Data Found!");
        } else {
          setError(message || "No Data Found!");
        }
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const clearData = () => {
    fetchEmployees();
    setExpandedAssignees({});
    setKrDetailsPerAssignee({});
  };

  // Radio buttons are display-only (label). List always shows employees, regardless of selection.
  const getAssigneesList = () => personalInformation;

  const getSelectedObjectives = () => {
    const data = props.selectedData || [];
    const data2 = props.selectedData2 || [];
    return [...data, ...data2];
  };

  const toggleAssigneeExpand = (assigneeId) => {
    setExpandedAssignees((prev) => ({
      ...prev,
      [assigneeId]: !prev[assigneeId],
    }));
  };

  const onChangeText = (e, index) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    let updatedData = [...getAssigneesList()];
    const findIndex = updatedData.findIndex((item) => item._id === index);
    if (findIndex >= 0) {
      updatedData[findIndex] = { ...updatedData[findIndex], value };
      setPersonalInformation(updatedData);
    }
  };

  const parseObjectiveWeightNumber = (fallback) => {
    const fb = Number(fallback);
    return Number.isFinite(fb) ? fb : 0;
  };

  const formatObjectiveWeightDisplay = (weight) => {
    if (weight === undefined || weight === null || weight === "") {
      return "";
    }
    return String(weight);
  };

  const onKrDetailChange = (assigneeId, objectiveId, krId, field, value) => {
    setKrDetailsPerAssignee((prev) => {
      const assigneeData = prev[assigneeId] || {};
      const objectiveData = assigneeData[objectiveId] || {};
      const krData = objectiveData[krId] || {};
      return {
        ...prev,
        [assigneeId]: {
          ...assigneeData,
          [objectiveId]: {
            ...objectiveData,
            [krId]: { ...krData, [field]: value },
          },
        },
      };
    });
  };

  const getKrDetail = (assigneeId, objectiveId, krId, field, kr) => {
    const storedKr = krDetailsPerAssignee[assigneeId]?.[objectiveId]?.[krId];
    const hasUserValue = storedKr && Object.prototype.hasOwnProperty.call(storedKr, field);
    let val;

    if (hasUserValue) {
      val = storedKr[field];
      if (val === undefined || val === null) val = "";
    } else if (kr) {
      if (field === "targetValue") {
        val = kr.target ?? kr.actual ?? "";
      } else if (field === "targetDate" && kr.targetDate) {
        val = kr.targetDate;
      } else if (field === "weight") {
        val = kr.weight ?? "";
      } else {
        val = "";
      }
    } else {
      val = "";
    }

    if (field === "targetDate" && val) {
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        val = d.toISOString().slice(0, 10);
      }
    }
    return val;
  };

  const sumKrWeightsForAssigneeObjective = (assigneeId, objectiveId, krList) => {
    let sum = 0;
    for (const kr of krList || []) {
      const krId = kr._id || kr.keyResultId;
      const w = getKrDetail(assigneeId, objectiveId, krId, "weight", kr);
      const n = parseFloat(w);
      if (!Number.isNaN(n)) {
        sum += n;
      }
    }
    return Math.round(sum * 1000) / 1000;
  };

  const buildKeyResultsWithDetails = (keyResults, assigneeId, objectiveId) => {
    return (keyResults || []).map((kr) => {
      const krId = kr._id || kr.keyResultId;
      const details = krDetailsPerAssignee[assigneeId]?.[objectiveId]?.[krId];
      const targetDate = details?.targetDate
        ? (details.targetDate instanceof Date
            ? details.targetDate
            : new Date(details.targetDate))
        : kr.targetDate;
      return {
        ...kr,
        target: details?.targetValue ?? kr.target ?? kr.actual ?? "",
        targetDate: targetDate && !isNaN(targetDate?.getTime?.()) ? targetDate : kr.targetDate,
        weight: details?.weight ?? kr.weight ?? 0,
        isAlignedToCompany: getIsAlignedToCompany(assigneeType),
        actual: 0,
        actualDate: null,
        percent: 0,
      };
    });
  };

  const getResolvedAssignees = () => {
    const assigneesList = getAssigneesList();
    return assigneesList.filter((item) => item.value === true);
  };

  const handleSave = () => {
    const selectedObjectives = getSelectedObjectives();
    if (!selectedObjectives || selectedObjectives.length === 0) {
      setError("Please select objectives first.");
      return;
    }

    const selectedAssignees = getResolvedAssignees();

    if (selectedAssignees.length === 0) {
      setError("Please select at least one assignee.");
      return;
    }

    const isType1 = (props.selectedData || []).length > 0;
    const cascadedType = isType1 ? "type1" : "type2";

    const effectiveAssigneeType = revampCascade ? assigneeType : ASSIGNEE_TYPES.ORGANIZATION;
    const isAlignedToCompany = getIsAlignedToCompany(effectiveAssigneeType);

    const processAndSave = (singleItem) => {
      let keyResults = singleItem.keyResults || [];
      const finalPayload = selectedAssignees.map((item) => {
        const resolvedObjectiveWeight = revampCascade
          ? parseObjectiveWeightNumber(singleItem.weight)
          : Number(singleItem.weight) || 0;

        const obj = {
          ...singleItem,
          employeeName: item.label,
          employeeReferenceId: item._id,
          owner: item._id,
          cascadedType,
          cascadedById: AuthUserId,
          cascadedByName: AuthUserName,
          cascadedObjectiveId: singleItem.objId,
          cascadeAssigneeType: effectiveAssigneeType,
          isAlignedToCompany,
          rollupActual: props.rollupActual || false,
          weight: resolvedObjectiveWeight,
          percent: 0,
          progressStatus: 0,
        };
        obj.keyResults = revampCascade
          ? buildKeyResultsWithDetails(
              keyResults,
              item._id,
              singleItem.objId
            )
          : (keyResults || []).map((kr) => ({
              ...kr,
              isAlignedToCompany,
              actual: 0,
              actualDate: null,
              percent: 0,
            }));
        return obj;
      });

      setLoading(true);
      setError("");
      dispatch(cascadeObjective(finalPayload))
        .then(({ data, message, success }) => {
          const krPayload = data.map((kr) => ({
            ...kr,
            cascadeAssigneeType: effectiveAssigneeType,
            isAlignedToCompany,
          }));
          return dispatch(cascadeObjectiveWithKeyResults(krPayload));
        })
        .then((response) => {
          setLoading(false);
          setError("");
          props.handleCallback({ dataRefresh: true });
          props.onHide();
        })
        .catch((err) => {
          setLoading(false);
          setError(err?.message || err?.toString() || "Error occurred");
        });
    };

    selectedObjectives.forEach((singleItem) => processAndSave(singleItem));
  };

  const filterEmployeeData = (data) => {
    return (data || []).filter(
      (item) =>
        (item.label || "")
          .toLowerCase()
          .indexOf((searchEmployee || "").toLowerCase()) !== -1
    );
  };

  const { t } = useTranslation();
  const assigneesList = filterEmployeeData(getAssigneesList());
  const selectedObjectives = getSelectedObjectives();
  const showKrAccordion = revampCascade && selectedObjectives.length > 0;
  const assigneeLabel = revampCascade
    ? getAssigneeTypeLabel(assigneeType, t)
    : t("OKR Details.Employees");

  return (
    <div>
      <div className="bg-light-white rounded-12 m-3">
        <div>
          <span className="child-title">
            {t("OKR Details.Search and Select Assignee")}
          </span>

          {revampCascade && (
            <div className="mt-3">
              <div className="d-flex flex-wrap gap-3 align-items-center" style={{ gap: "12px" }}>
                {[ASSIGNEE_TYPES.ORGANIZATION, ASSIGNEE_TYPES.FUNCTION, ASSIGNEE_TYPES.TEAMS].map((type) => (
                  <label
                    key={type}
                    className="d-flex align-items-center"
                    style={{ cursor: "pointer", marginRight: "16px" }}
                  >
                    <input
                      type="radio"
                      name="assigneeType"
                      value={type}
                      checked={assigneeType === type}
                      onChange={() => setAssigneeType(type)}
                    />
                    <span className="ml-2">
                      {getAssigneeTypeLabel(type, t)}
                    </span>
                  </label>
                ))}
                <Chip
                  label={getAssigneeTypeLabel(assigneeType, t)}
                  size="small"
                  sx={{
                    height: "22px",
                    fontSize: "12px",
                    fontWeight: 600,
                    backgroundColor: "#E8F5E9",
                    color: "#2E7D32",
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-3 mb-2">
              <div
                className="alert alert-danger d-flex align-items-center"
                role="alert"
                style={{
                  backgroundColor: "#f8d7da",
                  color: "#721c24",
                  border: "1px solid #f5c6cb",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  fontSize: "14px",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-exclamation-triangle-fill me-2"
                  viewBox="0 0 16 16"
                  style={{ minWidth: "20px" }}
                >
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <Row className="mt-2">
            <Col lg={isMobile ? "8" : ""}>
              <label className="label">{assigneeLabel}</label>
              <div className="input-group-append searchInput-icon3">
                <img src={search} alt="search-icon" className="searchIcon" />
              </div>
              <input
                type="text"
                className="bg-light outline-none searchInput text-dark fs14"
                placeholder="Search"
                aria-label="Search"
                value={searchEmployee}
                onChange={(e) => setSearchEmployee(e.target.value)}
              />
            </Col>
          </Row>

          <Row className="mt-4">
            <Col>
              <div className="card-head">
                {assigneeLabel}
              </div>
              <div className="custom-card">
                {assigneesList.length > 0 ? (
                  revampCascade ? (
                    assigneesList.map((checkbox, index) => (
                      <div
                        className="assignee-row mt-3"
                        key={checkbox._id || index}
                      >
                        <div className="assignee-row-header d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center flex-grow-1">
                            {showKrAccordion ? (
                              <button
                                type="button"
                                className="accordion-arrow-btn"
                                onClick={() => toggleAssigneeExpand(checkbox._id)}
                                aria-expanded={
                                  !!expandedAssignees[checkbox._id]
                                }
                              >
                                {expandedAssignees[checkbox._id] ? (
                                  <KeyboardArrowDownIcon
                                    fontSize="small"
                                    sx={{ color: "#837F39" }}
                                  />
                                ) : (
                                  <KeyboardArrowRightIcon
                                    fontSize="small"
                                    sx={{ color: "#837F39" }}
                                  />
                                )}
                              </button>
                            ) : (
                              <span className="accordion-arrow-placeholder" />
                            )}
                            <PersonOutlineIcon
                              fontSize="small"
                              sx={{ color: "#666", fontSize: 18, mr: 0.75 }}
                            />
                            <span className="assignee-name">{checkbox.label}</span>
                          </div>
                          <div className="assignee-checkbox-right">
                            <input
                              type="checkbox"
                              checked={!!checkbox.value}
                              onChange={(e) =>
                                onChangeText(e, checkbox._id)
                              }
                              className="assignee-checkbox-input"
                            />
                          </div>
                        </div>

                        {showKrAccordion &&
                          checkbox.value &&
                          expandedAssignees[checkbox._id] && (
                            <div className="kr-details-card">
                            <div className="kr-details-card-title">
                              {t("OKR Details.KR Details")} -{" "}
                              {checkbox.label?.toUpperCase()}
                            </div>
                            {selectedObjectives.map((obj) => (
                              <div
                                key={obj.objId}
                                className="kr-details-objective-block"
                              >
                                <div className="kr-details-objective-name">
                                  {obj.objective || "Objective"}
                                </div>
                                <div className="kr-objective-weight-section mb-2">
                                  <div className="kr-input-group kr-objective-weight-group">
                                    <label className="kr-input-label">
                                      {t("OKR Details.ObjectiveWeight")}
                                    </label>
                                    <input
                                      type="text"
                                      className="kr-input-field"
                                      readOnly
                                      placeholder="e.g. 100"
                                      value={formatObjectiveWeightDisplay(
                                        obj.weight
                                      )}
                                    />
                                  </div>
                                  <div
                                    className="kr-weight-sum-hint text-muted mt-1"
                                    style={{ fontSize: "12px" }}
                                  >
                                    Sum of KR weights:{" "}
                                    {sumKrWeightsForAssigneeObjective(
                                      checkbox._id,
                                      obj.objId,
                                      obj.keyResults
                                    )}
                                    {" · Objective weight: "}
                                    {parseObjectiveWeightNumber(obj.weight)}
                                  </div>
                                </div>
                                {(obj.keyResults || []).map((kr) => {
                                  const krId = kr._id || kr.keyResultId;
                                  const krName =
                                    kr.keyResultName || kr.okrName || "";
                                  return (
                                    <div
                                      key={krId}
                                      className="kr-details-kr-block"
                                    >
                                      {krName && (
                                        <div className="kr-details-kr-name">
                                          {krName}
                                        </div>
                                      )}
                                      <div className="kr-details-kr-row">
                                      <div className="kr-input-group">
                                        <label className="kr-input-label">
                                          {t("OKR Details.Target Value")}
                                        </label>
                                        <input
                                          type="text"
                                          className="kr-input-field"
                                          placeholder="e.g. 100%"
                                          value={getKrDetail(
                                            checkbox._id,
                                            obj.objId,
                                            krId,
                                            "targetValue",
                                            kr
                                          )}
                                          onChange={(e) =>
                                            onKrDetailChange(
                                              checkbox._id,
                                              obj.objId,
                                              krId,
                                              "targetValue",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                      <div className="kr-input-group">
                                        <label className="kr-input-label">
                                          {t("OKR Details.Target Date")}
                                        </label>
                                        <input
                                          type="date"
                                          className="kr-input-field"
                                          placeholder="dd/mm/yyyy"
                                          value={getKrDetail(
                                            checkbox._id,
                                            obj.objId,
                                            krId,
                                            "targetDate",
                                            kr
                                          )}
                                          onChange={(e) =>
                                            onKrDetailChange(
                                              checkbox._id,
                                              obj.objId,
                                              krId,
                                              "targetDate",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                      <div className="kr-input-group">
                                        <label className="kr-input-label">
                                          {t("OKR Details.Weight")}
                                        </label>
                                        <input
                                          type="text"
                                          className="kr-input-field"
                                          placeholder="e.g. 40"
                                          value={getKrDetail(
                                            checkbox._id,
                                            obj.objId,
                                            krId,
                                            "weight",
                                            kr
                                          )}
                                          onChange={(e) =>
                                            onKrDetailChange(
                                              checkbox._id,
                                              obj.objId,
                                              krId,
                                              "weight",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    assigneesList.map((checkbox, index) => (
                      <div className="mt-3" key={checkbox._id || index}>
                        <CheckboxInput2
                          label={checkbox.label}
                          icon="employees"
                          name={checkbox.name}
                          key={checkbox._id || index}
                          onChangeText={(e, id) => onChangeText(e, checkbox._id)}
                          value={checkbox.value}
                          index={checkbox._id}
                        />
                      </div>
                    ))
                  )
                ) : (
                  <div className="text-muted p-3">No data found</div>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {loading ? (
        <LoadingIndicator />
      ) : (
        <div className="buttons">
          <Button
            text={t("OKR Details.Clear")}
            className="bg-white border-grey"
            handleClick={clearData}
          />
          <Button
            text={t("OKR Details.Cascade")}
            className="bg-green border text-white"
            handleClick={handleSave}
          />
        </div>
      )}
    </div>
  );
}
