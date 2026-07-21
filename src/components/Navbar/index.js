/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { links } from "routes/routes";
import { NavLink, Link, useHistory } from "react-router-dom";
import "./styles.scss";
import search from '../../assets/svg/search.svg'
import notification from '../../assets/svg/notification.svg'
import help from '../../assets/svg/help.svg'
import userprofile from '../../assets/images/userprofile.png'
import Logo from "components/Logo";
import { getAllNotifications, getAllNotificationsByUser, getAllNotificationsCount } from "action/NotificationAct";
import { getPrivilege } from "action/PrivilegesAct";
import { getNavBarDatas } from "action/NavBarSearchAct";
import ProxyAsModal from "./ProxyAsModal";
import { changePassword, getEmployees, updateEmployee } from "action/EmployeeAct";
import useWindowSize from "components/UseWindowSize";
import AdminActivities from "../Sidebar/AdminActivities";
import { AuthUserId, getRandom, LoadingIndicator, handleLink, AuthRole, AuthLineManager } from "utilities";
import { logout as apiLogout } from "service/utilities";
import emp from '../../assets/svg/employees.svg'
import obj from '../../assets/svg/objective.svg'
import keyres from '../../assets/svg/child.svg'
import tasksi from '../../assets/svg/tasks.svg'
import TasksView from "pages/Objectives/TasksView";
import OnBoarding from "./onboardingPopup";
import HelpPopup from './helpPopup';
import ChangePassword from "./ChangePassword";
import { Toast } from "service/toast";
import LanguageSelector from "./languageSelector";
import { useTranslation } from 'react-i18next';
import NewTopHeader from "./newTopHeader";
import ToggleTabs from "pages/vihanga/components/commonSwichButtons";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import maleIcon from "assets/images/male.png";
import femaleIcon from "assets/images/female.png";
function SearchBar({ objectivesData, setTaskData, setViewModalTask, getNavBarDatas1, handlecallback }) {
  const [searchStart, setSearchStart] = useState(false)
  const [value, setValue] = useState('')
  const [filterData3, setFilterData3] = useState([])
  const { t } = useTranslation()
  let history = useHistory();
  const handleChange1 = (e) => {
    setSearchStart(true)
    setValue(e.target.value)
    handlecallback(e.target.value)
    if (e.target.value === '') {
      setSearchStart(false)
    }
  }
  const handleClick1 = (item) => {
    setValue('')
    setSearchStart(false)
    if (item.label == 'keyResult') {
      history.push({
        pathname: "/admin/objectives/okrdetails",
        state: { data: { objective: item.data.okrName, objectiveId: item.data.objectiveId, ...item.data, keyId: item.data._id } }
      })
    }
    else if (item.label == 'task') {
      setTaskData(item.data)
      setViewModalTask(true)
    }
    else if (item.label == 'employee') {
      history.push({
        pathname: "/admin/setups/employeeEdit",
        state: { data: { ...item.data } }
      })
    }
    else {
      history.push({
        pathname: "/admin/objectives/okrdetails",
        state: {
          data: {
            ...item.data,
            objectiveId: item.data._id,
            // ownerName: "companyInfo",
          },
        },
      })
    }
  }
  useEffect(() => {
    if (objectivesData && objectivesData.length > 0) {
      const updateData = objectivesData.filter(item => item.key.toLowerCase().includes(value.toLowerCase()));
      setFilterData3(updateData)
    }
  }, [objectivesData])

  return (
    <>

      <div className="input-group p-0 nav-item search-bar " style={{}}>
        <div className="input-group-append searchInput-icon ">
          {/* <i className="fa fa-search" /> */}
          <img
            src={search}
            alt="search-icon"
            className="searchIcon updatedBuild"
          />
        </div>
        <input
          type="text"
          className="bg-light outline-none searchInput text-dark fs14"
          placeholder={t("Navbar.place")}
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
          value={value}
          onChange={(e) => handleChange1(e)}
        />
        {searchStart && (
          <div className="list-group col-md-4 searchg">
            {filterData3.map((item, index) => {
              return (
                <button
                  type="button"
                  onClick={(e) => handleClick1(item)}
                  key={index}
                  className="list-group-item list-group-item-action d-flex justify-content-between"
                >
                  <div>{item.key}</div>
                  <img src={item.icon} alt="img1" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
function Navbar() {
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [dataCount, setDataCount] = useState(0);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [privileges, setPrivileges] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeesDetails, setEmployeesDetails] = useState([]);
  const [showSearch, setShowSearch] = useState(false)
  const [objectivesData, setObjectivesData] = useState([])
  const [viewModalTasks, setViewModalTask] = useState(false)
  const [taskData, setTaskData] = useState({})
  const [orderModalShow5, setOrderModalShow5] = useState(false);
  const [orderModalShow6, setOrderModalShow6] = useState(false);
  const [changePass, setChangePasswordModal] = useState(false)
  const history = useHistory()
  let user = getItemFromLocalStorage("user");
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const logoutUser = () => {
    apiLogout();
  };
  let selectedTab =
    getItemFromLocalStorage("selectedTab")
  const isMobile = useWindowSize();
  // privilege based tabs visibility
  const privilegesFromLocal = getItemFromLocalStorage("privileges") || []
  const effectivePrivileges =
    privileges && privileges?.length > 0 ? privileges : privilegesFromLocal;
  const hasTeamAccess =
    Array.isArray(effectivePrivileges) && (effectivePrivileges)?.some?.(
      (p) => p && p.page === "Team Level Access" && p.view
    );
  const hasCompanyAccess =
    Array.isArray(effectivePrivileges) && (effectivePrivileges)?.some?.(
      (p) => p && p.page === "Company Level Access" && p.view
    );
  const showAccessTabs = hasTeamAccess || hasCompanyAccess;
  //const getNotifications = () => {
  //  try {
  //    let userData = localStorage.getItem("userData") !== null ? JSON.parse(localStorage.getItem("userData")) : null;
  //    let response = dispatch(getAllNotificationsCount(userData.ownerId));
  //    response.then(({ data, message }) => {
  //      if (data !== undefined && data > 0) {
  //        setDataCount(data);
  //        setLoading(false);
  //        setError("");
  //      } else if (data === 0) {
  //        setLoading(false);
  //        setError("No Data Found!");
  //        setDataCount(0);
  //      } else {
  //        setLoading(false);
  //        setError(message);
  //      }
  //    });
  //  } catch (error) {
  //    setLoading(false);
  //    setError(error.toString());
  //  }
  //}
  const getNotificationsAll = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllNotificationsByUser(AuthUserId));
      response.then(({ data, message, count }) => {
        if (data !== undefined && data.length > 0) {
          setData(data);
          setDataCount(count);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setError("No Data Found!");
          setDataCount(0);
          setData([]);
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  }
  const getAllPrivileges = () => {
    try {
      setLoading(true);
      let user = getItemFromLocalStorage("user");
      if (user !== null) {
        let role = user.role;
        let response = dispatch(getPrivilege(role));
        response.then(({ data, message }) => {
          if (data !== undefined && data.length > 0) {
            setPrivileges(data[0]?.privileges);
            setLoading(false);
            setError("");
            localStorage.setItem("privileges", JSON.stringify(data[0]?.privileges))
          } else if (data?.length === 0) {
            setLoading(false);
            setError("No Data Found!");
            localStorage.setItem("privileges", JSON.stringify([]))
          } else {
            setLoading(false);
            setError(message);
          }
        });
      }
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  }
  const getUser = () => {
    let user = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null;
    if (user !== null) {
      setUserDetails(user);
    }
    let userData = localStorage.getItem("userData") !== null ? JSON.parse(localStorage.getItem("userData")) : null;
    if (userData !== null) {
      setUsername(userData.ownerName)
    }
    let userRole = localStorage.getItem("userRole") !== null ? JSON.parse(localStorage.getItem("userRole")) : null;
    if (userRole !== null) {
      setUserRole(userRole)
    }
  }
  const getAllUsers = () => {
    let response = dispatch(getEmployees());
    response.then(({ data, message }) => {
      if (data !== undefined && data.length > 0) {
        let modified = data.map(item => ({ key: item.personalInformation.firstName + " " + item.personalInformation.lastName + " (" + item.contactInformation.email + ")", value: item._id, label: item.contactInformation.email }))
        setEmployees(modified);
        setEmployeesDetails(data);
        setLoading(false);
        setError("");
      } else if (data.length === 0) {
        setLoading(false);
        setError("No Data Found!");
      } else {
        setLoading(false);
        setError(message);
      }
    });
  }
  const getNavBarDatas1 = (keyword) => {
    try {
      setLoading(true);
      let user = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null;
      if (user !== null) {
        let response = dispatch(getNavBarDatas(user.role, keyword));
        response.then(({ data, message }) => {
          if (data !== undefined) {
            let finalNavbarData = filterDataq(data)
            setObjectivesData(finalNavbarData)
            setError("");
            setLoading(false);
          } else if (data.length === 0) {
            setError("No Data Found!");
            setLoading(false);
          } else {
            setError(message);
            setLoading(false);
          }
        });
      }
    } catch (error) {
      setError(error.toString());
    }
  }
  const updateProfilePic = (user, pic) => {
    const emp = employeesDetails.find((item) => item._id === user._id);

    if (!emp) {
      setError("Employee not found");
      return;
    }

    try {
      setLoading(true);
      const updatedEmployeeData = {
        ...emp,
        personalInformation: {
          ...emp.personalInformation,
          profilePicture: pic
        }
      };

      let response = dispatch(updateEmployee(user._id, updatedEmployeeData));
      response.then(({ success, message }) => {
        if (success) {
          setLoading(false);
          // Update local employeesDetails state
          setEmployeesDetails(prevDetails =>
            prevDetails.map(employee =>
              employee._id === user._id
                ? { ...employee, personalInformation: { ...employee.personalInformation, profilePicture: pic } }
                : employee
            )
          );
          setError("");
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  }
  const handleChange = ({ target: { name, value } }, objectName) => {
    setUserDetails({ ...userDetails, profilePicture: value })
    localStorage.setItem('user', JSON.stringify({
      ...user, profilePicture: value
    }))
    updateProfilePic(user, value)
  };
  const handleChangePicture = (e) => {
    let originalFileName = e.target.files[0].name;
    let fileName = originalFileName.split(".")[0] + "_" + getRandom(9);
    const data = new FormData();
    data.append("file", e.target.files[0]);
    data.append("upload_preset", "ma7nge92");
    data.append("public_id", "talentspotifypics/" + fileName);
    fetch("https://api.cloudinary.com/v1_1/dbqm9svvp/image/upload", {
      method: "post",
      body: data
    })
      .then(responce => responce.json())
      .then(data => {
        handleChange({ target: { name: "profilePicture", value: data.url } }, 'personalInformation');
      })
      .catch(err => console.log(err))
  }

  const filterDataq = (data) => {
    let arr1 = []
    data.objectives.map((item) => {
      arr1.push({ key: item.objective, value: item._id, label: "objective", data: item, icon: obj })
    })
    data.keyResults.map((item1) => {
      arr1.push({ key: item1.keyResultName, value: item1._id, data: item1, label: "keyResult", icon: keyres })
    })
    data.tasks.map((item2) => {
      arr1.push({ key: item2.title, value: item2._id, data: item2, label: "task", icon: tasksi })

    })
    data.employees.map((item) => {
      arr1.push({
        key: item.personalInformation.firstName + " " + item.personalInformation.lastName, value: item._id, label: 'employee', icon: emp, data: item
      })
    })
    return arr1
  }
  const handleCallback2 = (selectedUserId) => {
    setLoading2(true);
    let selectedUser = employeesDetails.filter(item => item._id === selectedUserId);
    console.log(selectedUser, 'sdfhsjfdsiu')
    if (selectedUser.length > 0) {
      let user = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null;
      let finalObject = {
        email: selectedUser[0].contactInformation.email,
        name: selectedUser[0].personalInformation.firstName + " " + selectedUser[0].personalInformation.lastName,
        firstName: selectedUser[0].personalInformation.firstName,
        role: selectedUser[0].employmentInformation.role,
        lineManager: selectedUser[0].employmentInformation.lineManager,
        department: selectedUser[0].employmentInformation.department,
        profilePicture: selectedUser[0].personalInformation.profilePicture ? selectedUser[0].personalInformation.profilePicture : (selectedUser[0].personalInformation.gender === "Male" ? maleIcon : femaleIcon),
        _id: selectedUser[0]._id,
        token: user.token,
        companyId: selectedUser[0]?.companyId,
        company: selectedUser[0]?.companyDetailes?.industry
      };
      localStorage.setItem("user", JSON.stringify(finalObject));
      localStorage.setItem("selectedTab", JSON.stringify({ tab: "me" }));
      localStorage.setItem("userData", JSON.stringify({
        ownerId: finalObject._id,
        ownerName: finalObject.name
      }))
      localStorage.setItem("reviewData", JSON.stringify({ id: finalObject._id, role: "Self" }));
      getAllPrivileges();
      setTimeout(() => {
        history.push("/admin/dashboard");
        window.location.reload();
        setLoading2(false);
      }, 1000);
    } else {
      setLoading2(false);
      const message = "User is Inactive"
      Toast({ type: "error", message, time: 5000 });
    }

  }
  useEffect(() => {
    if (document.body.clientWidth < 500) {
      document.body.classList.toggle('sidebar-icon-only')
    }
    getAllUsers();
    getUser();
    getAllPrivileges();
    getNotificationsAll();
    //eslint-disable-next-line
  }, [])
  const handleCallback3 = (childData) => {
    if (childData !== '') {
      getNavBarDatas1(childData)
    }
  }
  const handleCallback4 = (childData) => {
    if (childData) {
      if (childData === 'How To Create Objective ?') {
        history.push
          ({
            pathname: '/admin/objectives',
            state: { isVisible: true }
          })
      }
      else if (childData === 'How To Create Task ?') {
        history.push
          ({
            pathname: '/admin/tasks',
            state: { isVisible: true }
          })
      }
      else {
        history.push('/admin/keyResults')
      }
    }
  }
  const handlwShow = (event) => {
    event.preventDefault();
    setOrderModalShow5(true)
  }

  const handlwShowHelp = (event) => {
    event.preventDefault();
    setOrderModalShow6(true)
  }

  const handleChangePassword = (child) => {
    try {
      setLoading(true);
      let response = dispatch(changePassword(child))
      response.then(({ message, success }) => {
        if (success) {
          setError("");
          setLoading(false);
          setChangePasswordModal(false)
        } else {
          setError(message);
          setLoading(false);
        }
      });
    } catch (error) {
      setError(error.toString());
    }
  }
  return (
    <>
      <nav
        className="navbar navbar-expand-lg  navbar-light bg-white shadow-sm sticky-top bg-white-fixed"
        style={{
          background: "var(--ts-app-bg)",
        }}
      >
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <Logo />
        &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;

        {isMobile ? (
          <img
            src={search}
            alt="applogo"
            onClick={() => setShowSearch(!showSearch)}
          />
        ) : null}
        <div className="collapse navbar-collapse " id="navbarSupportedContent">
      <div className={isMobile ? "mobile-navbar-content" : "d-flex align-items-center justify-content-between w-100"}>
      <ul className="navbar-nav mr-auto col-lg-7 col-md-7 col-sm-12">
            <div className="d-flex align-items-center w-100 mt-2">
              <div className="mr-3">
                <ToggleTabs selectedTab={selectedTab?.tab || "me"} privileges={privileges} />
              </div>
              {!isMobile && (
                <div className="flex-grow-1">
                  <form
                    className="form-inline w-100 p-0 dropdown"
                    id="navbarDropdownSearch"
                  >
                    <SearchBar
                      objectivesData={objectivesData}
                      setViewModalTask={setViewModalTask}
                      setTaskData={setTaskData}
                      getNavBarDatas1={getNavBarDatas1}
                      handlecallback={handleCallback3}
                    />
                  </form>
                </div>
              )}
            </div>
          </ul>
          <form className="form-inline my-2 my-lg-0 ">
            <ul className="navbar-nav mr-auto d-flex align-items-center flex-row justify-content-between">

              {user.role === "Manager" && (
                <button
                  className="btn-sm mt-1 mr-3"
                  style={{
                    color: "white",
                    backgroundColor:
                      (typeof window !== "undefined" &&
                        getComputedStyle(document.documentElement)
                          .getPropertyValue("--ts-primary")
                          ?.trim()) ||
                      "rgb(131, 127, 57)",
                    borderRadius: "100px",
                    cursor: "pointer",
                  }}
                  onClick={(event) =>
                    history.push("/admin/reward-points-management")
                  }
                >
                  {t("Navbar.approvals")}
                </button>
              )}{" "}
              <button
                className="btn-sm mt-1 mr-3"
                style={{
                  color: "white",
                  backgroundColor:
                    (typeof window !== "undefined" &&
                      getComputedStyle(document.documentElement)
                        .getPropertyValue("--ts-primary")
                        ?.trim()) ||
                    "rgb(131, 127, 57)",
                  borderRadius: "100px",
                  cursor: "pointer",
                }}
                onClick={(event) => handlwShow(event)}
              >
                {t("Navbar.showtour")}
              </button>
              {!isMobile && (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link "
                    href="/#"
                    id="navbarDropdownNotification"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    onClick={() => getNotificationsAll()}
                  >
                    {/* <i className="nav-link-item fa fa-bell-o" /> */}
                    <img
                      src={notification}
                      className="notifications-pic "
                      alt="notification-icon"
                    />
                    {dataCount && dataCount > 0 && (
                      <span className="badge badge-primary badge-pill notification-badge fs-10">
                        {dataCount > 5 ? "5+" : dataCount}
                      </span>
                    )}
                  </a>
                  <div
                    className="dropdown-menu dropdown-menu-right notifications-container "
                    aria-labelledby="navbarDropdownNotification"
                  >
                    {loading ? (
                      <div className="text-center m-2">
                        <LoadingIndicator size="2" />
                      </div>
                    ) : data && data.length > 0 ? (
                      <React.Fragment>
                        <h6 className="dropdown-header ">
                          {t("Navbar.notifications")}
                        </h6>
                        <div className="dropdown-divider" />
                        {data &&
                          data.length > 0 &&
                          data
                            .slice(0, 5)
                            .filter(
                              (user) =>
                                user.row.employeeReferenceId === AuthUserId
                            )
                            .map((notification, index) => {
                              let state =
                                notification.path !== "/admin/objectives"
                                  ? {
                                    data: {
                                      ...notification.row,
                                      objectiveId: notification.row._id,
                                      ownerName: notification.companyInfo,
                                      privileges,
                                    },
                                  }
                                  : null;
                              return (
                                <Link
                                  to={{
                                    pathname: notification.path,
                                    state,
                                  }}
                                  className="dropdown-item notification-item fs-14"
                                  title={notification.title}
                                  key={index}
                                >
                                  {notification.title}
                                </Link>
                              );
                            })}
                        <div className="dropdown-divider" />
                        <Link
                          className="dropdown-item"
                          to="/admin/notifications"
                        >
                          {t("Navbar.viewAllNot")}
                        </Link>
                      </React.Fragment>
                    ) : (
                      <a className="dropdown-item notification-item" href="/#">
                        {t("Navbar.noNot")}
                      </a>
                    )}
                  </div>
                </li>
              )}
              <li className="mr-2" title="Help" style={{ cursor: "pointer" }}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => handlwShowHelp(e)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handlwShowHelp(e); } }}
                  aria-label="Help"
                >
                  <img
                    src={help}
                    className="notifications-pic "
                    alt=""
                  />
                </div>
              </li>
              {/* )} */}
              <LanguageSelector />
              <li className="nav-item dropdown ml-2 userdropdown d-flex align-items-center">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <img
                    src={
                      userDetails !== null && userDetails.profilePicture
                        ? userDetails.profilePicture
                        : userprofile
                    }
                    className="profile-pic"
                    alt="usericon"
                  />
                </label>
                <a
                  className="nav-link dropdown-toggle p-0 m-0"
                  href="/#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span
                    className="ml-2 fs14 text-dark"
                    title={userDetails.name}
                  >
                    {userDetails.name !== undefined
                      ? userDetails.name.length > 15
                        ? userDetails.name.substring(0, 15) + "..."
                        : userDetails.name
                      : t("Navbar.guest")}
                  </span>
                </a>
                <div
                  className="dropdown-menu dropdown-menu-right user-dropdown"
                  aria-labelledby="navbarDropdown"
                >
                  {isMobile && (
                    <Link
                      to="/admin/notifications"
                      className="dropdown-item cursor-pointer"
                      data-toggle="collapse"
                    >
                      {t("Navbar.notif")}
                    </Link>
                  )}
                  {userRole === "Super Admin" && (
                    <button
                      className="dropdown-item cursor-pointer"
                      onClick={() => setShowModal(!showModal)}
                      type="button"
                    >
                      {t("Navbar.proxy")}
                    </button>
                  )}
                  <label
                    htmlFor="file-upload"
                    className="dropdown-item cursor-pointer justify-content-start"
                    style={{ fontSize: "16px" }}
                  >
                    {t("Navbar.changePr")}
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    className="d-none"
                    onChange={(e) => handleChangePicture(e)}
                  />
                  <div
                    onClick={(e) => setChangePasswordModal(true)}
                    className="dropdown-item mb-0 mt-0 pl-4 pb-1 cursor-pointer"
                  >
                    {t("Navbar.changePass")}
                  </div>
                  <Link
                    to=""
                    className="dropdown-item cursor-pointer"
                    href={null}
                    onClick={() => logoutUser()}
                  >
                    {t("Navbar.logout")}
                  </Link>
                </div>
              </li>
              {/*<li className="nav-item dropdown ml-2 ">
              <a className="nav-link" href={null}>
                <img src={settings} className="settings-pic" alt="settings-icon" />
              </a>
            </li>*/}
            </ul>
          </form>
      </div>
          <ul className="sidebar-list-items pl-3 d-lg-none d-block">
            {(Array.isArray(privileges) && privileges.length > 0) || AuthRole === "Super Admin" ? (
              ((Array.isArray(privileges) && privileges.length > 0) ||
                AuthRole === "Super Admin") &&
              links().length > 0 &&
              links().map(({ icon, title, link }, index) => (
                <NavLink
                  to={link}
                  className="text-black text-decoration-none"
                  activeClassName="text-primary"
                  key={index}
                >
                  {" "}
                  <li
                    className="sidebar-list-item pt-3 pb-3 cursor-pointer "
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                  >
                    <img
                      src={icon}
                      className="sidebar-list-icon"
                      alt="sidebar-icon"
                    />{" "}
                    <span>{t(`${title}`)}</span>
                  </li>
                </NavLink>
              ))
            ) : (
              <LoadingIndicator size="2" />
            )}
            {((Array.isArray(privileges) &&
              privileges.length > 0 &&
              privileges.some?.((privilege) => privilege.category === "Previleges" && privilege.view)) ||
              AuthRole === "Super Admin" ||
              AuthRole === "HR Admin" ||
              AuthLineManager === "" ||
              AuthLineManager === null) &&
              AuthRole !== "Employee" && (
                <div className="mobile-admin-activities">
                  <div className="adminActivities">
                    {t(`Sidebar.AdminActivities`)}
                  </div>
                  <AdminActivities AuthRole={AuthRole} privilege={privileges} />
                </div>
              )}
          </ul>
          {showModal && employees.length > 0 && (
            <ProxyAsModal
              show={showModal}
              onHide={() => setShowModal(false)}
              employees={employees}
              handlecallback={(data) => handleCallback2(data)}
              loading={loading2}
            />
          )}
          {changePass && (
            <ChangePassword
              show={changePass}
              onHide={() => setChangePasswordModal(false)}
              loading={loading}
              email={userDetails.email}
              handlecallback={handleChangePassword}
            />
          )}
        </div>
        {viewModalTasks && (
          <TasksView
            show={viewModalTasks}
            onHide={() => setViewModalTask(false)}
            data={taskData}
          // owner={props.ownerDet}
          />
        )}
        {showSearch && <SearchBar
          objectivesData={objectivesData}
          setViewModalTask={setViewModalTask}
          setTaskData={setTaskData}
          getNavBarDatas1={getNavBarDatas1}
          handlecallback={handleCallback3}
        />}
      </nav>
      <OnBoarding
        show={orderModalShow5}
        onHide={() => setOrderModalShow5(false)}
        handlecallback={handleCallback4}
      />
      <HelpPopup
        show={orderModalShow6}
        onHide={() => setOrderModalShow6(false)}
        handlecallback={handleCallback4}
      />

      {/* <NewTopHeader /> */}
    </>
  );

}
export default Navbar;
