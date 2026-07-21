import { AuthRole, AuthSelectedTaskUser, AuthTab, AuthUserId, AuthUserRole, companyId, tabType } from "utilities";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";

let baseURL = "";
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "") {
  //localhost
  baseURL = "local";
} else {
  baseURL = "ollaa-company";
}
const companyPrefix = "companies/";
const objectivePrefix = "objectives/";
const entityPrefix = "entities/";
const departmentPrefix = "departments/";
const designationPrefix = "designations/";
const gradePrefix = "grades/";
const uploadPrefix = "uploads/";
const landingPrefix = "landing/";
const employeePrefix = "employees/";
const keyResultsPrefix = "keyresults/";
//const tasksPrefix = "tasks/";
const tasksPrefix = "tasks2/";
const issuesPrefix = "issue/";
const userPrefix = "users/";
const commentsPrefix = "comments/";
const tasksCommentsPrefix = "tasksComment/";
const privilegesPrefix = "privileges/";
const privilegesGroupPrefix = "privilegesgroups/";
const notificationsPrefix = "notifications/"
const notificationSettingsPrefix = "notificationSettings/"
const okrManagement = "okrManagement/"
const rewardManagement = "rewardManagement/"
const rewards = "rewards/"
const chatbotPrefix = "chatbot/"
const chatbotv2Prefix = "chatbot_v2/"
const navbarPrefix = 'navbar/';
const reviewsPrefix = "chatbotReviews/";
const reviewsPrefix_v2 = "chatbotReviews_v2/";
const reviewFormPrefix = "reviewForm/";
const competencyPrefix = "competency/";
const templatePrefix = "templates/";
const sessionsPrefix = "sessions/";
const ratingScalesPrefix = "ratingScales/";
const goalsPrefix = "goals/";
const launchFormsPrefix = "launchform/";
const advancedLaunchFormsPrefix = "advanced-launchform/";
const openEndedQuestionsPrefix = "chatbot-open-ended-questions/";
const closeEndedQuestionsPrefix = "chatbot-close-ended-questions/";
const rewardPointsPrefix = "rewardpoints/";
const salesforcePrefix = "integrations/kpi/";
const jiraPrefix = "integrations/jira/";
const dashboardPrefix = "dashboard/";
const themePrefix = "theme/";


const userDetails = getItemFromLocalStorage("user")


export const companyApi = {
  createCompany: {
    api: companyPrefix + "createCompany",
    method: "post",
    baseURL,
  },
  createOrUpdateMultipleCompanies: {
    api: companyPrefix + "createOrUpdateMultipleCompanies",
    method: "post",
    baseURL,
  },
  updateCompany: (id) => ({
    api: companyPrefix + "updateCompany/" + id,
    method: "put",
    baseURL,
  }),
  deleteCompany: (id) => ({
    api: companyPrefix + "deleteCompany/" + id,
    method: "delete",
    baseURL,
  }),
  deleteCompanies: {
    api: companyPrefix + "deleteCompanies",
    method: "post",
    baseURL,
  },
  getCompanies: {
    api: companyPrefix + "getCompanies",
    method: "get",
    baseURL,
  },
  getCompanyById: (id) => ({
    api: companyPrefix + "getCompanyById/" + id,
    method: "get",
    baseURL,
  }),
  getCompanyConfig: (id) => ({
    api: companyPrefix + "getCompanyConfig/" + id,
    method: "get",
    baseURL,
  }),
  updateCompanyConfig: (id) => ({
    api: companyPrefix + "updateCompanyConfig/" + id,
    method: "put",
    baseURL,
  }),
};

