import { useState, useEffect } from 'react';
import { api } from 'service/api';
import { AuthUserId, companyId } from 'utilities';
import { dashboardApi } from 'service/apiVariables';

export const useBirthdayData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBirthdayData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        companyId: companyId,
        type: "me",
        userId: AuthUserId
      };

      const response = await api({
        ...dashboardApi.getDashboardData,
        params
      });

      if (response.success) {
        // Extract birthdays and anniversaries from dashboard data
        const dashboardData = response.data;
        const transformedData = {
          birthdays: dashboardData.birthdays || [],
          anniversaries: dashboardData.anniversaries || []
        };
        
        setData(transformedData);
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
      fetchBirthdayData();
    }
  }, [companyId, AuthUserId]);

  const refetch = () => {
    fetchBirthdayData();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
}; 