import { useState, useEffect } from 'react';
import { api } from 'service/api';
import { AuthUserId, companyId } from 'utilities';
import { dashboardApi } from 'service/apiVariables';


export const useDashboardData = (type = "me") => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        companyId: companyId,
        type: type,
        userId: AuthUserId
      };

      const response = await api({
        ...dashboardApi.getDashboardData,
        params
      });

      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Dashboard API Error:', err);
      setError(err?.message || 'An error occurred while fetching dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId && AuthUserId) {
      fetchDashboardData();
    }
  }, [companyId, AuthUserId, type]);

  const refetch = () => {
    fetchDashboardData();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};