export const employeeApi = {
  createEmployee: {
    api: employeePrefix + "createEmployee",
    method: "post",
    baseURL,
  },
  createOrUpdateMultipleEmployees: {
    api: employeePrefix + "createOrUpdateMultipleEmployees",
    method: "post",
    baseURL,
  },
  updateEmployee: (id) => ({
    api: employeePrefix + "updateEmployee/" + id,
    method: "put",
    baseURL,
  }),
  deleteEmployee: (id) => ({
    api: employeePrefix + "deleteEmployee/" + id,
    method: "put",
    baseURL,
  }),
  deleteEmployees: {
    api: employeePrefix + "deleteEmployees",
    method: "post",
    baseURL,
  },
  getEmployees: {
    api: employeePrefix + "getEmployees/" + companyId?.toString(),
    method: "get",
    baseURL,
  },
  getEmployeesAll: {
    api: employeePrefix + "getEmployeesAll/" + companyId?.toString(),
    method: "get",
    baseURL,
  },
  getOrgChartData: {
    api: employeePrefix + "getOrgChartData/" + companyId?.toString(),
    method: "get",
    baseURL,
  },
  getEmployeeById: (id) => ({
    api: employeePrefix + "getEmployeeById/" + id,
    method: "get",
    baseURL,
  }),
  getEmployeeByHireDate: {
    api: employeePrefix + "getEmployeByHireDate",
    method: "get",
    baseURL,
  },
  getEmployeByDateOfBirth: {
    api: employeePrefix + "getEmployeByDateOfBirth",
    method: "get",
    baseURL,
  },
  changePassword: {
    api: employeePrefix + "change-password",
    method: "post",
    baseURL
  }
};
export const objectiveApi = {
  getObjectivesTabs: (role, id, tabType) => ({
    api: objectivePrefix + "getObjectivesTabs/" + (role ? role : userDetails?.role) + "/" + id + "/" + companyId.toString() + "/" + tabType,
    method: "get",
    baseURL,
  }),
  getObjectives: (role, id, objectiveId) => ({
    api: objectivePrefix + "getObjectives/" + (role ? role : userDetails?.role) + "/" + id + "/" + companyId.toString() + (objectiveId ? "/" + objectiveId : ""),
    method: "get",
    baseURL,
  }),
  getObjectivesDashboard: (role, id) => ({
    api: objectivePrefix + "getObjectivesDashboard/" + (role ? role : userDetails?.role) + "/" + id + "/" + companyId.toString(),
    method: "get",
    baseURL,
  }),
  getObjectivesAndOKRTab: (role, id) => ({
    api: objectivePrefix + "getObjectivesAndOKRTab/" + (role ? role : userDetails?.role) + "/" + id + "/" + companyId.toString(),
    method: "get",
    baseURL,
  }),
  getSimilarObjectives: (role, id, tabType, objectiveId) => ({
    api: objectivePrefix + "getSimilarObjectives/" + (role ? role : userDetails?.role) + "/" + id + "/" + companyId.toString() + "/" + tabType + "/" + objectiveId,
    method: "get",
    baseURL,
  }),
  getObjectivesOCR: (id, tab) => ({
    api: objectivePrefix + "getObjectivesOCR/" + id + "/" + tab + "/" + companyId.toString(),
    method: "get",
    baseURL,
  }),
  getObjectivesRewardPoints: (id, role, tab) => ({
    api: objectivePrefix + "getObjectivesRewardPoints/" + id + '/' + role + '/' + tab + "/" + companyId.toString(),
    method: "get",
    baseURL,
  }),
  deleteObjectives: {
    api: objectivePrefix + "deleteObjectives",
    method: "delete",
    baseURL,
  },
  createObjective: {
    api: objectivePrefix + "createObjective",
    method: "post",
    baseURL,
  },
  cascadeObjective: {
    api: objectivePrefix + "cascadeObjective",
    method: "post",
    baseURL,
  },
  cascadeObjectiveWithKeyResults: {
    api: objectivePrefix + "cascadeObjectiveWithKeyResults",
    method: "post",
    baseURL,
  },
  updateObjective: (id) => ({
    api: objectivePrefix + "updateObjective/" + id,
    method: "put",
    baseURL,
  }),
  updateObjectiveCascaded: (id) => ({
    api: objectivePrefix + "updateObjectiveCascaded/" + id + "/" + companyId.toString(),
    method: "put",
    baseURL,
  }),
  approveAllObjectives: (companyId, managerId) => ({
    api: objectivePrefix + "approve-all/" + companyId + "/" + managerId,
    method: "post",
    baseURL,
  }),
};
export const goalsApi = {
  getObjectives: (role, id) => ({
    api: goalsPrefix + "getGoals/" + role + "/" + id + "/" + companyId.toString(),
    method: "get",
    baseURL,
  }),
  deleteObjectives: {
    api: goalsPrefix + "deleteGoals",
    method: "delete",
    baseURL,
  },
  createObjective: {
    api: goalsPrefix + "createGoal",
    method: "post",
    baseURL,
  },
  cascadeGoal: {
    api: goalsPrefix + "cascadeGoal",
    method: "post",
    baseURL,
  },
  updateObjective: (id) => ({
    api: goalsPrefix + "updateGoal/" + id,
    method: "put",
    baseURL,
  }),
};
export const entityApi = {
  createEntity: {
    api: entityPrefix + "createEntity",
    method: "post",
    baseURL,
  },
  createOrUpdateMultipleEntities: {
    api: entityPrefix + "createOrUpdateMultipleEntities",
    method: "post",
    baseURL,
  },
  updateEntity: (id) => ({
    api: entityPrefix + "updateEntity/" + id,
    method: "put",
    baseURL,
  }),
  deleteEntity: (id) => ({
    api: entityPrefix + "deleteEntity/" + id,
    method: "delete",
    baseURL,
  }),
  deleteEntities: {
    api: entityPrefix + "deleteEntities",
    method: "post",
    baseURL,
  },
  getEntities: {
    api: entityPrefix + "getEntities/" + companyId.toString(),
    method: "get",
    baseURL,
  },
  getEntityById: (id) => ({
    api: entityPrefix + "getEntityById/" + id,
    method: "get",
    baseURL,
  }),
};

export const navBarDataApi = {
  getNavbarData: (role, id, keyword) => ({
    api: navbarPrefix + "getData/" + role + "/" + id + "/" + keyword,
    method: "get",
    baseURL,
  }),
};

