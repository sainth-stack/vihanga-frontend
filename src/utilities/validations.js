import React, { useRef } from "react";
import SimpleReactValidator from "simple-react-validator";
import { WRONG_EMAIL, WRONG_PASSWORD } from "./constants";

import cup from "assets/svg/cup.svg";
import bronzeCup from "assets/svg/bronzeCup.svg";
import silverCup from "assets/svg/silverCup.svg";
import { getItemFromLocalStorage } from "./getLocalStorageItem";

export const Validator = () => {
  return useRef(
    new SimpleReactValidator({
      validators: {
        email: {
          message: WRONG_EMAIL,
          rule: (val, params, validator) => {
            return validator.helpers.testRegex(val, /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/);
          },
          messageReplace: (message, params) => message.replace("", this.helpers.toSentence(params)),
          required: true,
        },
        password: {
          message: WRONG_PASSWORD,
          rule: (val, params, validator) => {
            return validator.helpers.testRegex(val, /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{4,16}$/);
          },
          messageReplace: (message, params) => message.replace("", this.helpers.toSentence(params)),
          required: true,
        },
        element: (message) => <span className="error-message">{message}</span>,
      },
    }),
  );
};
export const AuthToken = localStorage.getItem("token") != null ? localStorage.getItem("token") : null;
export const AuthEmail = localStorage.getItem("user") != null ? JSON.parse(localStorage.getItem("user")).email : null;
export const AuthUserId = localStorage.getItem("user") != null ? JSON.parse(localStorage.getItem("user"))._id : null;
export const AuthUserName = localStorage.getItem("user") != null ? JSON.parse(localStorage.getItem("user")).name : null;
export const AuthUser = localStorage.getItem("user") != null ? JSON.parse(localStorage.getItem("user")) : null;
export const AuthSelectedTaskUser = localStorage.getItem("selectedTaskUser") != null ? JSON.parse(localStorage.getItem("selectedTaskUser")) : null;
export const AuthRole = localStorage.getItem("user") != null ? JSON.parse(localStorage.getItem("user")).role : null;
export const AuthUserRole = localStorage.getItem("userRole") != null ? JSON.parse(localStorage.getItem("userRole")) : null;
export const AuthTab = localStorage.getItem("selectedTab") != null ? JSON.parse(localStorage.getItem("selectedTab")).tab : null;
export const AuthUserRoleId = localStorage.getItem("userRoleId") != null ? JSON.parse(localStorage.getItem("userRoleId")) : null;
export const AuthOwnerId = localStorage.getItem("userData") != null ? JSON.parse(localStorage.getItem("userData")).ownerId : null;
export const AuthLineManager = localStorage.getItem("user") != null ? JSON.parse(localStorage.getItem("user")).lineManager : null;
export const AuthReviewId = localStorage.getItem("reviewData") != null ? JSON.parse(localStorage.getItem("reviewData")).id : null;
export const AuthReviewRole = localStorage.getItem("reviewData") != null ? JSON.parse(localStorage.getItem("reviewData")).role : null;
export const AuthReviewName = localStorage.getItem("reviewData") != null ? JSON.parse(localStorage.getItem("reviewData")).name : null;

export const getBuildDate = (epoch) => {
  const buildDate = window.moment(epoch).format("DD-MM-YYYY");
  return buildDate;
};
export const getDateFormat = (dateInput, format) => {
  return window.moment(dateInput).format(format);
};
export const removeDuplicates = (arr, field) => {
  return arr.filter((v, i, a) => a.findIndex(t => (t[field] === v[field])) === i)
}

export const bytesToSize = (bytes) => {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export const handleLink = (link, title, user) => {
  localStorage.setItem("selectedTab", JSON.stringify({ tab: title }));
  localStorage.setItem('userData', JSON.stringify({ ownerName: user.name, ownerId: user._id }))
  localStorage.removeItem("selectedTaskUser");
  //history.push(link);
  window.location.reload();
}
export const handleLink2 = (link, title) => {
  localStorage.setItem("selectedTabRewards", JSON.stringify({ tab: title }));
  try {
    // Avoid circular import with service/helpers; navigate directly
    window.location.assign(link);
  } catch {
    window.location.href = link;
  }
}

export const getRandom = (length) => {
  return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
}

export const getProgressColor = (value) => {
  return value <= 60 ? 'danger' : (value > 60 && value < 80 ? 'warning' : 'success')
}
export const ShowCup = ({ empwithRewards, rewardPoints1, rewardPoints2 }) => {
  return (
    <>
      {empwithRewards.length > 0 && empwithRewards[0].rewardPoints > 0 && <img className="mt-5 rewardCup" src={empwithRewards.length > 0 && empwithRewards[0].rewardPoints > 0 && (empwithRewards.length > 0 && empwithRewards[0].rewardPoints <= rewardPoints1 ? bronzeCup : (empwithRewards.length > 0 && empwithRewards[0].rewardPoints <= rewardPoints2 ? silverCup : cup))} alt="cup" title={empwithRewards.length > 0 && empwithRewards[0].rewardPoints > 0 && (empwithRewards.length > 0 && empwithRewards[0].rewardPoints <= rewardPoints1 ? 'Bronze' : (empwithRewards.length > 0 && empwithRewards[0].rewardPoints <= rewardPoints2 ? 'Silver' : "Gold"))} />}
    </>
  )
}

export const filterNormalUsers = (users) => {
  return users.filter(user => user.userType === 'Normal')
}


export const getRandomColor = () => {
  let colors = ["#2A7A7B", "#000000"];
  return colors[Math.floor(Math.random() * (2 - 1 + 1) + 1)];
}
export const getRandomColor2 = () => {
  let colors = ["#FFFFFF", "skyblue"];
  return colors[Math.floor(Math.random() * (2 - 1 + 1) + 1)];
}

export const getRandomBarColor = () => {
  var max = 0xffffff;
  return '#' + Math.round(Math.random() * max).toString(16);
}
// Safe localStorage helpers to avoid JSON parse errors or corrupt values
const safeParseJSON = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};
const getFromLocalStorage = (key, fallbackValue) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined || raw === "") return fallbackValue;
    const parsed = safeParseJSON(raw);
    return parsed !== undefined ? parsed : fallbackValue;
  } catch {
    return fallbackValue;
  }
};

export const companyId = getFromLocalStorage("companyId", "");

export const tabType = getFromLocalStorage("tabType", 0);

export const selectedTab = getFromLocalStorage("selectedTab", null);

export const consoleLog = (logData) => {
  console.log(...logData);
}

//privileges
export const isPrivileged = (privilegeName, privilegeType) => {
  const privileges = getItemFromLocalStorage("privileges");

  return (privileges && privileges?.length > 0 && privileges?.filter(privilege => privilege?.page === privilegeName)?.length > 0 && privileges?.filter(privilege => privilege?.page === privilegeName)[0]?.[privilegeType]) || (AuthRole === "Super Admin")
}