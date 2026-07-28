import gridIcon from "assets/svg/grid.svg";
import dartboard from "assets/svg/dartboard.svg";
import keyresults from "assets/svg/keyresults.svg";
import tasks from "assets/svg/tasks.svg";
import reviews from "assets/svg/reviews.svg";
import rewards from "assets/svg/rewards.svg";
import orgchart from "assets/svg/orgchart.svg";
import company from "assets/svg/company.svg";
import departments from "assets/svg/departments.svg";
import employess from "assets/svg/employees.svg";
import activeCompany from "assets/svg/activeCompany.svg";
import previlages from "assets/svg/previlages.svg";
import settings from "assets/svg/setups.svg";
import okrManagement from "assets/svg/okr-icon.svg";
import privilegeGroups from "assets/svg/privilege-groups.svg";
import rewardsManagement from "assets/svg/rewardsManagement.svg";
import rewardsManagementactive from "assets/svg/rewardsManagementactive.svg";
import perfomanceManagement from "assets/svg/perfomanceManagement.svg";
import bellcurve from "assets/images/bellcurve.png";
import paper from "assets/images/paper.png";
import questionnaire from "assets/images/questionnaire.png";
import catalog from "assets/images/catalog.png";
import competency from "assets/images/competency.png";
import notificationSettings from "assets/images/notification-settings.png";
import integrations from "assets/svg/integrations.svg";
import { AuthRole } from "utilities";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";