export const departmentApi = {
  createDepartment: {
    api: departmentPrefix + "createDepartment",
    method: "post",
    baseURL,
  },
  updateDepartment: (id) => ({
    api: departmentPrefix + "updateDepartment/" + id,
    method: "put",
    baseURL,
  }),
  getDepartments: {
    api: departmentPrefix + "getDepartments",
    method: "get",
    baseURL,
  },
  getDepartmentsData: {
    api: departmentPrefix + "getDepartmentsData/" + companyId.toString(),
    method: "get",
    baseURL,
  },
  createOrUpdateMultipleDepartments: {
    api: departmentPrefix + "createOrUpdateMultipleDepartments",
    method: "post",
    baseURL,
  },
  deleteDepartment: (id) => ({
    api: departmentPrefix + "deleteDepartment/" + id,
    method: "delete",
    baseURL,
  }),
};
export const designationApi = {
  getDesignations: {
    api: designationPrefix + "getDesignations/" + companyId.toString(),
    method: "get",
    baseURL,
  },
  updateDesignation: (id) => ({
    api: designationPrefix + "updateDesignation/" + id,
    method: "put",
    baseURL,
  }),
  createOrUpdateMultipleDesignations: {
    api: designationPrefix + "createOrUpdateMultipleDesignations",
    method: "post",
    baseURL,
  },
  deleteDesignation: (id) => ({
    api: designationPrefix + "deleteDesignation/" + id,
    method: "delete",
    baseURL,
  }),
};
export const gradeApi = {
  getGrades: {
    api: gradePrefix + "getGrades/" + companyId.toString(),
    method: "get",
    baseURL,
  },
  updateGrade: (id) => ({
    api: gradePrefix + "updateGrade/" + id,
    method: "put",
    baseURL,
  }),
  createOrUpdateMultipleGrades: {
    api: gradePrefix + "createOrUpdateMultipleGrades",
    method: "post",
    baseURL,
  },
  deleteGrade: (id) => ({
    api: gradePrefix + "deleteGrade/" + id,
    method: "delete",
    baseURL,
  }),
};

export const uploadApi = {
  createUpload: {
    api: uploadPrefix + "createUpload",
    method: "post",
    baseURL,
  },
  requestDemo: {
    api: landingPrefix + "requestDemo",
    method: "post",
    baseURL,
  },
  birthdayWish: {
    api: landingPrefix + "sendBirthdayWish",
    method: "post",
    baseURL,
  },
  getAllWishes: {
    api: landingPrefix + "wishes",
    method: "get",
    baseURL,
  },
  updateUpload: (id) => ({
    api: uploadPrefix + "updateUpload/" + id,
    method: "post",
    baseURL,
  }),
  getUploadsByCategory: (category) => ({
    api: uploadPrefix + "getUploadsByCategory/" + category + "/" + companyId.toString(),
    method: "get",
    baseURL,
  }),
  deleteUpload: (id) => ({
    api: uploadPrefix + "deleteUpload/" + id,
    method: "delete",
    baseURL,
  }),
};
export const keyresultsApi = {
  getKeyResultsSingle: (id) => ({
    api: keyResultsPrefix + "getKeyResults/" + id + "/" + companyId.toString(),
    method: "get",
    baseURL,
  }),
  getKeyResults: {
    api: keyResultsPrefix + "getKeyResults/" + companyId.toString(),
    method: "get",
    baseURL,
  },
  getKeyResultSingle: (id, role) => ({
    api: keyResultsPrefix + "getKeyResultSingle/" + id + "/" + role,
    method: "get",
    baseURL,
  }),
  createkeyResult: {
    api: keyResultsPrefix + "createKeyResult",
    method: "post",
    baseURL,
  },
  deletekeyResult: (id) => ({
    api: keyResultsPrefix + "deletekeyResult/" + id,
    method: "delete",
    baseURL,
  }),
  updatekeyResult: (id) => ({
    api: keyResultsPrefix + "updatekeyResult/" + id,
    method: "put",
    baseURL,
  }),
  updatekeyResultCascaded: (id) => ({
    api: keyResultsPrefix + "updatekeyResultCascaded/" + id + "/" + companyId.toString(),
    method: "put",
    baseURL,
  }),
  updatekeyResults: {
    api: keyResultsPrefix + "updatekeyResults",
    method: "put",
    baseURL,
  },
}

export const tasksApi = {
  createTask: {
    api: tasksPrefix + "createTask",
    method: "post",
    baseURL,
  },
  updateTask: (id) => ({
    api: tasksPrefix + "updateTask/" + id,
    method: "put",
    baseURL,
  }),

  getTasks: {
    api: tasksPrefix + "getTasks/" + (AuthSelectedTaskUser !== null ? AuthSelectedTaskUser : AuthUserId) + "/" + companyId.toString(),
    method: "get",
    baseURL
  },
  getAllTasks: {
    api: tasksPrefix + "getTasks/all/" + companyId.toString(),
    method: "get",
    baseURL
  },
  getTasksById: (id) => ({
    api: tasksPrefix + "getTasksById/" + id,
    method: "get",
    baseURL,
  }),
  getAuditHistory: (id) => ({
    api: tasksPrefix + "getAuditHistory/" + id,
    method: "get",
    baseURL,
  }),
  getTasksByRole: (id) => ({
    api: tasksPrefix + "getTasksByRole/" + id + "/" + (AuthSelectedTaskUser !== null ? AuthSelectedTaskUser : AuthUserId) + "/" + companyId.toString() + "/" + AuthUserId,
    method: "get",
    baseURL,
  }),
  deleteTask: (id) => ({
    api: tasksPrefix + "deleteTask/" + id,
    method: "delete",
    baseURL,
  }),
  updateMultipleTasks: {
    api: tasksPrefix + "updateMultipleTasks",
    method: "post",
    baseURL
  },
  deleteTasks: {
    api: tasksPrefix + "deleteTasks",
    method: "post",
    baseURL
  },
  copyTask: (id) => ({
    api: tasksPrefix + "copyTask/" + id,
    method: "post",
    baseURL,
  }),
  exportSheets: {
    api: tasksPrefix + "create-sheet/" + (AuthSelectedTaskUser !== null ? AuthSelectedTaskUser : AuthUserId) + "/" + companyId.toString(),
    method: "post",
    baseURL
  },
  getPrediction: {
    api: keyResultsPrefix + "predictData",
    method: "post",
    baseURL
  },
}

