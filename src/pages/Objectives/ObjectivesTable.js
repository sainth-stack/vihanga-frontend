import { Options } from "./Options";
import { Handlers } from "./Handlers";
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import "./styles.scss";
import paginationFactory from "react-bootstrap-table2-paginator";
import Table from "components/Table";
import { useDispatch, useSelector } from "react-redux";
import LottieConfettie from "assets/images/LottieConfettie.gif";
import { LoadingIndicator, cascadeTabs } from "utilities";
import ObjectivesEditPopup from "./ObjectivesEditPopup";
import ConfirmModal from "components/ConfirmModal";
import CascadedPopup from "./OkrDetails/CascadedPopup";
import TasksEditPopup from "./TasksEditPopup";
import TasksView from "./TasksView";
import { cardData } from "./CardData";
import { cardData2 } from "./CardData2";
import { filterData } from "./ObjectivesTable/filterData";
import {
  tableGenerator,
  tableGeneratorChild,
} from "./ObjectivesTable/transformTable";
import {
  displayOpts,
  displayOpts2,
  selectRow,
} from "./ObjectivesTable/defaultData";
import ObjectiveHeader from "./ObjectivesTable/ObjectiveHeader";
import { totalQuartersData } from "./ObjectivesTable/getMonthsData";
import {
  handleCascade,
  handleSureDelete,
} from "./ObjectivesTable/handleFunctions";
import CreateColumn from "./ObjectivesTable/CreateColumn";
import PopupOKRLibrary from "./PopupOKRLibrary";
import { Columns } from "./Columns";
import useWindowSize from "components/UseWindowSize";
import ObjectiveMobileTable from "./ObjectiveMobile/ObjectiveMobileTable";
import search from "assets/svg/search.svg";
import SpeechRecognition from "react-speech-recognition";
import KRPopup from "./KRPopup";
import { getAuditHistory } from "action/TasksAct";
import ShowAuditHistory from "pages/TasksTableView/ShowAuditHistory";
import { Toast } from "service/toast";
import {
  useGetKeyResultsSingle,
  useGetObjectives,
} from "./hooks/useGetEmployees";
import { useQueryClient } from "@tanstack/react-query";
import RewardPointsComponent from "components/RewardPoints";
import { isPrivileged } from "utilities";
import { querySalesforce } from "service/integrationapis";
import {
  updatekeyResult,
} from "action/keyResultAct";
import { useHistory } from "react-router-dom";


