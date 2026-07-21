
export const getUserData = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    const userData = JSON.parse(userStr);
    return userData;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};


export const getPrivileges = () => {
  try {
    const privilegesStr = localStorage.getItem("privileges");
    if (!privilegesStr) return [];
    const privileges = JSON.parse(privilegesStr);
    return Array.isArray(privileges) ? privileges : [];
  } catch (error) {
    console.error("Error parsing privileges:", error);
    return [];
  }
};

const routeToPageName = {
  'dashboard': 'Dashboards',
  'objectives/objective': 'Objectives',
  'objectives': 'Objectives',
  'keyresults': 'Key Results',
  'tasks': 'Tasks',
  'rewards': 'Rewards',
  'rewardsNomination': 'RewardsNomination',
  'ihaveidea': 'IHaveIdea',
  'orgChart': 'Org Chart',
  'reviews': 'Reviews',
  'advancedreviews': 'Advanced Reviews',
  'company-level': 'Company Level Access',
  'team-level': 'Team Level Access',
  'functional-level': 'Functional Level Access',
  'team-leave': 'Team Leave',
  'time-history': 'Time Login',
  'time-tracking': 'Time Login',
  'apply-leave': 'Absence/Time-Off',
  'leave-history': 'Absence/Time-Off',
  'resignation-form': 'Resignation Management',
  'document-type': 'Document Type Management',
  'RecruitmentManagement': 'Recruitment Management',
  'upload-leaves': 'Upload Leaves',
  'upload-attendance': 'Attendance Upload',
  'approval-workflow': 'Approval WorkFlow',
  'asset-management': 'Asset Management',
  'leave-type': 'Leave Type',
  'eligibility-criteria': 'Eligibility Criteria',
  'privilegegroups': 'Privilege Groups',
  'okrmanagement': 'OKR Management',
  'rewardsManagement': 'Rewards Management',
  'catalogManagement': 'Catalog Management',
  'notificationsettings': 'Notification Settings',
  'performanceManagement': 'Performance Management Templates',
  'templatesPerformanceManagement': 'Performance Management Templates',
  'competencyManagement': 'Competency Management',
  'launchFormsPerformanceManagement': 'Launch Forms Management',
  'advanced-launchFormsPerformanceManagement': 'Advanced Launch Forms Management',
  'calibrationManagement': 'Calibration Management',
  'document-submissions': 'Document Approval Management',
  'document-submission': 'Document Submission',
  'company': 'company',
  'departments': 'Departments',
  'employees': 'Employees',
  'lookups': 'Lookups',
  "employeeform": "Employees",
  "employeeEdit": "Employees",
  'active-sessions': 'Active Sessions',
  'holidays-calendar': 'Holidays Calendar',
  'questionaireManagement': 'Questionaire Management',
  'career-jobs': 'Career Jobs',
};


const getCurrentPageName = () => {
  const path = window.location.pathname;

  // Find the first matching route pattern
  for (const [routePattern, pageName] of Object.entries(routeToPageName)) {
    if (path.includes(routePattern)) {
      return pageName;
    }
  }

  return null;
};

// Privilege structure: { page: "Time Login", category: "Employees", view: true, edit: true, delete: false }
export const hasPrivilege = (privilegeType = "view", actionPageName = null) => {
  try {
    const userData = getUserData();
    if (!userData) return true;

    // Super Admin has all privileges
    /* if (userData.role === "Super Admin") {
      return true;
    } */

    // Get current page name from route OR use the provided actionPageName override
    const pageName = actionPageName || getCurrentPageName();
    if (!pageName) return true;

    // Get privileges from separate localStorage key
    const privileges = getPrivileges();
    if (!privileges || privileges.length === 0) return true;

    // Find the page privilege by page name
    // Prioritize exact match, then try includes
    const pagePrivilege = privileges.find(
      (privilege) => privilege.page === pageName
    ) || privileges.find(
      (privilege) => privilege.page && pageName.includes(privilege.page)
    );

    if (!pagePrivilege) return true;

    // Return the specific privilege type (view, edit, delete)
    return pagePrivilege[privilegeType] === true;
  } catch (error) {
    console.error("Error checking privilege:", error);
    return true;
  }
};

// Check if user can edit on current page
export const canEdit = () => {
  return hasPrivilege("edit");
};

// Check if user can delete on current page
export const canDelete = () => {
  return hasPrivilege("delete");
};

// Check if user is Super Admin
export const isSuperAdmin = () => {
  const userData = getUserData();
  return userData?.role === "Super Admin";
};