export const issuesApi = {
  createIssue: {
    api: issuesPrefix + "createIssue",
    method: "post",
    baseURL,
  },
  updateIssue: (id) => ({
    api: issuesPrefix + "updateIssue/" + id,
    method: "put",
    baseURL,
  }),

  getIssues: {
    api: issuesPrefix + "issues",
    method: "get",
    baseURL
  },
  getIssuesByEmpId: {
    api: issuesPrefix + "issuesByEmployeeId/" + AuthUserId,
    method: "get",
    baseURL
  },
  getIssuesByCompanyId: {
    api: issuesPrefix + "issuesByCompanyId/" + companyId.toString(),
    method: "get",
    baseURL
  },
  getIssuesById: (id) => ({
    api: issuesPrefix + "getIssuesById/" + id,
    method: "get",
    baseURL,
  }),
  uploadIssueAttachment: {
    api: issuesPrefix + "upload",
    method: "post",
    baseURL
  },

}

export const commentsApi = {
  createComment: {
    api: commentsPrefix + "createComment",
    method: "post",
    baseURL,
  },
  updateComment: (id) => ({
    api: commentsPrefix + "updateComment/" + id,
    method: "put",
    baseURL,
  }),
  getAllCommentsByReferenceId: (id) => ({
    api: commentsPrefix + "getAllCommentsByReferenceId/" + id,
    method: "get",
    baseURL
  }),
  getAllComments: {
    api: commentsPrefix + "getAllComments",
    method: "get",
    baseURL
  },
  deleteComment: (id) => ({
    api: commentsPrefix + "deleteComment/" + id,
    method: "delete",
    baseURL,
  }),
}

export const chatbotApi = {
  sendMessage: (userId, numberOfQuestions, answer) => ({
    api: chatbotPrefix + "sendMessage/" + userId + "/" + numberOfQuestions + "/" + answer,
    method: "post",
    baseURL,
  }),
  getAllChats: {
    api: chatbotPrefix + "getChats",
    method: "get",
    baseURL
  },
  getCompetencies: {
    api: openEndedQuestionsPrefix + "getCompetencies",
    method: "get",
    baseURL
  },
}
export const chatbotApiV2 = {
  sendMessage: (userId, numberOfQuestions, answer, AuthReviewId, reviewRole, templateId) => ({
    api: chatbotv2Prefix + "sendMessage/" + userId + "/" + numberOfQuestions + "/" + answer + "/" + AuthReviewId + "/" + reviewRole + "/" + templateId,
    method: "post",
    baseURL,
  }),
  getAllChats: {
    api: chatbotv2Prefix + "getChats",
    method: "get",
    baseURL
  },
}

export const TasksCommentsApi = {
  createComment: {
    api: tasksCommentsPrefix + "createComment",
    method: "post",
    baseURL,
  },
  updateComment: (id) => ({
    api: tasksCommentsPrefix + "updateComment/" + id,
    method: "put",
    baseURL,
  }),
  getAllCommentsByReferenceId: (id) => ({
    api: tasksCommentsPrefix + "getAllCommentsByReferenceId/" + id,
    method: "get",
    baseURL
  }),
  getAllComments: {
    api: tasksCommentsPrefix + "getAllComments",
    method: "get",
    baseURL
  },
  deleteComment: (id) => ({
    api: tasksCommentsPrefix + "deleteComment/" + id,
    method: "delete",
    baseURL,
  }),
}

export const userApi = {
  register: {
    api: userPrefix + "register",
    method: "post",
    baseURL,
  },
  login: {
    api: userPrefix + "login",
    method: "post",
    baseURL,
  },
  malogin: {
    api: userPrefix + "malogin",
    method: "post",
    baseURL,
  },
  emailLinkLogin: {
    api: userPrefix + "email-link-login",
    method: "post",
    baseURL,
  },
  forgotpassword: {
    api: employeePrefix + "forgotpassword",
    method: "post",
    baseURL,
  },
  resetpassword: {
    api: employeePrefix + "resetpassword",
    method: "post",
    baseURL,
  },
}

