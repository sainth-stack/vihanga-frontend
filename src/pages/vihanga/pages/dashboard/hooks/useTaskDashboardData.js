import { useEffect, useState } from 'react';
import { api } from 'service/api';
import { AuthUserId, companyId } from 'utilities';
import { dashboardApi } from 'service/apiVariables';

export const useTaskDashboardData = (type = 'me', filter = 'all') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTaskDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        companyId: companyId,
        type: type,
        userId: AuthUserId,
        filter: filter,
      };

      const response = await api({
        ...dashboardApi.getTaskDashboardData,
        params,
      });

      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message || 'Failed to fetch task dashboard data');
      }
    } catch (err) {
      console.error('Task Dashboard API Error:', err);
      setError(err?.message || 'An error occurred while fetching task dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId && AuthUserId) {
      fetchTaskDashboardData();
    }
  }, [companyId, AuthUserId, type, filter]);

  const refetch = () => {
    fetchTaskDashboardData();
  };

  return { data, loading, error, refetch };
};


