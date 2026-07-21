import { api } from "./api";

// Create time tracking entry
export const createTimeTrackingEntry = async (data) => {
  console.log("time data create",data)
  try {
    const queryParams = new URLSearchParams({
      companyId: data.companyId,
      userId: data.userId
    }).toString();
    
    const response = await api({
      method: "post",
      api: `recruitment/time-tracking?${queryParams}`,
      body: data,
      status: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get all time tracking entries
export const getAllTimeTrackingEntries = async (params) => {
  console.log("time tracking params",params)
  try {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api({
      method: "get",
      api: `recruitment/time-tracking?${queryParams}`,
      status: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get time tracking entry by ID
export const getTimeTrackingById = async (id, currentUserId) => {
  try {
    const response = await api({
      method: "get",
      api: `recruitment/time-tracking/entry/?id=${id}&currentUserId=${currentUserId}`,
      status: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update time tracking entry
export const updateTimeTrackingEntry = async (data) => {
  try {
    console.log("time clockeout data", data)
    const queryParams = new URLSearchParams({
      companyId: data.companyId,
      userId: data.userId,
      timeEntryId: data.timeEntryId
    }).toString();
    
    const response = await api({
      method: "put",
      api: `recruitment/time-tracking/update?${queryParams}`,
      body: data,
      status: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Approve or reject time tracking entry
export const approveTimeTrackingEntry = async (data) => {
  try {
    const queryParams = new URLSearchParams({
      id: data.id
    }).toString();
    
    const response = await api({
      method: "post",
      api: `recruitment/time-tracking/approve?${queryParams}`,
      body: {
        approverId: data.approverId,
        action: data.action,
        comments: data.comments,
        rejectionReason: data.rejectionReason
      },
      status: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get pending approvals for current user
export const getPendingApprovals = async (currentUserId, companyId) => {
  try {
    const response = await api({
      method: "get",
      api: `recruitment/time-tracking/pending-approvals?currentUserId=${currentUserId}&companyId=${companyId}`,
      status: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get approval dashboard data
export const getApprovalDashboard = async (currentUserId, companyId) => {
  try {
    const response = await api({
      method: "get",
      api: `recruitment/time-tracking/approval-dashboard?currentUserId=${currentUserId}&companyId=${companyId}`,
      status: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete time tracking entry
export const deleteTimeTrackingEntry = async ({ id, currentUserId, companyId, type }) => {
  try {
    const params = new URLSearchParams({
      id,
      currentUserId,
      companyId,
      type: type || 'me'
    }).toString();
    const response = await api({
      method: "delete",
      api: `recruitment/time-tracking/delete?${params}`,
      status: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
}; 