const routers = [
  {
    path: "/",
    exact: true,
    redirect: "/auth/login",
  },
  {
    component: "AuthLayout",
    path: "/auth",
    auth: false,
    name: "Auth",
    exact: false,
    //redirect: "/auth/login",
    childrens: [
      //{
      //  component: "Chatbot",
      //  componentPath: "pages/Chatbot",
      //  path: "/chatbot",
      //  name: "Chatbot",
      //  auth: false,
      //  exact: true,
      //},
      {
        component: "Login",
        componentPath: "pages/Auth/Login",
        path: "/login",
        name: "Login",
        auth: false,
        exact: true,
      },
      {
        component: "Register",
        componentPath: "pages/Auth/Register",
        path: "/register",
        name: "Register",
        auth: false,
        exact: true,
      },
      {
        component: "ForgotPassword",
        componentPath: "pages/Auth/ForgotPassword",
        path: "/forgotpassword",
        name: "ForgotPassword",
        auth: false,
        exact: true,
      },
      {
        component: "ResetPassword",
        componentPath: "pages/Auth/ResetPassword",
        path: "/resetpassword/:token",
        name: "ResetPassword",
        auth: false,
        exact: true,
      },
      {
        component: "DocumentUpload",
        componentPath: "pages/vihanga/pages/employeePortal/DocumentUpload",
        path: "/previlages/document-upload",
        name: "DocumentUpload",
        auth: false,
        exact: true,
      },
      {
        component: "FeedbackForm",
        componentPath: "pages/vihanga/pages/Recruitment/sections/feedBack",
        path: "/previlages/candidate/feedback",
        name: "feedback form",
        auth: false,
        exact: true,
      },
    ],
  },
  {
    component: "CandidateLayout",
    path: "/candidate",
    auth: false,
    name: "Candidate",
    exact: false,
    //redirect: "/auth/login",
    childrens: [
      {
        component: "DocumentUpload",
        componentPath: "pages/vihanga/pages/employeePortal/DocumentUpload",
        path: "/document-upload",
        name: "DocumentUpload",
        auth: false,
        exact: true,
      },
      {
        component: "FeedbackForm",
        componentPath: "pages/vihanga/pages/Recruitment/sections/feedBack",
        path: "/interviewer/feedback",
        name: "feedback form",
        auth: false,
        exact: true,
      },
      {
        component: "Profile",
        componentPath: "pages/vihanga/pages/employeePortal/Profile",
        path: "/profile",
        name: "Profile",
        auth: false,
        exact: true,
      },
    ],
  },
  {
    component: "PsychometricLayout",
    path: "/psychometric-test",
    auth: false,
    name: "Psychometric",
    exact: false,
    childrens: [
      {
        component: "PsychometricConditions",
        componentPath: "pages/vihanga/pages/Psychometric/Conditions",
        path: "",
        name: "PsychometricConditions",
        auth: false,
        exact: true,
      },
      {
        component: "PsychometricQuiz",
        componentPath: "pages/vihanga/pages/Psychometric/Quiz",
        path: "/quiz",
        name: "PsychometricQuiz",
        auth: false,
        exact: true,
      },
      {
        component: "PsychometricResult",
        componentPath: "pages/vihanga/pages/Psychometric/Result",
        path: "/result",
        name: "PsychometricResult",
        auth: false,
        exact: true,
      },
      {
        component: "PsychometricCompleted",
        componentPath: "pages/vihanga/pages/Psychometric/TestCompleted",
        path: "/test-completed",
        name: "PsychometricCompleted",
        auth: false,
        exact: true,
      },
    ],
  },
  {
    component: "AdminLayout",
    path: "/admin",
    auth: false,
    name: "Admin",
    exact: false,
    redirect: "/admin/setups/company",
    childrens: [
      {
        component: "SliderLarge",
        componentPath: "components/SliderLarge/Testing",
        path: "/slider",
        name: "Slider",
        auth: false,
        exact: false,
      },
      {
        component: "ApprovalPage",
        componentPath: "pages/vihanga/pages/approval-workflow",
        path: "/approval",
        name: "ApprovalPage",
        auth: false,
        exact: false,
      },
      {
        component: "AddApprovalStep",
        componentPath:
          "pages/vihanga/pages/approval-workflow/workFlow/addApprovalStep.js",
        // src\pages\vihanga\pages\approval-workflow\workFlow\addApprovalStep.js
        path: "/add-approval",
        name: "AddApprovalStep",
        auth: false,
        exact: false,
      },
      {
        component: "ApprovalWorkFlow",
        componentPath:
          "pages/vihanga/pages/approval-workflow/workFlow/approvalWorkFlow.js",
        // src\pages\vihanga\pages\approval-workflow\workFlow\approvalWorkFlow.js
        path: "/approval-workflow",
        name: "ApprovalWorkFlow",
        auth: false,
        exact: false,
      },
      // src\pages\vihanga\pages\approval-workflow\workFlow\approvalWorkFlow.js
      // {
      //   component: "Dashboard",
      //   componentPath: "pages/vihanga/pages/board/Page1",
      //   path: "/dashboard",
      //   name: "Dashboard",
      //   auth: false,
      //   exact: false,
      // },
      {
        component: "board",
        componentPath: "pages/vihanga/pages/board/Page2",
        path: "/board",
        name: "board",
        auth: false,
        exact: false,
      },
      {
        component: "AdvancedLaunchForm",
        componentPath: "pages/vihanga/pages/AdvanceLaunchForms/index",
        path: "/AdvancedLaunchForm",
        name: "AdvancedLaunchForm",
        auth: false,
        exact: false,
      },
      
      {
        component: "PerformanceManagement",
        componentPath: "pages/vihanga/pages/performannceManagement/index",
        path: "/PerformanceManagement",
        name: "PerformanceManagement",
        auth: false,
        exact: false,
      },
      {
        component: "Table",
        //src\pages\vihanga\pages\AdminPortal\assetsManagement\AssetsManagementSystem.js
        componentPath: "pages/vihanga/pages/AdminPortal/assetsManagement/AssetsManagementSystem",
        path: "/previlages/asset-management",
        name: "assets",
        auth: false,
        exact: false,
      },
      

      // {
      //   component: "Dashboard",
      //   componentPath: "pages/Dashboard",
      //   path: "/dashboard/me",
      //   name: "Dashboard",
      //   auth: false,
      //   exact: false,
      // },
      {
        component: "Dashboard1",
        componentPath: "pages/vihanga/pages/objectives/dashboard/screen1/index",
        path: "/objectives",
        name: "Dashboard1",
        auth: false,
        exact: true,
      },
      {
        component: "KeyResults",
        componentPath: "pages/KeyResults",
        path: "/keyresults",
        name: "KeyResults",
        auth: false,
        exact: true,
      },
      {
        component: "TaskTable",
        componentPath: "pages/vihanga/pages/objectives/me/table/table",
        path: "/tasks",
        name: "Tasks",
        auth: false,
        exact: true,
      },

      {
        component: "taskForm",
        /* src/pages/vihanga/pages/objectives/me/table/taskForm.js */
        componentPath:
          "pages/vihanga/pages/objectives/pages/Task",
        path: "/tasks/create",
        name: "Create Task",
        auth: false,
        exact: true,
      },
      {
        component: "taskFormEdit",
        /* src/pages/vihanga/pages/objectives/me/table/taskForm.js */
        componentPath:
          "pages/vihanga/pages/objectives/pages/Task",
        path: "/tasks/edit/:propTaskId",
        name: "Create Edit",
        auth: false,
        exact: true,
      },
      {
        component: "taskFormEdit",
        /* src/pages/vihanga/pages/objectives/me/table/taskForm.js */
        componentPath:
          "pages/vihanga/pages/objectives/pages/Task",
        path: "/tasks/subTask/:mainTaskId",
        name: "Create Edit",
        auth: false,
        exact: true,
      },
      {
        component: "Reviews",
        componentPath: "pages/vihanga/pages/Reviews/ReviewsTable",
        path: "/reviews",
        name: "Reviews",
        auth: false,
        exact: true,
      },
      {
        component: "ReviewsReport",
        componentPath: "pages/AdvancedReviews/ReviewReport",
        path: "/advancedreviews/:id/:templateId",
        name: "Reviews Report",
        auth: false,
        exact: true,
      },
      {
        component: "Reviews",
        componentPath: "pages/AdvancedReviews",
        path: "/advancedreviews",
        name: "Advanced Reviews",
        auth: false,
        exact: true,
      },
      {
        component: "Reviews",
        componentPath: "pages/vihanga/pages/Reviews/ReviewsForm",
        path: "/reviews/:id",
        name: "Reviews Form",
        auth: false,
        exact: true,
      },
      {
        component: "TraditionalReviewsReport",
        componentPath: "pages/vihanga/pages/Reviews/ReviewsReport/ReviewReport",
        path: "/reviews-report/:id/:userId",
        name: "Traditional Reviews Report",
        auth: false,
        exact: true,
      },
      {
        component: "Rewards",
        componentPath: "pages/Rewards",
        path: "/rewards/recognize",
        name: "Rewards",
        auth: false,
        exact: true,
      },
      {
        component: "Rewards",
        componentPath: "pages/Rewards",
        path: "/rewards/rewardsRedemption",
        name: "Rewards",
        auth: false,
        exact: true,
      },
      {
        component: "RewardsNomination",
        componentPath: "pages/Rewards/rewardsNomination",
        path: "/rewards/rewardsNomination",
        name: "RewardsNomination",
        auth: false,
        exact: true,
      },
      {
        component: "IHaveIdea",
        componentPath: "pages/Rewards/ihaveidea",
        path: "/rewards/ihaveidea",
        name: "IHaveIdea",
        auth: false,
        exact: true,
      },
      {
        component: "OrgChart",
        componentPath: "pages/OrgChart",
        path: "/orgChart",
        name: "OrgChart",
        auth: false,
        exact: true,
      },
      {
        component: "Goals",
        componentPath: "pages/Goals",
        path: "/goals",
        name: "Goals",
        auth: false,
        exact: true,
      },
      {
        component: "Sessions",
        componentPath: "pages/Previleges/ReviewPerformanceManagement/Session",
        path: "/sessions",
        name: "Sessions",
        auth: false,
        exact: true,
      },
      {
        component: "Session Calibration",
        componentPath:
          "pages/Previleges/ReviewPerformanceManagement/SessionCalibration",
        path: "/calibration/:id",
        name: "Session Calibration",
        auth: false,
        exact: true,
      },
      {
        component: "Company",
        componentPath: "pages/Setup/Company",
        path: "/setups/company",
        name: "Company",
        auth: false,
        exact: true,
      },
      {
        component: "Departments",
        componentPath: "pages/Setup/Departments",
        path: "/setups/departments",
        name: "Departments",
        auth: false,
        exact: true,
      },
      {
        component: "Employees",
        componentPath: "pages/Setup/Employees",
        path: "/setups/employees",
        name: "Employees",
        auth: false,
        exact: true,
      },
         {
        component: "TalentSpotify",
        componentPath: "pages/vihanga/pages/AdminPage",
        path: "/previlages/AdminCenter",
        name: "TalentSpotify",
        auth: false,
        exact: true,
      },
      {
        component: "ThemeSetting",
        componentPath: "pages/vihanga/pages/AdminPortal/ThemeSettings/ThemeSetting",
        path: "/previlages/AdminCenter/ThemeSettings",
        name: "ThemeSettings",
        auth: false,
        exact: true,
      },
      {
        component: "CompanyConfigurations",
        componentPath: "pages/vihanga/pages/AdminPortal/CompanyConfigurations",
        path: "/previlages/AdminCenter/CompanyConfigurations",
        name: "CompanyConfigurations",
        auth: false,
        exact: true,
      },
      {
        component: "RolesAndPreviliges",
        componentPath: "pages/Previleges/RolesAndPrevilages",
        path: "/previlages/rolesandprevilages",
        name: "Roles & Previlages",
        auth: false,
        exact: true,
      },
      {
        component: "ErrorLogs",
        componentPath: "pages/Previleges/ErrorLogs",
        path: "/previlages/error-logs",
        name: "Error Logs",
        auth: false,
        exact: true,
      },
      {
        component: "Recruitment",
        componentPath: "pages/vihanga/pages/Recruitment",
        path: "/previlages/RecruitmentManagement",
        name: "Recruitment Management",
        auth: false,
        exact: true,
      },
      {
        component: "AdminSessions",
        componentPath: "pages/Previleges/AdminSessions",
        path: "/previlages/active-sessions",
        name: "Active Sessions",
        auth: false,
        exact: true,
      },
      {
        component: "uploadAttendance",
        componentPath:
          "pages/vihanga/pages/employeePortal/TimeTracking/AttendanceUpload/AttendanceUpload",
        path: "/previlages/upload-attendance",
        name: "Attendance Upload",
        auth: false,
        exact: true,
      },
      {
        component: "uploadLeaves",
        componentPath:
          "pages/vihanga/pages/employeePortal/absencetimeoff/uploadLeaves",
        path: "/previlages/upload-leaves",
        name: "Upload Leaves",
        auth: false,
        exact: true,
      },
      {
        component: "KeyResults1",
        componentPath: "pages/vihanga/pages/KeyResults",
        path: "/previlages/KeyResults",
        name: "KeyResults1",
        auth: false,
        exact: true,
      },

      

      {
        component: "Leaves",
        componentPath: "pages/vihanga/pages/employeePortal",
        path: "/previlages/apply-leave",
        name: "Leaves Management",
        auth: false,
        exact: true,
      },

    

      //sidebar items added

      {
        component: "TimeTracking",
        componentPath: "pages/vihanga/pages/employeePortal/TimeTracking/WeeklyTime",
        path: "/previlages/time-tracking",
        name: "Weekly Time Tracking",
        auth: false,
        exact: true,
      },

      {
        component: "ExitInterview",
        componentPath:
          "pages/vihanga/pages/employeePortal/ExitInterViewQuestions",
        path: "/previlages/exit-interview",
        name: "ExitInterview",
        auth: false,
        exact: true,
      },

      {
        component: "ResignationForm",
        componentPath: "pages/vihanga/pages/employeePortal/Resination",
        path: "/previlages/resignation-form",
        name: "Resignation Form",
        auth: false,
        exact: true,
      },
      {
        component: "Dashboard",
        /* src/pages/vihanga/pages/dashboard/index.js */
        //src/pages/vihanga/pages/dashboard
        //src/pages/vihanga/pages/dashboard
        componentPath: "pages/vihanga/pages/dashboard",
        path: "/dashboard",
        name: "Dashboard",
        auth: false,
        exact: true,
      },

      {
        component: "TeamLeave",
        componentPath: "pages/vihanga/pages/employeePortal/TeamLeave",
        path: "/previlages/team-leave",
        name: "TeamLeave",
        auth: false,
        exact: true,
      },

      {
        component: "DocumentVerification",
        componentPath:
          "pages/vihanga/pages/employeePortal/documentVerification",
        path: "/previlages/document-verification",
        name: "DocumentVerification",
        auth: false,
        exact: true,
      },

      {
        component: "TimeHistory",
        componentPath:
          "pages/vihanga/pages/employeePortal/TimeTracking/timeSheetHistiory",
        path: "/previlages/time-history",
        name: "TimeHistory",
        auth: false,
        exact: true,
      },

      {
        component: "LeaveType",
        componentPath: "pages/vihanga/pages/AdminPortal/LeaveType",
        path: "/previlages/leave-type",
        /* src\pages\vihanga\pages\AdminPortal\LeaveType\index.js */
        name: "LeaveType",
        auth: false,
        exact: true,
      },
      {
        component: "HolidaysCalendar",
        componentPath: "pages/vihanga/pages/AdminPortal/HolidaysCalendar",
        path: "/previlages/holidays-calendar",
        /* src\pages\vihanga\pages\AdminPortal\LeaveType\index.js */
        name: "HolidaysCalendar",
        auth: false,
        exact: true,
      },
      {
        component: "EligibilityCriteria",
        componentPath: "pages/vihanga/pages/AdminPortal/EligibilityCriteria",
        path: "/previlages/eligibitity-criteria",
        /* src\pages\vihanga\pages\AdminPortal\EligibilityCriteria\index.js */
        name: "EligibilityCriteria",
        auth: false,
        exact: true,
      },
      {
        component: "DocumentType",
        componentPath: "pages/vihanga/pages/AdminPortal/DocumentType",
        path: "/previlages/document-type",
        name: "DocumentType",
        auth: false,
        exact: true,
      },
      {
        component: "DocumentSubmission",
        componentPath: "pages/vihanga/pages/employeePortal/DocumentSubmission",
        path: "/previlages/document-submission",
        name: "DocumentSubmission",
        auth: false,
        exact: true,
      },
      {
        component: "DocumentSubmissionsTable",
        componentPath: "pages/vihanga/pages/DocumentPanel/DocumentSubmissionsTable",
        path: "/previlages/document-submissions",
        name: "DocumentSubmissionsTable",
        auth: false,
        exact: true,
      },
      {
        component: "CareerJobs",
        componentPath: "pages/vihanga/pages/AdminPortal/CareerJobs",
        path: "/previlages/career-jobs",
        name: "CareerJobs",
        auth: false,
        exact: true,
      },

      {
        component: "ReportPage",
        componentPath: "pages/vihanga/pages/ReportPages",
        path: "/previlages/ReportPages/:id",
        name: "Report",
        auth: false,
        exact: true,
      },
      
      {
        component: "AppointmentLetter",
        componentPath: "pages/vihanga/pages/Recruitment/sections/offerLetter",
        path: "/previlages/AppointmentLetter/:id",
        name: "OfferLetter",
        auth: false,
        exact: true,
      },
      {
        component: "Objectives2",
        componentPath: "pages/vihanga/pages/objectives",
        path: "/objectives/objective",
        name: "Objectives2",
        auth: false,
        exact: true,
      },
      {
        component: "Dashboard3",
        componentPath: "pages/vihanga/pages/objectives/chats/team/index",
        path: "/objectives/myteam",
        name: "Dashboard3",
        auth: false,
        exact: true,
      },

      {
        component: "Details",
        componentPath: "pages/vihanga/pages/objectives/pages/Details2",
        path: "/objectives/details",
        name: "Details",
        auth: false,
        exact: true,
      },
      {
        component: "Task",
        componentPath: "pages/vihanga/pages/objectives/pages/Task",
        path: "/objectives/task",
        name: "Task",
        auth: false,
        exact: true,
      },

      {
        component: "Recurrance",
        componentPath: "pages/vihanga/pages/objectives/pages/Recurrance",
        path: "/previlages/objectives/recurrance",
        name: "Recurrance",
        auth: false,
        exact: true,
      },
      {
        component: "board",
        componentPath: "pages/vihanga/pages/board/index",
        path: "/previlages/board",
        name: "board",
        auth: false,
        exact: true,
      },
      {
        component: "CandidateCreate",
        componentPath:
          "pages/vihanga/pages/Recruitment/sections/candidateDetails",
        path: "/previlages/candidate/create",
        name: "candidate create",
        auth: false,
        exact: true,
      },

      {
        component: "CandidateCreate",
        componentPath:
          "pages/vihanga/pages/Recruitment/sections/candidateDetails",
        path: "/previlages/candidate/create/:id",
        name: "candidate edit",
        auth: false,
        exact: true,
      },
      {
        component: "FeedBackReport",
        componentPath: "pages/vihanga/pages/Recruitment/sections/feedBack",
        path: "/feedback-report/:id",
        name: "FeedBackReport",
        auth: false,
        exact: true,
      },
      {
        component: "OKRManagement",
        componentPath: "pages/Previleges/OKRManagement",
        path: "/previlages/okrmanagement",
        name: "OKRManagement",
        auth: false,
        exact: true,
      },


      {
        component: "LookUpsPage",
        componentPath: "pages/vihanga/pages/AdminPortal/Lookups",
        path: "/previlages/Lookups",
        name: "Lookups",
        auth: false,
        exact: true,
      },
      {
        component: "QuestionnaireManagement",
        componentPath: "pages/Previleges/QuestionnaireManagement",
        path: "/previlages/questionaireManagement",
        name: "QuestionnaireManagement",
        auth: false,
        exact: true,
      },
      {
        component: "PrivilegeGroups",
        componentPath: "pages/Previleges/PrivilegeGroups",
        path: "/previlages/privilegegroups",
        name: "PrivilegeGroups",
        auth: false,
        exact: true,
      },
      {
        component: "RewardsManagement",
        componentPath: "pages/Previleges/RewardsManagement",
        path: "/previlages/rewardsManagement",
        name: "RewardsManagement",
        auth: false,
        exact: true,
      },
      {
        component: "CatalogManagement",
        componentPath: "pages/Previleges/RewardsManagement/CatalogManagement",
        path: "/previlages/catalogManagement",
        name: "CatalogManagement",
        auth: false,
        exact: true,
      },
      {
        component: "NotificationSettings",
        componentPath: "pages/NotificationSettings/Settings",
        path: "/settings/notificationsettings",
        name: "Notification Settings",
        auth: false,
        exact: true,
      },
      {
        component: "PerformanceManagement",
        componentPath: "pages/Previleges/PerformanceManagement",
        path: "/previlages/performanceManagement",
        name: "PerformanceManagement",
        auth: false,
        exact: true,
      },
      {
        component: "IntegrationManagement",
        componentPath: "pages/Previleges/IntegrationManagement",
        path: "/previlages/integrationManagement",
        name: "IntegrationManagement",
        auth: false,
        exact: true,
      },
      {
        component: "SalesforceIntegrationManagement",
        componentPath:
          "pages/Previleges/IntegrationManagement/components/auth/Auth",
        path: "/previlages/integrationManagement/salesforce/setup",
        name: "Auth",
        auth: false,
        exact: true,
      },
      {
        component: "JiraSetup",
        componentPath:
          "pages/Previleges/IntegrationManagement/components/jira/JiraSetup",
        path: "/previlages/integrationManagement/jira/setup",
        name: "JiraSetup",
        auth: false,
        exact: true,
      },
      {
        component: "SalesforceKpis",
        componentPath:
          "pages/Previleges/IntegrationManagement/components/salesforce/Kpis",
        path: "/previlages/integrationManagement/salesforce/setup/:id",
        name: "Kpis",
        auth: false,
        exact: true,
      },
      {
        component: "SalesforceKpis",
        componentPath:
          "pages/Previleges/IntegrationManagement/components/salesforce/Kpiquery",
        path: "/previlages/integrationManagement/salesforce/setup/:id/kpiquery",
        name: "Kpiquery",
        auth: false,
        exact: true,
      },
      {
        component: "CompetencyManagement",
        componentPath: "pages/Previleges/CompetencyManagement",
        path: "/previlages/competencyManagement",
        name: "CompetencyManagement",
        auth: false,
        exact: true,
      },
      {
        component: "ReviewPerformanceManagement",
        componentPath: "pages/Previleges/ReviewPerformanceManagement",
        path: "/previlages/reviewPerformanceManagement",
        name: "ReviewPerformanceManagement",
        auth: false,
        exact: true,
      },
      {
        component: "Templates",
        componentPath: "pages/Previleges/ReviewPerformanceManagement/Templates",
        path: "/previlages/templatesPerformanceManagement",
        name: "Templates",
        auth: false,
        exact: true,
      },
      {
        component: "LaunchForms",
        componentPath:
          "pages/Previleges/ReviewPerformanceManagement/LaunchForms",
        path: "/previlages/launchFormsPerformanceManagement",
        name: "LaunchForms",
        auth: false,
        exact: true,
      },
      {
        component: "AdvancedLaunchForms",
        componentPath:
          "pages/Previleges/ReviewPerformanceManagement/AdvancedLaunchForms",
        path: "/previlages/advanced-launchFormsPerformanceManagement",
        name: "AdvancedLaunchForms",
        auth: false,
        exact: true,
      },
      {
        component: "ReviewManagement",
        componentPath:
          "pages/Previleges/ReviewPerformanceManagement/ReviewManagement",
        path: "/previlages/configureReviewManagement",
        name: "ReviewManagement",
        auth: false,
        exact: true,
      },
      {
        component: "Session",
        componentPath: "pages/Previleges/ReviewPerformanceManagement/Session",
        path: "/previlages/calibrationManagement",
        name: "Session",
        auth: false,
        exact: true,
      },
      {
        component: "FormCreate",
        componentPath: "pages/Setup/Employees/FormCreate",
        path: "/setups/employeeform",
        name: "FormCreate",
        auth: false,
        exact: true,
      },
      {
        component: "FormEdit",
        componentPath: "pages/Setup/Employees/FormEdit",
        path: "/setups/employeeEdit",
        name: "FormEdit",
        auth: false,
        exact: true,
      },
      {
        component: "Previlages",
        componentPath: "pages/Previlages",
        path: "/Previlages",
        name: "Previlages",
        auth: false,
        exact: true,
      },
      {
        component: "OkrDetailsID",
        componentPath: "pages/Objectives/OkrDetailsID",
        path: "/objectives/okr-details/:id",
        name: "OKR-Details",
        auth: false,
        exact: true,
      },
      {
        component: "OKRDetails",
        componentPath: "pages/Objectives/OkrDetails",
        path: "/objectives/okrdetails",
        name: "OKRDetails",
        auth: false,
        exact: true,
      },
      {
        component: "Notifications",
        componentPath: "pages/Notifications",
        path: "/notifications",
        name: "Notifications",
        auth: false,
        exact: true,
      },
      {
        component: "RewardPointsManagement",
        componentPath: "pages/Previleges/RewardPointsManagement",
        path: "/reward-points-management",
        name: "Reward Points Management",
        auth: false,
        exact: true,
      },
    ],
  },
];

