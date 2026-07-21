import { Options } from './Options';
import { Handlers } from './Handlers';
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import "./styles.scss";
import { useDispatch } from "react-redux";
import LottieConfettie from "assets/images/LottieConfettie.gif";
import { LoadingIndicator } from "utilities";
import ObjectivesEditPopupGoals from "./ObjectivesEditPopup";
import ConfirmModal from "components/ConfirmModal";
import CascadedPopup from "./OkrDetails/CascadedPopup";
import { cardData } from "./CardData";
import { cardData2 } from "./CardData2";
import { filterData } from "./ObjectivesTable/filterData";
import { tableGenerator } from "./ObjectivesTable/transformTable";
import { displayOpts, displayOpts2, selectRow } from "./ObjectivesTable/defaultData";
import ObjectiveHeader from "./ObjectivesTable/ObjectiveHeader";
import { totalQuartersData } from "./ObjectivesTable/getMonthsData";
import { handleCascade, handleSureDelete } from "./ObjectivesTable/handleFunctions";
import CreateColumn from "./ObjectivesTable/CreateColumn";
import PopupOKRLibrary from "./PopupOKRLibrary";
import { ReviewsColumns } from './ReviewsColumns';
import useWindowSize from 'components/UseWindowSize';
import ObjectiveMobileTable from './ObjectiveMobile/ObjectiveMobileTable';
import search from "assets/svg/search.svg";
import SpeechRecognition from "react-speech-recognition";
import { getAuditHistory } from 'action/TasksAct';
import ShowAuditHistory from 'pages/TasksTableView/ShowAuditHistory';
import { Toast } from 'service/toast';
import { useGetGoals } from './hooks/useGetEmployees';
import { useQueryClient } from '@tanstack/react-query';
import ReviewsCustomTable from './ReviewsCustomTable';
import ObjectivesEditPopup from 'pages/Objectives/ObjectivesEditPopup';
import KRPopup from 'pages/Objectives/KRPopup';
import TasksView from 'pages/Objectives/TasksView';
import { useMediaQuery, useTheme } from '@mui/material';