export const privilegesApi = {
  createPrivilege: {
    api: privilegesPrefix + "createPrivilege",
    method: "post",
    baseURL,
  },
  updatePrivilege: (id) => ({
    api: privilegesPrefix + "updatePrivilege/" + id,
    method: "put",
    baseURL,
  }),
  updatePrivilegePermissionGroup: (id) => ({
    api: privilegesPrefix + "updatePrivilegePermissionGroup/" + id,
    method: "put",
    baseURL,
  }),
  deletePrivilege: (id) => ({
    api: privilegesPrefix + "deletePrivilege/" + id,
    method: "delete",
    baseURL,
  }),
  deletePrivilegeMultiple: {
    api: privilegesPrefix + "deletePrivilegeMultiple",
    method: "post",
    baseURL,
  },
  updatePrivilegesInActive: {
    api: privilegesPrefix + "updatePrivilegesInActive",
    method: "post",
    baseURL,
  },
  updatePrivilegesActive: {
    api: privilegesPrefix + "updatePrivilegesActive",
    method: "post",
    baseURL,
  },
  getAllPrivileges: {
    api: privilegesPrefix + "getAllPrivileges/" + companyId.toString(),
    method: "get",
    baseURL,
  },
  getPrivilege: (role, companyIds) => ({
    api: privilegesPrefix + "getPrivilege/" + role + "/" + (companyIds ? companyIds : companyId.toString()),
    method: "get",
    baseURL,
  }),
};

export const privilegesGroupApi = {
  createPrivilegeGroup: {
    api: privilegesGroupPrefix + "createPrivilegeGroup",
    method: "post",
    baseURL,
  },
  updatePrivilegeGroup: (id) => ({
    api: privilegesGroupPrefix + "updatePrivilegeGroup/" + id,
    method: "put",
    baseURL,
  }),
  deletePrivilegeGroup: (id) => ({
    api: privilegesGroupPrefix + "deletePrivilegeGroup/" + id,
    method: "delete",
    baseURL,
  }),
  deletePrivilegeGroupMultiple: {
    api: privilegesGroupPrefix + "deletePrivilegeGroupMultiple",
    method: "post",
    baseURL,
  },
  updatePrivilegesGroupInActive: {
    api: privilegesGroupPrefix + "updatePrivilegesGroupInActive",
    method: "post",
    baseURL,
  },
  updatePrivilegesGroupActive: {
    api: privilegesGroupPrefix + "updatePrivilegesGroupActive",
    method: "post",
    baseURL,
  },
  getAllPrivilegesGroup: {
    api: privilegesGroupPrefix + "getAllPrivilegesGroup/" + companyId.toString(),
    method: "get",
    baseURL,
  },
  getPrivilegeGroup: (role) => ({
    api: privilegesGroupPrefix + "getPrivilegeGroup/" + role + "/" + companyId.toString(),
    method: "get",
    baseURL,
  }),
};

export const okrManagementApi = {
  createOkrLibrary: {
    api: okrManagement + "createOkrLibrary",
    method: "post",
    baseURL,
  },
  createObjectives: {
    api: okrManagement + "createObjectives",
    method: "post",
    baseURL,
  },
  createGoals: {
    api: okrManagement + "createGoals",
    method: "post",
    baseURL,
  },
  copyObjectives: {
    api: okrManagement + "copyObjectives",
    method: "post",
    baseURL,
  },
  updateOkrLibary: (id) => ({
    api: okrManagement + "updateOkrLibary/" + id,
    method: "put",
    baseURL,
  }),
  deleteOkrLibrary: (id) => ({
    api: okrManagement + "deleteOkrLibrary/" + id,
    method: "delete",
    baseURL,
  }),
  deleteOkrLibraries: {
    api: okrManagement + "deleteOkrLibraries",
    method: "post",
    baseURL,
  },
  getAllOkrLibrary: {
    api: okrManagement + "getAllOkrLibrary/" + companyId.toString(),
    method: "get",
    baseURL,
  },
};

export const okrManagement2Api = {
  createOkrTab: {
    api: okrManagement + "createOkrTab",
    method: "post",
    baseURL,
  },
  updateOkrTab: (id) => ({
    api: okrManagement + "updateOkrTab/" + id,
    method: "put",
    baseURL,
  }),
  deleteOkrTab: (id) => ({
    api: okrManagement + "deleteOkrTab/" + id,
    method: "delete",
    baseURL,
  }),
  createObjectivesAndKeyResults: {
    api: okrManagement + "createObjectivesAndKeyResults",
    method: "post",
    baseURL,
  },
  deleteOkrTabs: {
    api: okrManagement + "deleteOkrTabs",
    method: "post",
    baseURL,
  },
  getAllOkrTab: {
    api: okrManagement + "getAllOkrTab/" + companyId.toString(),
    method: "get",
    baseURL,
  },
};


export const rewardManagementApi = {
  createReward: {
    api: rewardManagement + "createReward",
    method: "post",
    baseURL,
  },
  updateReward: (id) => ({
    api: rewardManagement + "updateReward/" + id,
    method: "put",
    baseURL,
  }),
  deleteReward: (id) => ({
    api: rewardManagement + "deleteReward/" + id,
    method: "delete",
    baseURL,
  }),
  deleteRewards: {
    api: rewardManagement + "deleteRewards",
    method: "post",
    baseURL,
  },
  getAllRewards: {
    api: rewardManagement + "getAllRewards/" + companyId.toString(),
    method: "get",
    baseURL,
  },
};