// sidebar links
export const links = () => {
  let result = [];
  let privileges = getItemFromLocalStorage("privileges");
  const AuthRole = getItemFromLocalStorage("AuthRole"); // Assuming you get AuthRole from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const UserRole = user.role?.trim().toLowerCase();
  console.log(UserRole,'UserRole')
  

  if (Array.isArray(privileges) && privileges.length > 0) {

    if (
      AuthRole === "Super Admin" ||
      (Array.isArray(privileges) && privileges?.filter?.(
        (privilege) => privilege.page === "Dashboards" && privilege.view
      ).length > 0)
    ) {
      result.push({
        icon: gridIcon,
        title: "Sidebar.Dashboard",
        link: "/admin/dashboard",
      });
    }
    if (
      AuthRole === "Super Admin" ||
      (Array.isArray(privileges) && privileges.filter?.(
        (privilege) => privilege.page === "Objectives" && privilege.view
      ).length > 0)
    ) {
      result.push({
        icon: dartboard,
        title: "Sidebar.Objectives",
        link: "/admin/objectives",
      });
    }
    // if (
    //   AuthRole === "Super Admin" ||
    //   (Array.isArray(privileges) && privileges.filter?.(
    //     (privilege) => privilege.page === "Key Results" && privilege.view
    //   ).length > 0)
    // ) {
    //   result.push({
    //     icon: keyresults,
    //     title: "Sidebar.KeyResults",
    //     link: "/admin/keyresults",
    //   });
    // }
    if (
      AuthRole === "Super Admin" ||
      (Array.isArray(privileges) && privileges.filter?.(
        (privilege) => privilege.page === "Tasks" && privilege.view
      ).length > 0)
    ) {
      result.push({
        icon: tasks,
        title: "Sidebar.Tasks",
        link: "/admin/tasks",
      });
    }
    if (
      AuthRole === "Super Admin" ||
      (Array.isArray(privileges) && privileges.filter?.(
        (privilege) => privilege.page === "Reviews" && privilege.view
      ).length > 0)
    ) {
      result.push({
        icon: reviews,
        title: "Sidebar.Reviews",
        link: "/admin/reviews",
      });
    }
    if (
      AuthRole === "Super Admin" ||
      (Array.isArray(privileges) && privileges.filter?.(
        (privilege) => privilege.page === "Advanced Reviews" && privilege.view
      ).length > 0)
    ) {
      result.push({
        icon: reviews,
        title: "Sidebar.AdvancedReviews",
        link: "/admin/advancedreviews",
      });
    }
    if (
      AuthRole === "Super Admin" ||
      (Array.isArray(privileges) && privileges.filter?.(
        (privilege) => privilege.page === "Rewards" && privilege.view
      ).length > 0)
    ) {
      result.push({
        icon: rewards,
        title: "Sidebar.RewardsRedemption",
        link: "/admin/rewards/rewardsRedemption",
      });
    }
    if (
      AuthRole === "Super Admin" ||
      (Array.isArray(privileges) && privileges.filter?.(
        (privilege) => privilege.page === "RewardsNomination" && privilege.view
      ).length > 0)
    ) {
      result.push({
        icon: rewards,
        title: "Sidebar.RewardsNomination",
        link: "/admin/rewards/rewardsNomination",
      });
    }
    if (
      AuthRole === "Super Admin" ||
      (Array.isArray(privileges) && privileges.filter?.(
        (privilege) => privilege.page === "IHaveIdea" && privilege.view
      ).length > 0)
    ) {
      result.push({
        icon: rewards,
        title: "Sidebar.IHaveIdea",
        link: "/admin/rewards/ihaveidea",
      });
    }
   

    ////new privilages-------------------------
    if (
      AuthRole === "Super Admin" ||
      (Array.isArray(privileges) && privileges.filter?.(
        (privilege) => privilege.page === "Time Login" && privilege.view
      ).length > 0)
    ) {
      result.push({
        icon: dartboard,
        activeIcon: activeCompany,
        title: "Sidebar.TimeLogin",
        link: "/admin/previlages/time-history",
      });

    }

    if (
      AuthRole === "Super Admin" ||
      (Array.isArray(privileges) && privileges.filter?.(
        (privilege) => privilege.page === "Team Leave" && privilege.view
      ).length > 0)
    ) {
      result.push({
        icon: privilegeGroups,
        activeIcon: activeCompany,
        title: "Sidebar.TeamLeave",
        link: "/admin/previlages/team-leave",
      });


    }
    if (
      AuthRole === "Super Admin" ||
      (Array.isArray(privileges) && privileges.filter?.(
        (privilege) => privilege.page === "Absence/Time-Off" && privilege.view
      ).length > 0)
    ) {
      result.push({
        icon: rewardsManagement,
        activeIcon: activeCompany,
        title: "Sidebar.Absence",
        link: "/admin/previlages/apply-leave",
      });

    }

    if (
      AuthRole === "Super Admin"||
      (Array.isArray(privileges) && privileges.filter?.(
        (privilege) => privilege.page === "Resignation Management" && privilege.view
      ).length > 0)
    ) {
      result.push({
        icon: tasks,
        activeIcon: activeCompany,
        title: "Sidebar.ResignationManagement",
        link: "/admin/previlages/resignation-form",
      });

    }
    if (
      UserRole === "super admin" ||
      (Array.isArray(privileges) &&
        privileges.filter?.(
          (privilege) => privilege.page === "Privileges" && privilege.view
        ).length > 0)
    ) {
      result.push({
        icon: previlages,
        activeIcon: activeCompany,
        title: "Sidebar.Privileges",
        link: "/admin/previlages/AdminCenter",
      });
    }
    if (
      UserRole === "super admin" ||
      (Array.isArray(privileges) &&
        privileges.filter?.(
          (privilege) => privilege.page === "company" && privilege.view
        ).length > 0)
    ) {
      result.push({
        icon: company,
        activeIcon: activeCompany,
        title: "Sidebar.Company",
        link: "/admin/setups/company",
      });

    }


    if (
      UserRole === "super admin" ||
      (Array.isArray(privileges) &&
        privileges.filter?.(
          (privilege) => (privilege.page === "departments" || privilege.page === "functions") && privilege.view
        ).length > 0)
    ) {
      result.push({
        icon: departments,
        activeIcon: activeCompany,
        title: "Sidebar.Departments",
        link: "/admin/setups/departments",
      });

    }



   if (
    UserRole === "super admin" ||
    (Array.isArray(privileges) &&
      privileges.filter?.(
        (privilege) => privilege.page === "employees" && privilege.view
      ).length > 0)
  )  {
      result.push({
        icon: employess,
        activeIcon: activeCompany,
        title: "Sidebar.Employees",
        link: "/admin/setups/employees",
      });

    }

    
    // Document-related menu items for employees
    if (
      AuthRole === "Super Admin" ||
      (Array.isArray(privileges) && privileges.filter?.(
        (privilege) => privilege.page === "Document Type Management" && privilege.view
      ).length > 0)
    ) {
      result.push({
        icon: paper,
        activeIcon: activeCompany,
        title: "Sidebar.DocumentTypeManagement",
        link: "/admin/previlages/document-type",
      });
    }
    
    if (
      AuthRole === "Super Admin" ||
      (Array.isArray(privileges) && privileges.filter?.(
        (privilege) => privilege.page === "Document Submission" && privilege.view
      ).length > 0)
    ) {
      result.push({
        icon: paper,
        activeIcon: activeCompany,
        title: "Sidebar.DocumentSubmission",
        link: "/admin/previlages/document-submission",
      });
    }
    
    if (
      AuthRole === "Super Admin" ||
      (Array.isArray(privileges) && privileges.filter?.(
        (privilege) => privilege.page === "Document Approval Management" && privilege.view
      ).length > 0)
    ) {
      result.push({
        icon: paper,
        activeIcon: activeCompany,
        title: "Sidebar.DocumentSubmissions",
        link: "/admin/previlages/document-submissions",
      });
    }
    if (
      AuthRole === "Super Admin" ||
      (Array.isArray(privileges) && privileges.filter?.(
        (privilege) => privilege.page === "Error Logs" && privilege.view
      ).length > 0)
    ) {
      result.push({
        icon: paper,
        activeIcon: activeCompany,
        title: "Error Logs",
        link: "/admin/previlages/error-logs",
      });
    }
    ////new privilages-------------------------

    if (
      AuthRole === "Super Admin" ||
      (Array.isArray(privileges) && privileges.filter?.(
        (privilege) => privilege.page === "Org Chart" && privilege.view
      ).length > 0)
    ) {
      result.push({
        icon: orgchart,
        title: "Sidebar.OrgChart",
        link: "/admin/orgChart",
      });
    }
    if (
      AuthRole === "Super Admin" ||
      (Array.isArray(privileges) && privileges.filter?.(
        (privilege) => privilege.page === "Goals" && privilege.view
      ).length > 0)
    ) {
      result.push({
        icon: dartboard,
        title: "Sidebar.Goals",
        link: "/admin/goals",
      });
    }
    if (
      Array.isArray(privileges) && privileges.filter?.(
        (privilege) => privilege.page === "Sessions" && privilege.view
      ).length > 0
    ) {
      result.push({
        icon: bellcurve,
        title: "Sidebar.Sessions",
        link: "/admin/sessions",
      });
    }
    if (
      Array.isArray(privileges) && privileges.filter?.(
        (privilege) =>
          privilege.page === "Advanced Launch Forms" && privilege.view
      ).length > 0
    ) {
      result.push({
        icon: paper,
        title: "Sidebar.AdvancedLaunchForms",
        link: "/admin/previlages/advanced-launchFormsPerformanceManagement",
      });
    }
    if (
      Array.isArray(privileges) && privileges.filter?.(
        (privilege) => privilege.page === "Reward Points Management" && privilege.view
      ).length > 0
    ) {
      result.push({
        icon: rewards,
        title: "Sidebar.RewardPoints",
        link: "/admin/reward-points-management",
      });
    }
  }
  return result;
};

