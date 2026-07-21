import React from 'react'
import { useDispatch } from 'react-redux';
import { updateNotificationGoal } from 'action/NotificationAct';
import { AuthLineManager, AuthOwnerId, AuthRole, AuthUserId } from 'utilities';
import { useQueryClient } from "@tanstack/react-query";

export default function ApproveRejectComponent({ row, privileges, companyInfo, totalWeight = 0, forwardedRef3 }) {
  const dispatch = useDispatch();
  const lineManagerCondition = AuthLineManager === "" || row.employeeReferenceId !== AuthUserId;
  const queryClient = useQueryClient();
  return (
    <div ref={row.id === 1 ? forwardedRef3 : null}>
      {lineManagerCondition && row.objectiveStatus === "Submit" && privileges && privileges.length > 0 && (privileges.filter(privilege => privilege.page === "Lock Objectives").length > 0 && privileges.filter(privilege => privilege.page === "Lock Objectives")[0].view && privileges.filter(privilege => privilege.page === "Approve Objectives").length > 0 && privileges.filter(privilege => privilege.page === "Approve Objectives")[0].view) && <span className='m-2 cursor-pointer' onClick={() => {
        const objectiveStatus = { objectiveStatus: "Approve", row, companyInfo }
        dispatch(updateNotificationGoal(row._id, objectiveStatus));
        setTimeout(() => {
          queryClient.invalidateQueries("goals", "objectives", "keyresults", "tasks");
        }, 500);
      }}>
        <i className='fa fa-check-circle text-success fs-14' title="Approve" />
      </span>}

      {lineManagerCondition && row.objectiveStatus === "Submit" && privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Reject Objectives").length > 0 && privileges.filter(privilege => privilege.page === "Reject Objectives")[0].view && <span className='m-2 cursor-pointer' onClick={() => {
        const objectiveStatus = { objectiveStatus: "Reject", row, companyInfo }
        dispatch(updateNotificationGoal(row._id, objectiveStatus));
        setTimeout(() => {
          queryClient.invalidateQueries("goals", "objectives", "keyresults", "tasks");
        }, 500);
      }}>
        <i className='fa fa-times-circle text-danger fs-14' title="Reject" />
      </span>}

      {row.employeeReferenceId !== AuthOwnerId && AuthRole !== "Employee" && row.objectiveStatus === "Approve" && privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Unlock Objectives").length > 0 && privileges.filter(privilege => privilege.page === "Unlock Objectives")[0].view && <div className='m-2 cursor-pointer' onClick={() => {
        const objectiveStatus = { objectiveStatus: "Unlock", row, companyInfo }
        dispatch(updateNotificationGoal(row._id, objectiveStatus));
        setTimeout(() => {
          queryClient.invalidateQueries("goals", "objectives", "keyresults", "tasks");
        }, 500);
      }}>
        <i className='fa fa-unlock text-danger fs-14' /> Unlock
      </div>}

      {(row.objectiveStatus === "Create" || row.objectiveStatus === "Update" || row.objectiveStatus === "Reject" || row.objectiveStatus === "Unlock") && Number(totalWeight).toFixed(0) === "100" && privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Lock Objectives").length > 0 && privileges.filter(privilege => privilege.page === "Lock Objectives")[0].view && <div className='m-2 cursor-pointer' onClick={() => {
        const objectiveStatus = { objectiveStatus: "Submit", row, companyInfo }
        dispatch(updateNotificationGoal(row._id, objectiveStatus));
        setTimeout(() => {
          queryClient.invalidateQueries("goals", "objectives", "keyresults", "tasks");
        }, 500);
      }}>
        <i className='fa fa-send text-primary fs-14' title="Submit" /> Submit
      </div>}
      {(row.employeeReferenceId === AuthUserId && row.objectiveStatus === "Submit") && privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Lock Objectives").length > 0 && privileges.filter(privilege => privilege.page === "Lock Objectives")[0].view && <div className='m-2 '
      >
        Submitted
      </div>}
    </div>
  )
}