export default function ObjectivesTable(props) {
  const isMobile = useWindowSize();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [, setError] = useState(false);
  const [updateObj, setUpdateObj] = useState({});
  const [orderModalShow3, setOrderModalShow3] = useState(false);
  const [orderModalShow4, setOrderModalShow4] = useState(false);
  const [openKRPopup, setOpenKRPopup] = useState(false);
  const [editTaskModal, setEditModalTask] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState();
  const [viewTaskModal, setViewModalTask] = useState(false);
  const [multipleObjectives, setMultipleObjectives] = useState(false);
  const [objectiveId, selectedObjectiveId] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const dispatch = useDispatch();
  const [searchKey, setSearchKey] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [displayOptions, setDisplayOptions] = useState(displayOpts);
  const [displayOptions2, setDisplayOptions2] = useState(displayOpts2);
  const [searchIcon, showSearchIcon] = useState(false);
  const [auditHistory, setAuditHistory] = useState([]);
  const [showAuditHistory, setShowAuditHistory] = useState(false);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [, setTabType] = useState(0);
  const [approvalRequired, setApprovalRequired] = useState(false);
  const queryClient = useQueryClient();
  const currentTab = useSelector((store) => store.user.currentTab);
  const isIndividual = isPrivileged("Objectives - Individual", "view");
  const isTeam = isPrivileged("Objectives - Team", "view");
  const isCompany = isPrivileged("Objectives - Company", "view");
  const {
    data: objectivesResponse,
    isLoading: objectivesLoading,
    refetch,
  } = useGetObjectives(currentTab);
  const { data: keyResultsResponse } = useGetKeyResultsSingle();
  const onChangeText = ({ target: { name, value } }) => {
    let updatedData = { ...displayOptions };
    updatedData[name] = value;
    setDisplayOptions(updatedData);
    setError("");
  };
  const SpeechRecog = () => {
    SpeechRecognition.startListening();
    setSearchKey("");
  };

  const onChangeText2 = ({ target: { name, value } }) => {
    let updatedData = { ...displayOptions2 };
    updatedData[name] = value;
    setDisplayOptions2(updatedData);
    setError("");
  };
  const { checkboxOptions, filterOptions } = Options(
    displayOptions,
    onChangeText,
    displayOptions2,
    onChangeText2
  );

  const refreshData = (
    id = null,
    userType = cascadeTabs.Individual,
    tabType = 0
  ) => {
    try {
      setTabType(tabType);
      if (props.refresh) {
        refetch();
      }
      setLoading(objectivesLoading);
      let user =
        localStorage.getItem("user") !== null
          ? JSON.parse(localStorage.getItem("user"))
          : null;
      if (user !== null) {
        console.log(objectivesResponse)
        const { data = [], privileges, message } = objectivesResponse;
        if (privileges && privileges.length > 0) {
          setPrivileges(privileges[0].privileges);
        }
        if (data !== undefined && data.length > 0) {
          let existingUser =
            localStorage.getItem("userData") !== null
              ? JSON.parse(localStorage.getItem("userData"))
              : null;
          let filteredData = [...data].filter(
            (item) =>
              item.employeeName ===
              (existingUser !== null
                ? existingUser.ownerName
                : props.companyInfo.employeeNames)
          );
          let result = tableGenerator(
            filteredData,
            filteredData.length,
            filteredData
          );
          if (!props.hideHeaders) {
            const {
            totalWeights,
              totalWeightsPercent,
              totalQ1,
              totalQ2,
              totalQ3,
              totalQ4,
            } = totalQuartersData(result, props.companyInfo);
            setTotalWeight(totalWeights);
            console.log("totaal weight: " + totalWeights)
            cardData(totalWeights, props?.setDataWeights);
            cardData2(totalWeightsPercent, props?.setDataWeightsPercent);
            console.log("toal weight percent: " + totalWeightsPercent)
            cardData2(totalQ1, props.setDataQ1);
            cardData2(totalQ2, props.setDataQ2);
            cardData2(totalQ3, props.setDataQ3);
            cardData2(totalQ4, props.setDataQ4);
          }
          setData(result);
          props.handlecallback(result);
          setError("");
          props.getdatafromtable(result);
          setLoading(objectivesLoading);
        } else if (data.length === 0) {
          setError("No Data Found!");
          setLoading(objectivesLoading);
          setData([]);
        } else {
          setError(message);
          setLoading(objectivesLoading);
        }
        const { data: keyresultsData } = keyResultsResponse;
        if (keyresultsData !== undefined && keyresultsData.length > 0) {
          let result = tableGeneratorChild(
            keyresultsData,
            keyresultsData.length
          );
          setData2(result);
          setError("");
        } else if (keyresultsData.length === 0) {
          setError("No Data Found!");
        }
      }
    } catch (error) {
      setLoading(objectivesLoading);
      setError(error.toString());
    }
  };
  useEffect(
    () => {
      refreshData();
    },
    [
      objectivesResponse?.data,
      props.refresh,
      props.refresh2,
      props.companyInfo,
    ]
  );

  const checkCelebration = () => {
    setShowGif(true);
    setTimeout(() => {
      setShowGif(false);
    }, 5000);
  };
  const handleCallbackTrans = (childData) => {
    setSearchKey(childData);
  };
  const handleCallback = () => {
    props.handleCallback2();
  };
  const handleOpenPopup = (state) => {
    setOpenKRPopup(true);
    setUpdateObj(state.data);
    setEditModal(false);
  };

  const handleAuditHistory = (id) => {
    let response2 = dispatch(getAuditHistory(id));
    response2.then(({ data, message }) => {
      if (data !== undefined && data.length > 0) {
        setAuditHistory(data);
        setShowAuditHistory(true);
        setError("");
      } else if (data.length === 0) {
        setError("No Data Found!");
        Toast({ message: "No Data Found!", type: "warning" });
      } else {
        setError(message);
      }
    });
  };

  const handleUpdateKeyResult = async (row) => {
    try {
      const query = row.query;
      const sfResponse = await querySalesforce({query});
      
      if(Array.isArray(sfResponse.data) && sfResponse.data.length > 0 && sfResponse.data[0].message === "INVALID_JWT_FORMAT") {
        Toast({ message: 'Your Salesforce session has expired. Please sign in again.', type: 'error' });
        localStorage.removeItem('sf_access_token');
        localStorage.removeItem('sf_refresh_token');
        localStorage.removeItem('salesforce_user');
        history.push('/admin/previlages/integrationManagement/salesforce/setup');
        return ;
      }
      // Then update key result
      const finalData = {
        ...row,
        actual: sfResponse.data?.totalSize || row.actual
      }
      const response = await dispatch(updatekeyResult(row._id, finalData));
      console.log("Key result update response:", response);
      if (response.success) {
        console.log("Key result updated successfully");
        refreshData();
        queryClient.invalidateQueries("objectives", "keyresults", "tasks");
      } else {
        console.error("Failed to update key result:", response.message);
        Toast({ message: 'Failed to update key result', type: 'error' });
      }
    } catch (error) {
      console.error("Error updating key result:", error);
      Toast({ message: 'Error updating key result', type: 'error' });
    }
  }

  const {
    handleEdit,
    handleDelete,
    handleDeleteKeyResults,
    handleViewTask,
    handleEditTask,
    handleDeleteTasks,
    handleCallbackEdit,
    handleBulkDelete,
    handlecallback,
    handleCallbackEditTask,
  } = Handlers(
    data,
    setUpdateObj,
    setLoading,
    dispatch,
    props,
    refreshData,
    checkCelebration,
    setEditModal,
    setError,
    setEditModalTask,
    setOrderModalShow3,
    selectedUsers,
    setSelectedUsers,
    setRewardPoints,
    setApprovalRequired
  );
  const { columns, columnsChild, columnsChildTasks } = Columns(
    handleEdit,
    setEditModal,
    privileges,
    refreshData,
    props,
    totalWeight,
    handleDelete,
    setOrderModalShow4,
    setMultipleObjectives,
    setSelectedObjective,
    handleDeleteKeyResults,
    handleViewTask,
    setViewModalTask,
    handleEditTask,
    setEditModalTask,
    handleDeleteTasks,
    handleOpenPopup,
    handleAuditHistory,
    currentTab !== cascadeTabs.Individual,
    handleUpdateKeyResult
  );
  return (
    <>
      <div className={showGif ? "gif" : "dgif"}>
        <img
          src={LottieConfettie}
          className={isMobile ? "mob-lottie-img col-12 h-50" : "lottie-img"}
          alt="LottieConfettie"
        />
        <br />
        <RewardPointsComponent
          rewardPoints={rewardPoints}
          approvalRequired={approvalRequired}
        />
      </div>
      <div
        className={
          isMobile ? "mt-2 pt-0 company-form-mobile" : "shadow mt-2 pt-0"
        }
      >
        {!props.hideHeaders && (
          <div className="d-flex justify-content-between align-items-center">
            {isMobile && (
              <div className="d-flex text-12 align-items-center">
                <input
                  type="checkbox"
                  id="selectAll"
                  className="mr-1"
                  checked={selectedUsers.length === data.length}
                  onChange={() => {
                    selectRow(
                      selectedUsers,
                      setSelectedUsers,
                      data
                    ).onSelectAll(
                      selectedUsers.length === data.length ? false : true
                    );
                  }}
                />{" "}
                <label htmlFor="selectAll" className="mb-0 font-weight-bold">
                  Select All
                </label>
              </div>
            )}
            <ObjectiveHeader
              SpeechRecog={SpeechRecog}
              searchKey={searchKey}
              setSearchKey={setSearchKey}
              privileges={privileges}
              handleSureDelete={() =>
                handleSureDelete(selectedUsers, setOrderModalShow3)
              }
              handleCascade={() =>
                handleCascade(
                  setMultipleObjectives,
                  selectedUsers,
                  selectedObjectiveId,
                  setOrderModalShow4
                )
              }
              checkboxOptions={checkboxOptions}
              filterOptions={filterOptions}
              onChangeText2={onChangeText2}
              showSearchIcon={showSearchIcon}
              searchIcon={searchIcon}
              handlecallback={handleCallbackTrans}
              forwardedRef={props.forwardedRef4}
            />
          </div>
        )}
        {!props.hideHeaders && (
          <CreateColumn
            setOrderModalShow3={(status) => props.setOrderModalShow3(status)}
            setOrderModalShow5={(status) => props.setOrderModalShow5(status)}
            forwardedRef={props.forwardedRef}
            forwardedRef1={props.forwardedRef5}
            forwardedRef2={props.forwardedRef6}
            handlecallback={handleCallback}
            privileges={privileges}
            filterCascadeData={(userType, tabType) => {
              localStorage.setItem("tabType", tabType);
              refetch();
              refreshData(null, userType, tabType);
            }}
            isCompany={isCompany}
            isTeam={isTeam}
            isIndividual={isIndividual}
          />
        )}
        {!props.hideHeaders && isMobile && searchIcon && (
          <div className="input-group col-lg-6 col-xs-12 col-sm-12 p-0 mt-5 nav-item search-bar">
            <div className="input-group-append searchInput-icon ">
              <img src={search} alt="search-icon" className="searchIcon" />
            </div>
            <input
              type="text"
              className="bg-light outline-none searchInput text-dark mt-0 fs14"
              placeholder="Search Objective by Due date, Owner or Success Metrics"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>
        )}
        {/* {!objectivesLoading && (
          <div className="text-center">
            <LoadingIndicator size={3} />
          </div>
        )} */}

        {objectivesLoading ?
          <div className="text-center">
            <LoadingIndicator size={3} />
          </div> :
          <Table
            title="objectives"
            data={filterData(data, displayOptions2, searchKey)}
            columns={columns().filter((item) => {
              let filteredNames = checkboxOptions
                .filter((checkbox) => checkbox.value)
                .map((check) => check.name);
              filteredNames.push("action");
              filteredNames.push("feed");
              return filteredNames.includes(item.dataField);
            })}
            paginationFactory={paginationFactory}
            searchKey={searchKey}
            selectRow={selectRow(
              selectedUsers,
              setSelectedUsers,
              data,
              currentTab === cascadeTabs.Individual ? false : true
            )}
            data2={data2}
            readonly={currentTab === cascadeTabs.Individual ? false : true}
            childData={{
              data,
              columnsChild,
              columnsChildTasks,
              searchKey,
              checkboxOptions,
            }}
          />
        }
      </div>
      {props.orderModalShow5 && (
        <PopupOKRLibrary
          show={props.orderModalShow5}
          onHide={() => {
            props.setOrderModalShow5(false);
            refreshData();
            queryClient.invalidateQueries("objectives", "keyresults", "tasks");
          }}
        />
      )}
      {editModal && (
        <ObjectivesEditPopup
          show={editModal}
          onHide={() => setEditModal(false)}
          updata={updateObj}
          owner={props.ownerDet}
          handlecallbackedit={handleCallbackEdit}
          loading={loading}
          privileges={privileges}
          handleOpenPopup={handleOpenPopup}
          readOnly={currentTab === cascadeTabs.Individual ? false : true}
        />
      )}
      {orderModalShow3 && (
        <ConfirmModal
          show={orderModalShow3}
          onHide={() => setOrderModalShow3(false)}
          onProceed={() => handleBulkDelete()}
        />
      )}
      {orderModalShow4 && (
        <CascadedPopup
          show={orderModalShow4}
          onHide={() => {
            setOrderModalShow4(false);
            refreshData();
          }}
          selectedObjective={
            multipleObjectives ? objectiveId : selectedObjective
          }
          handleCallback={handlecallback}
        />
      )}
      {editTaskModal && (
        <TasksEditPopup
          show={editTaskModal}
          onHide={() => setEditModalTask(false)}
          data={updateObj}
          owner={props.ownerDet}
          handlecallbackeditTask={handleCallbackEditTask}
        />
      )}
      {viewTaskModal && (
        <TasksView
          show={viewTaskModal}
          onHide={() => setViewModalTask(false)}
          data={updateObj}
          owner={props.ownerDet}
        />
      )}
      {openKRPopup && (
        <KRPopup
          show={openKRPopup}
          onHide={() => setOpenKRPopup(false)}
          data={updateObj}
        />
      )}
      {showAuditHistory && (
        <ShowAuditHistory
          data={auditHistory}
          show={showAuditHistory}
          onHide={() => setShowAuditHistory(false)}
        />
      )}
    </>
  );
}