//sidebar admin activity links

export const adminActivityLinks = () => {
  const privileges = getItemFromLocalStorage("privileges") || [] ;
  const isSuperAdmin = AuthRole === "Super Admin";

  // Base: Company is always shown to Super Admin, hidden for others unless explicit permission is desired later
  const links = [];

  if (isSuperAdmin) {
    links.push({
      icon: company,
      activeIcon: activeCompany,
      title: "Sidebar.Company",
      link: "/admin/setups/company",
    });
  }

  const hasView = (pageName) =>
    Array.isArray(privileges) &&
    privileges.filter?.((p) => p.page === pageName && p.view).length > 0;

  if (isSuperAdmin || hasView("Departments")) {
    links.push({
      icon: departments,
      activeIcon: activeCompany,
      title: "Sidebar.Departments",
      link: "/admin/setups/departments",
    });
  }

  if (isSuperAdmin || hasView("Employees")) {
    links.push({
      icon: employess,
      activeIcon: activeCompany,
      title: "Sidebar.Employees",
      link: "/admin/setups/employees",
    });
  }

  return links;
};








export const rolesAndPrevilages = [
  {
     icon: previlages,
    activeIcon: activeCompany,
    title: "Admin Center",
    permissionKey: "Admin Center",
    link: "/admin/previlages/AdminCenter", 
  },
  {
    icon: previlages,
    activeIcon: activeCompany,
    title: "Sidebar.RolesAndPrivileges",
    permissionKey: "Roles & Privileges",
    link: "/admin/previlages/rolesandprevilages",
  },

  {
    icon: catalog,
    activeIcon: activeCompany,
    title: "Recruitment Management",
    permissionKey: "Recruitment Management",
    link: "/admin/previlages/RecruitmentManagement",
  },
  {
    icon: catalog,
    activeIcon: activeCompany,
    title: "Career Jobs",
    permissionKey: "Career Jobs",
    link: "/admin/previlages/career-jobs",
  },
  {
    icon: catalog,
    activeIcon: activeCompany,
    title: "Attendance Upload",
    permissionKey: "Attendance Upload",
    link: "/admin/previlages/upload-attendance",
  },
  {
    icon: catalog,
    activeIcon: activeCompany,
    title: "Upload Leaves",
    permissionKey: "Upload Leaves",
    link: "/admin/previlages/upload-leaves",
  },
  {
    icon: catalog,
    activeIcon: activeCompany,
    title: "Active Sessions",
    permissionKey: "Active Sessions",
    link: "/admin/previlages/active-sessions",
  },
  {
    icon: catalog,
    activeIcon: activeCompany,
    title: "Error Logs",
    permissionKey: "Error Logs",
    link: "/admin/previlages/error-logs",
  },
  {
    icon: catalog,
    activeIcon: activeCompany,
    title: "Approval Workflow",
    permissionKey: "Approval WorkFlow",
    link: "/admin/approval-workflow",
  },
  {
     icon: catalog,
    activeIcon: activeCompany,
    title: "Asset Management",
    permissionKey: "Asset Management",
    link: "/admin/previlages/asset-management",
  },
  {
    icon: settings,
    activeIcon: activeCompany,
    title: "Theme Settings",
    permissionKey: "Theme Settings",
    link: "/admin/previlages/AdminCenter/ThemeSettings",
  },
  {
    icon: catalog,
    activeIcon: activeCompany,
    title: "Company Configurations",
    permissionKey: "Company Configurations",
    link: "/admin/previlages/AdminCenter/CompanyConfigurations",
  },

  //sidebar items added

  // {
  //   icon: rewardsManagement,
  //   activeIcon: activeCompany,
  //   title: "Absence/time off",
  //   link: "/admin/previlages/apply-leave",
  // },
  // {
  //   icon: previlages,
  //   activeIcon: activeCompany,
  //   title: "Team Leave",
  //   link: "/admin/previlages/team-leave",
  // },

  // {
  //   icon: catalog,
  //   activeIcon: activeCompany,
  //   title: "Time Tracking",
  //   link: "/admin/previlages/time-tracking",
  // },

  // {
  //   icon: catalog,
  //   activeIcon: activeCompany,
  //   title: "Document Upload",
  //   link: "/admin/previlages/document-upload",
  // },

  // {
  //   icon: catalog,
  //   activeIcon: activeCompany,
  //   title: "Exit Interview",
  //   link: "/admin/previlages/exit-interview",
  // },

  // {
  //   icon: catalog,
  //   activeIcon: activeCompany,
  //   title: "Resignation Form",
  //   link: "/admin/previlages/resignation-form",
  // },

 

  // {
  //   icon: catalog,
  //   activeIcon: activeCompany,
  //   title: "Document Verification",
  //   link: "/admin/previlages/document-verification",
  // },

  // {
  //   icon: catalog,
  //   activeIcon: activeCompany,
  //   title: "Time History",
  //   link: "/admin/previlages/time-history",
  // },

  {
    icon: catalog,
    activeIcon: activeCompany,
    title: "Leave Type",
    permissionKey: "Leave Type",
    link: "/admin/previlages/leave-type",
  },
  {
    icon: catalog,
    activeIcon: activeCompany,
    title: "Holidays Calendar",
    permissionKey: "Holidays Calendar",
    link: "/admin/previlages/holidays-calendar",
  },
  {
    icon: catalog,
    activeIcon: activeCompany,
    title: "Eligibility Criteria",
    permissionKey: "Eligibility Criteria",
    link: "/admin/previlages/eligibitity-criteria",
  },

  //sidebar items ended

  {
    icon: privilegeGroups,
    activeIcon: activeCompany,
    title: "Sidebar.PrivilegeGroups",
    permissionKey: "Privilege Groups",
    link: "/admin/previlages/privilegegroups",
  },
  {
    icon: okrManagement,
    activeIcon: activeCompany,
    title: "Sidebar.OKRManagement",
    permissionKey: "OKR Management",
    link: "/admin/previlages/okrmanagement",
  },


   {
    icon: okrManagement,
    activeIcon: activeCompany,
    title: "Lookups",
    permissionKey: "Lookups",
    link: "/admin/previlages/Lookups",
  },
  //  {
  //    icon: catalog,
  //   activeIcon: activeCompany,
  //   title: "sidebar.management",
  //   link: "/admin/previlages/asset-management",
  // },

  {
    icon: rewardsManagement,
    activeIcon: rewardsManagementactive,
    title: "Sidebar.RewardsManagement",
    permissionKey: "Rewards Management",
    link: "/admin/previlages/rewardsManagement",
  },
  {
    icon: catalog,
    activeIcon: rewardsManagementactive,
    title: "Sidebar.CatalogManagement",
    permissionKey: "Catalog Management",
    link: "/admin/previlages/catalogManagement",
  },
  {
    icon: notificationSettings,
    activeIcon: activeCompany,
    title: "Sidebar.NotificationSettings",
    permissionKey: "Notification Settings",
    link: "/admin/settings/notificationsettings",
  },
  {
    icon: perfomanceManagement,
    activeIcon: activeCompany,
    title: "Sidebar.AdvancedPerformanceManagement",
    permissionKey: "Advanced Performance Management",
    link: "/admin/previlages/performanceManagement",
  },
  {
    icon: integrations,
    activeIcon: activeCompany,
    title: "Sidebar.IntegrationManagement",
    permissionKey: "Integration Management",
    link: "/admin/previlages/integrationManagement",
  },
  {
    icon: questionnaire,
    activeIcon: activeCompany,
    title: "Sidebar.QuestionnaireManagement",
    permissionKey: "Questionaire Management",
    link: "/admin/previlages/questionnaireManagement",
  },
  {
    icon: competency,
    activeIcon: activeCompany,
    title: "Sidebar.CompetencyManagement",
    permissionKey: "Competency Management",
    link: "/admin/previlages/competencyManagement",
  },
  {
    icon: perfomanceManagement,
    activeIcon: activeCompany,
    title: "Sidebar.PerformanceManagementTemplates",
    permissionKey: "Performance Management Templates",
    link: "/admin/previlages/templatesPerformanceManagement",
  },
  {
    icon: paper,
    activeIcon: activeCompany,
    title: "Sidebar.LaunchFormsManagement",
    permissionKey: "Launch Forms Management",
    link: "/admin/previlages/launchFormsPerformanceManagement",
  },
  {
    icon: bellcurve,
    activeIcon: activeCompany,
    title: "Sidebar.CalibrationManagement",
    permissionKey: "Calibration Management",
    link: "/admin/previlages/calibrationManagement",
  },
  {
    icon: paper,
    activeIcon: activeCompany,
    title: "Sidebar.AdvancedLaunchFormsManagement",
    permissionKey: "Advanced Launch Forms Management",
    link: "/admin/previlages/advanced-launchFormsPerformanceManagement",
  },
];



export const createOKR = [
  {
    icon: "company",
    activeIcon: activeCompany,
    title: "Library OKR",
    link: "/admin/setups/company",
  },
  {
    icon: departments,
    activeIcon: activeCompany,
    title: "Non Library OKRY",
    link: "/admin/setups/departments",
  },
];

export default routers;