export const rewardsApi = {
  createReward: {
    api: rewards + "createReward",
    method: "post",
    baseURL,
  },
  createRedeemPoints: {
    api: rewards + "createRedeemPoints",
    method: "post",
    baseURL,
  },
  updateReward: (id) => ({
    api: rewards + "updateReward/" + id,
    method: "put",
    baseURL,
  }),
  updateRedeem: (id) => ({
    api: rewards + "redeemUpdate/" + id,
    method: "put",
    baseURL,
  }),
  deleteReward: (id) => ({
    api: rewards + "deleteReward/" + id,
    method: "delete",
    baseURL,
  }),
  deleteRewards: {
    api: rewards + "deleteRewards",
    method: "post",
    baseURL,
  },
  getAllRewards: {
    api: rewards + "getAllRewards/" + companyId.toString(),
    method: "get",
    baseURL,
  },
  getAllRedeemPoints: (id) => ({
    api: rewards + "getAllRedeemPoints/" + id,
    method: "get",
    baseURL,
  }),
};
export const notificationApi = {

  updateNotification: (id) => ({
    api: notificationsPrefix + "updateNotification/" + id,
    method: "put",
    baseURL,
  }),
  updateNotificationGoal: (id) => ({
    api: notificationsPrefix + "updateNotificationGoal/" + id,
    method: "put",
    baseURL,
  }),
  updateNotificationKR: (id) => ({
    api: notificationsPrefix + "updateNotificationKR/" + id,
    method: "put",
    baseURL,
  }),
  updateNotificationTask: (id) => ({
    api: notificationsPrefix + "updateNotificationTask/" + id,
    method: "put",
    baseURL,
  }),
  getAllNotifications: {
    api: notificationsPrefix + "getNotifications",
    method: "get",
    baseURL,
  },
  getAllNotificationsByUser: (id, role) => ({
    api: notificationsPrefix + "getNotificationsByUser/" + id + "/" + role,
    method: "get",
    baseURL,
  }),
  getAllNotificationsByUserAll: (id) => ({
    api: notificationsPrefix + "getNotificationsByUserAll/" + id,
    method: "get",
    baseURL,
  }),
  getAllNotificationsCount: (username) => ({
    api: notificationsPrefix + "getNotificationsCount/" + username,
    method: "get",
    baseURL,
  }),
};
export const employeeRewardsApi = {
  empWithRewards: (id, role, usertab) => ({
    api: objectivePrefix + "employeeWithRewards/" + id + '/' + role + "/" + AuthTab + "/" + usertab + "/" + companyId.toString(),
    method: "get",
    baseURL,
  }),
};


export const notificationSettingsApi = {
  createNotificationSettings: {
    api: notificationSettingsPrefix + "createNotificationSettings",
    method: "post",
    baseURL,
  },
  updateNotificationSettings: (id) => ({
    api: notificationSettingsPrefix + "updateNotificationSettings/" + id,
    method: "put",
    baseURL,
  }),
  deleteNotificationSettings: (id) => ({
    api: notificationSettingsPrefix + "deleteNotificationSettings/" + id,
    method: "delete",
    baseURL,
  }),
  deleteNotificationSettingsMultiple: {
    api: notificationSettingsPrefix + "deleteNotificationSettingsMultiple",
    method: "post",
    baseURL,
  },
  updateNotificationSettingsInActive: {
    api: notificationSettingsPrefix + "updateNotificationSettingsInActive",
    method: "post",
    baseURL,
  },
  updateNotificationSettingsActive: {
    api: notificationSettingsPrefix + "updateNotificationSettingsActive",
    method: "post",
    baseURL,
  },
  getAllNotificationSettings: {
    api: notificationSettingsPrefix + "getAllNotificationSettings/" + companyId.toString(),
    method: "get",
    baseURL,
  },
  getNotificationSettings: (id) => ({
    api: notificationSettingsPrefix + "getNotificationSettings/" + id,
    method: "get",
    baseURL,
  }),
};

export const reviews = {
  createReview: {
    api: reviewsPrefix + "createReview",
    method: "post",
    baseURL,
  },
  createReviewForm: {
    api: reviewsPrefix + "createReviewForm",
    method: "post",
    baseURL,
  },
  updateReview: (id) => ({
    api: reviewsPrefix + "updateReview/" + id,
    method: "put",
    baseURL,
  }),
  deleteReview: (id) => ({
    api: reviewsPrefix + "deleteReview/" + id,
    method: "delete",
    baseURL,
  }),
  getAllReviews: {
    api: reviewsPrefix + "getAllReviews",
    method: "get",
    baseURL,
  },
  getAllReviews: {
    api: reviewsPrefix + "getAllReviews",
    method: "get",
    baseURL,
  },
  getAllReviewsByUserId: (id) => ({
    api: reviewsPrefix + "getAllReviewsByUserId/" + id,
    method: "get",
    baseURL,
  })
};

export const reviews_v2 = {
  createReview: {
    api: reviewsPrefix_v2 + "createReview",
    method: "post",
    baseURL,
  },
  updateReview: (id) => ({
    api: reviewsPrefix_v2 + "updateReview/" + id,
    method: "put",
    baseURL,
  }),
  deleteReview: (id) => ({
    api: reviewsPrefix_v2 + "deleteReview/" + id,
    method: "delete",
    baseURL,
  }),
  getAllReviews: {
    api: reviewsPrefix_v2 + "getAllReviews",
    method: "get",
    baseURL,
  },
  getAllReviewsByUserId: (id) => ({
    api: reviewsPrefix_v2 + "getAllReviewsByUserId/" + id,
    method: "get",
    baseURL,
  }),
  getReviewByUserId: (id, templateId) => ({
    api: reviewsPrefix_v2 + "getReport/" + id + "/" + templateId,
    method: "get",
    baseURL,
  }),
};