export default function GoalsTable(props) {
  console.log(props)
  const theme =useTheme()
  const isMobile =useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet =useMediaQuery(theme.breakpoints.between('sm', 'md'))
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
  const [selectedUsers, setSelectedUsers] = useState({});
  const [displayOptions, setDisplayOptions] = useState(displayOpts);
  const [displayOptions2, setDisplayOptions2] = useState(displayOpts2);
  const [searchIcon, showSearchIcon] = useState(false);
  const [auditHistory, setAuditHistory] = useState([]);
  const [showAuditHistory, setShowAuditHistory] = useState(false);
  const [data, setData] = useState([]);
  const [data2,] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const queryClient = useQueryClient();
  const { data: objectivesResponse, isLoading: objectivesLoading } = useGetGoals();
  const onChangeText = ({ target: { name, value } }) => {
    let updatedData = { ...displayOptions };
    updatedData[name] = value;
    setDisplayOptions(updatedData);
    setError("");
  };
  const SpeechRecog = () => {

    SpeechRecognition.startListening();
    //  setRef(true);
    setSearchKey("");
  };

  const onChangeText2 = ({ target: { name, value } }) => {
    let updatedData = { ...displayOptions2 };
    updatedData[name] = value;
    setDisplayOptions2(updatedData);
    setError("");
  };
  const { checkboxOptions, filterOptions } = Options(displayOptions, onChangeText, displayOptions2, onChangeText2, props.hideColumns);
  const refreshData = (id = null) => {
    try {
      let user = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null;
      if (user !== null) {
        const { data = [], privileges, message } = objectivesResponse;
        if (privileges && privileges.length > 0) {
          setPrivileges(privileges[0].privileges)
        }
        if (props.goals.length > 0) {
          let result = tableGenerator(props.goals, props.goals.length, props.goals);
          const { totalWeights, totalWeightsPercent, totalQ1, totalQ2, totalQ3, totalQ4, totalEmployeeRating, totalManagerRating } = totalQuartersData(result, props.companyInfo);
          cardData2(totalWeightsPercent, props?.setDataWeightsPercent);
          if (!props.hideHeaders) {
            setTotalWeight(totalWeights);
            cardData(totalWeights, props.setDataWeights);
            cardData2(totalQ1, props.setDataQ1);
            cardData2(totalQ2, props.setDataQ2);
            cardData2(totalQ3, props.setDataQ3);
            cardData2(totalQ4, props.setDataQ4);
            props.handleSetWeight(totalWeightsPercent);
            props.handleOverRating(totalEmployeeRating + totalManagerRating / (result.length * 2));
          }
          console.log(result)
          setData(result);
          setError("");
          props.getdatafromtable(result);
        } else if (data.length === 0) {
          setError("No Data Found!");
        } else {
          setError(message);
        }
      }
    } catch (error) {
      setError(error.toString());
    }
  };
  useEffect(() => {
    refreshData();
    //eslint-disable-next-line
  }, [props.goals]);
  const checkCelebration = () => {
    setShowGif(true);
    setTimeout(() => {
      setShowGif(false);
    }, 5000);
  }

  const handleCallbackTrans = (childData) => {
    setSearchKey(childData)
  }
  const handleCallback = () => {
    props.handleCallback2()
  }
  const handleOpenPopup = (state) => {
    setOpenKRPopup(true);
    setUpdateObj(state.data);
    setEditModal(false);
  }


  const handleAuditHistory = (id) => {
    let response2 = dispatch(getAuditHistory(id));
    response2.then(({ data, message }) => {
      if (data !== undefined && data.length > 0) {
        setAuditHistory(data);
        setShowAuditHistory(true)
        setError("");
      } else if (data.length === 0) {
        setError("No Data Found!");
        Toast({ message: "No Data Found!", type: "warning" });
      } else {
        setError(message);
      }
    });
  }
  const { handleEdit, handleDelete, handleDeleteKeyResults, handleViewTask, handleEditTask, handleDeleteTasks, handleCallbackEdit, handleBulkDelete, handlecallback } = Handlers(data, setUpdateObj, setLoading, dispatch, props, refreshData, checkCelebration, setEditModal, setError, setEditModalTask, setOrderModalShow3, selectedUsers, setSelectedUsers, setRewardPoints, props.templateInfo);
  const { columns, columnsChild, columnsChildTasks } = ReviewsColumns(props.stepStatus, handleEdit, setEditModal, privileges, props.refreshData, props, totalWeight, handleDelete, setOrderModalShow4, setMultipleObjectives, setSelectedObjective, handleDeleteKeyResults, handleViewTask, setViewModalTask, handleEditTask, setEditModalTask, handleDeleteTasks, handleOpenPopup, handleAuditHistory, props.hideColumns, props.handleUpdateGoals, props.isEmployee, props.isManager, props.status, props.templateInfo, selectedUsers, setSelectedUsers, props.ratingScale);

  // Remove managerRating column at self submission step
  const filteredColumns = props.status === 'Submit'
    ? columns.filter(col => col.id !== 'managerRating')
    : columns;
  console.log(data,'data')
  return (
    <>
      <div className={showGif ? "gif" : "dgif"}>
        <img src={LottieConfettie} className={isMobile ? "mob-lottie-img col-12 h-50" : "lottie-img"} alt="LottieConfettie" />
        <br />
        <h3>You have earned {rewardPoints} reward points</h3>
      </div>
      <div className="mt-2 pt-0">
        {!props.hideHeaders && <div className='d-flex justify-content-between align-items-center'>
          {isMobile && <div className='d-flex text-12 align-items-center'>
            <input type="checkbox" id="selectAll" className='mr-1' checked={selectedUsers.length === data.length} onChange={() => {
              selectRow(selectedUsers, setSelectedUsers, data).onSelectAll(selectedUsers.length === data.length ? false : true)
            }
            } /> <label htmlFor='selectAll' className='mb-0 font-weight-bold'>Select All</label>
          </div>}
          <ObjectiveHeader SpeechRecog={SpeechRecog} searchKey={searchKey} setSearchKey={setSearchKey} privileges={privileges} handleSureDelete={() => handleSureDelete(selectedUsers, setOrderModalShow3)} handleCascade={() => handleCascade(setMultipleObjectives, selectedUsers, selectedObjectiveId, setOrderModalShow4)} checkboxOptions={checkboxOptions} filterOptions={filterOptions} onChangeText2={onChangeText2} showSearchIcon={showSearchIcon} searchIcon={searchIcon} handlecallback={handleCallbackTrans} forwardedRef={props.forwardedRef4} />
        </div>}
        {!props.hideHeaders && <CreateColumn setOrderModalShow3={(status) => props.setOrderModalShow3(status)} setOrderModalShow5={(status) => props.setOrderModalShow5(status)} forwardedRef={props.forwardedRef} forwardedRef1={props.forwardedRef5} forwardedRef2={props.forwardedRef6} handlecallback={handleCallback} />}
        {!props.hideHeaders && isMobile && searchIcon && <div className="input-group col-lg-6 col-xs-12 col-sm-12 p-0 mt-5 nav-item search-bar">
          <div className="input-group-append searchInput-icon ">
            <img src={search} alt="search-icon" className="searchIcon" />
          </div>
          <input
            type="text"
            className="bg-light outline-none searchInput text-dark mt-0 fs14"
            placeholder="Search Goal by Due date, Owner or Success Metrics"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>}
        {loading ? (
          <div className="text-center">
            <LoadingIndicator size={3} />
          </div>
        ) : (
          data.length > 0 ? (
            isMobile ? <ObjectiveMobileTable
              privileges={privileges}
              companyInfo={props.companyInfo}
              handleEdit={handleEdit}
              setEditModal={setEditModal}
              handleDelete={handleDelete}
              setOrderModalShow4={setOrderModalShow4}
              setMultipleObjectives={setMultipleObjectives}
              setSelectedObjective={setSelectedObjective}
              selectedUsers={selectedUsers}
              setSelectedUsers={(row) => selectRow(selectedUsers, setSelectedUsers, data).onSelect(row)}
              handleDeleteKeyResults={handleDeleteKeyResults}
              handleViewTask={handleViewTask}
              setViewModalTask={setViewModalTask}
              handleEditTask={handleEditTask}
              setEditModalTask={setEditModalTask}
              handleDeleteTasks={handleDeleteTasks}
              refreshData={refreshData}
              totalWeight={totalWeight}
              title="objectives"
              data={filterData(data, displayOptions2, searchKey)}
              columns={columns.filter((item) => {
                let filteredNames = checkboxOptions
                  .filter((checkbox) => checkbox.value)
                  .map((check) => check.name);
                filteredNames.push("action");
                filteredNames.push("feed");
                return filteredNames.includes(item.dataField);
              })}
              // Removed paginationFactory as it's not needed for mobile view
              searchKey={searchKey}
              selectRow={selectRow(selectedUsers, setSelectedUsers, data)}
              data2={data2}
              childData={{
                data,
                columnsChild,
                columnsChildTasks,
                searchKey,
                checkboxOptions,
              }} /> : <ReviewsCustomTable
              loading={loading}
              columns={filteredColumns.filter((item) => {
                let filteredNames = checkboxOptions
                  .filter((checkbox) => checkbox.value)
                  .map((check) => check.name);
                filteredNames.push("action");
                filteredNames.push("feed");
                return filteredNames.includes(item.id);
              })}
              data={filterData(data, displayOptions2, searchKey, props.hideColumns)}
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              totalCount={data.length}
              rowsPerPageOptions={[5, 8, 10, 20]}
              pagination={true}
              search={searchKey}
              setSearch={setSearchKey}
              selectedItems={selectedUsers}
              setSelectedItems={setSelectedUsers}
              onRowsPerPageChange={(newRowsPerPage) => {
                setRowsPerPage(newRowsPerPage);
                setPage(0);
              }}
            />) : <div className="text-center">
            <h5 className={`mb-4 mt-4 pb-4 text-danger ${isMobile || isTablet ? "text-center" :""}`}>No Goals Found</h5>
          </div>
        )}
      </div>
      {props.orderModalShow5 && (
        <PopupOKRLibrary show={props.orderModalShow5} onHide={() => {
          props.setOrderModalShow5(false);
          refreshData();
          queryClient.invalidateQueries("goals", "objectives", "keyresults", "tasks");
        }
        } />
      )}
      {editModal && props.templateInfo?.percentageType === 'goal' ?
        <ObjectivesEditPopupGoals
          show={editModal}
          onHide={() => setEditModal(false)}
          updata={updateObj}
          owner={props.ownerDet}
          handlecallbackedit={handleCallbackEdit}
          loading={loading}
          privileges={privileges}
        /> :
        <> {editModal && <ObjectivesEditPopup show={editModal}
          onHide={() => setEditModal(false)}
          updata={updateObj}
          owner={props.ownerDet}
          handlecallbackedit={handleCallbackEdit}
          loading={loading}
          privileges={privileges}
          readOnly={true}
        />}</>
      }

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
          refresher={props.refresher}
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
      {showAuditHistory && <ShowAuditHistory
        data={auditHistory}
        show={showAuditHistory}
        onHide={() => setShowAuditHistory(false)}
      />}
    </>
  );
}
