// import React from "react";
// import WorkflowType from "./WorkFlowType";
// import CreateWorkFlow from "../approval-workflow/CreateWorkFlow";
// import CreateDetails from "./DetailWorkFlow";

// import ThemeForm from "./ThemeSetting";
// import ApprovalWorkFlow from "./workflow/approvalWorkFlow";
// import AddApprovalStep from "./workflow/addApprovalStep";
// const ApprovalPage = () => {
//   return (
//     <div style={{ marginTop: "30px" }}>
//       <ApprovalWorkFlow />
//       <AddApprovalStep />
//       <div>
//         <CreateWorkFlow />
//       </div>
//       <div>
//         <WorkflowType />
//       </div>
//       <div>
//         <CreateDetails />
//       </div>
//       <div>
//         <ThemeForm />
//       </div>
//     </div>
//   );
// };

// export default ApprovalPage;

// import React from "react";
// import WorkflowType from "./WorkFlowType";
import ThemeForm from "./ThemeSetting";
import WorkflowDetails from "./DetailWorkFlow";
// import CreateWorkFlow from "../approval-workflow/CreateWorkFlow";
// import CreateDetails from "./DetailWorkFlow";
// import LookUpsPage from "../AdminPortal/Lookups/index";
import ApprovalWorkFlow from "./workFlow/approvalWorkFlow";
import AddApprovalStep from "./workFlow/addApprovalStep";
// import Management from "../AdminPortal/assetsManagement/index";
import AccessLevelPage from "./AcessLevel";
import CreateWorkFlow from "./WorkFlowChain";
import CreateDetails from "./DetailWorkFlow";
import LookUpsPage from "../AdminPortal/Lookups/index";
// import Management from "../AdminPortal/assetsManagement";
// import ApprovalWorkFlow from "./workflow/approvalWorkFlow";
// import AddApprovalStep from "./workflow/addApprovalStep";

import React from "react";
import WorkflowType from "./WorkFlowType";
const ApprovalPage = () => {
  return (
    <div style={{ marginTop: "30px" }}>
      <div>
        <WorkflowType />
      </div>
      {/* <div>
        <CreateWorkFlow />
      </div> */}
      {/* <div>
        <CreateDetails />
      </div> */}
      <div>
        {/* <ThemeForm />{" "} */}
      </div>
      <div>
        {/* <AccessLevelPage /> */}
      </div>
      {/* <div>
        <Management />
      </div> */}
      <div>
        {/* <LookUpsPage /> */}
      </div>
    </div>
  );
};

export default ApprovalPage;