export const reviewForm = {
  createReviewForm: {
    api: reviewFormPrefix + "createReviewForm",
    method: "post",
    baseURL,
  },
  createMultipleReviewForm: {
    api: reviewFormPrefix + "createMultipleReviewForm",
    method: "post",
    baseURL,
  },
  updateReviewForm: (id) => ({
    api: reviewFormPrefix + "updateReviewForm/" + id,
    method: "put",
    baseURL,
  }),
  updateReviewFormMultiple: {
    api: reviewFormPrefix + "updateReviewFormMultiple",
    method: "put",
    baseURL,
  },
  deleteReviewForm: (id) => ({
    api: reviewFormPrefix + "deleteReviewForm/" + id,
    method: "delete",
    baseURL,
  }),
  getAllReviewsForm: {
    api: reviewFormPrefix + "getAllReviewsForm/" + companyId.toString() + "/" + AuthUserId + "/" + AuthRole,
    method: "get",
    baseURL,
  },
  getReviewFormByUserId: (id) => ({
    api: reviewFormPrefix + "getReviewFormByUserId/" + id,
    method: "get",
    baseURL,
  }),
  getReviewFormById: (id) => ({
    api: reviewFormPrefix + "getReviewFormById/" + id,
    method: "get",
    baseURL,
  }),
  getChartData: {
    api: reviewFormPrefix + "chartData/" + AuthRole + "/" + ((AuthRole === "HR Admin" || AuthRole === "Super Admin") ? companyId.toString() : AuthUserId),
    method: "get",
    baseURL,
  },
};
export const competencies = {
  createCompetency: {
    api: competencyPrefix + "createCompetency",
    method: "post",
    baseURL,
  },
  updateCompetency: (id) => ({
    api: competencyPrefix + "updateCompetency/" + id,
    method: "put",
    baseURL,
  }),
  deleteCompetency: (id) => ({
    api: competencyPrefix + "deleteCompetency/" + id,
    method: "delete",
    baseURL,
  }),
  getCompetencies: {
    api: competencyPrefix + "getCompetencies?companyId=" + companyId?.toString(),
    method: "get",
    baseURL,
  },
};
export const templates = {
  createTemplate: {
    api: templatePrefix + "createTemplate",
    method: "post",
    baseURL,
  },
  updateTemplate: (id) => ({
    api: templatePrefix + "updateTemplate/" + id,
    method: "put",
    baseURL,
  }),
  deleteTemplate: (id) => ({
    api: templatePrefix + "deleteTemplate/" + id,
    method: "delete",
    baseURL,
  }),
  getTemplates: {
    api: templatePrefix + "getTemplates",
    method: "get",
    baseURL,
  },
  getTemplateById: (id) => ({
    api: templatePrefix + "getTemplates/" + id,
    method: "get",
    baseURL,
  }),
};


export const openEndedQuestions = {
  createQuestion: {
    api: openEndedQuestionsPrefix + "addUpdateDeleteQuestions",
    method: "post",
    baseURL,
  },
  getQuestions: {
    api: openEndedQuestionsPrefix + "getQuestions",
    method: "get",
    baseURL,
  },
  deleteQuestion: (id) => ({
    api: openEndedQuestionsPrefix + "deleteQuestion/" + id,
    method: "delete",
    baseURL,
  }),
};

export const rewardPoints = {
  getRewardPoints: (id) => ({
    api: rewardPointsPrefix + "getRewardPoints/" + id,
    method: "get",
    baseURL,
  }),
  updateRewardPoints: (id) => ({
    api: rewardPointsPrefix + "updateRewardPoints/" + id,
    method: "put",
    baseURL,
  }),
  deleteRewardPoints: (id) => ({
    api: rewardPointsPrefix + "deleteRewardPoints/" + id,
    method: "delete",
    baseURL,
  }),
};

export const closeEndedQuestions = {
  createQuestion: {
    api: closeEndedQuestionsPrefix + "addUpdateDeleteQuestions",
    method: "post",
    baseURL,
  },
  getQuestions: {
    api: closeEndedQuestionsPrefix + "getQuestions",
    method: "get",
    baseURL,
  },
  deleteQuestion: (id) => ({
    api: closeEndedQuestionsPrefix + "deleteQuestion/" + id,
    method: "delete",
    baseURL,
  }),
};


export const sessions = {
  createSession: {
    api: sessionsPrefix + "createSession",
    method: "post",
    baseURL,
  },
  updateSession: (id) => ({
    api: sessionsPrefix + "updateSession/" + id,
    method: "put",
    baseURL,
  }),
  deleteSession: (id) => ({
    api: sessionsPrefix + "deleteSession/" + id,
    method: "delete",
    baseURL,
  }),
  getSessions: {
    api: sessionsPrefix + "getSessionsByUserId/" + AuthUserId,
    method: "get",
    baseURL,
  },
  getSessionById: (id) => ({
    api: sessionsPrefix + "getSessions/" + id,
    method: "get",
    baseURL,
  }),
};


export const ratingScales = {
  createRatingScale: {
    api: ratingScalesPrefix + "createRatingScale",
    method: "post",
    baseURL,
  },
  updateRatingScale: (id) => ({
    api: ratingScalesPrefix + "updateRatingScale/" + id,
    method: "put",
    baseURL,
  }),
  deleteRatingScale: (id) => ({
    api: ratingScalesPrefix + "deleteRatingScale/" + id,
    method: "delete",
    baseURL,
  }),
  getRatingScales: {
    api: ratingScalesPrefix + "getRatingScales/" + companyId.toString(),
    method: "get",
    baseURL,
  },
  getRatingScaleById: (id) => ({
    api: ratingScalesPrefix + "getRatingScales/" + id,
    method: "get",
    baseURL,
  }),
};

export const launchformApi = {
  createForm: {
    api: launchFormsPrefix + "createForm",
    method: "post",
    baseURL,
  },
  updateForm: (id) => ({
    api: launchFormsPrefix + "updateForm/" + id,
    method: "put",
    baseURL,
  }),
  deleteForm: (id) => ({
    api: launchFormsPrefix + "deleteForm/" + id,
    method: "delete",
    baseURL,
  }),
  getForms: {
    api: launchFormsPrefix + "getForms",
    method: "get",
    baseURL,
  },
  getFormById: (id) => ({
    api: launchFormsPrefix + "getForms/" + id,
    method: "get",
    baseURL,
  }),
  getFormByEmployeeId: (id) => ({
    api: launchFormsPrefix + "getFormsByEmployeeId/" + id,
    method: "get",
    baseURL,
  }),
};


export const advancedLaunchformApi = {
  createForm: {
    api: advancedLaunchFormsPrefix + "createForm",
    method: "post",
    baseURL,
  },
  updateForm: (id) => ({
    api: advancedLaunchFormsPrefix + "updateForm/" + id,
    method: "put",
    baseURL,
  }),
  deleteForm: (id) => ({
    api: advancedLaunchFormsPrefix + "deleteForm/" + id,
    method: "delete",
    baseURL,
  }),
  getForms: {
    api: advancedLaunchFormsPrefix + "getForms",
    method: "get",
    baseURL,
  },
  getFormById: (id) => ({
    api: advancedLaunchFormsPrefix + "getForms/" + id,
    method: "get",
    baseURL,
  }),
  getFormByEmployeeId: (id) => ({
    api: advancedLaunchFormsPrefix + "getFormsByEmployeeId/" + id,
    method: "get",
    baseURL,
  }),
  getReviewFormsByEmployeeId: (id) => ({
    api: advancedLaunchFormsPrefix + "getReviewFormsByEmployeeId/" + id + "/" + AuthRole + "/" + AuthTab,
    method: "get",
    baseURL,
  }),
};

export const salesforceApi = {
  getSalesforceUserInfo: {
    api: salesforcePrefix + "getSalesforceUser",
    method: "get",
    baseURL,
  },
  getResponseFromQuery: {
    api: salesforcePrefix + "querySalesforce",
    method: "post",
    baseURL,
  },
  createKPI: {
    api: salesforcePrefix + "createKPI",
    method: "post",
    baseURL,
  },
  updateKPI: (id) => ({
    api: salesforcePrefix + "updateKPIById/" + id,
    method: "put",
    baseURL,
  }),
  deleteKPI: (id) => ({
    api: salesforcePrefix + "deleteKPIById/" + id,
    method: "delete",
    baseURL,
  }),
  getKPIs: {
    api: salesforcePrefix + "getKPIs",
    method: "get",
    baseURL,
  },
  getKPIById: (id) => ({
    api: salesforcePrefix + "getKPIById/" + id,
    method: "get",
    baseURL,
  })
};

export const jiraApi = {
  getConfig: { api: jiraPrefix + "config", method: "get", baseURL },
  saveConfig: { api: jiraPrefix + "config", method: "post", baseURL },
  getIssues: { api: jiraPrefix + "issues", method: "get", baseURL },
  getTasks: { api: jiraPrefix + "tasks", method: "get", baseURL },
  syncJiraStatuses: {
    api: jiraPrefix + "sync",
    method: "post",
    baseURL,
  },
};

export const dashboardApi = {
  getDashboardData: {
    api: dashboardPrefix + "getDashboardData",
    method: "get",
    baseURL,
  },
  getTaskDashboardData: {
    api: dashboardPrefix + "getTaskDashboardData",
    method: "get",
    baseURL,
  },
};

// Theme settings APIs (minimal)
export const themeApi = {
  getCompanyTheme: (companyId) => ({
    api: themePrefix + "company/" + companyId,
    method: "get",
    baseURL,
  }),
  getThemeById: (themeId) => ({
    api: themePrefix + "get-theme/" + themeId,
    method: "get",
    baseURL,
  }),
  createTheme: {
    api: themePrefix + "save-theme",
    method: "post",
    baseURL,
  },
  updateTheme: (themeId) => ({
    api: themePrefix + "update-theme/" + themeId,
    method: "put",
    baseURL,
  }),
  uploadLogo: {
    api: themePrefix + "upload-logo",
    method: "post",
    baseURL,
  },
};