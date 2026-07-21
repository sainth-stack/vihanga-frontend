import { getEmployees } from 'action/EmployeeAct'
import { QueryClient, useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { getAllOkrTab } from 'action/OKRTabAct';
import { getObjectivesTabs } from 'action/UserAct';
import { getKeyResultsSingle } from 'action/keyResultAct';
import { getTasks } from 'action/TasksAct';
import { appURL, AuthUserId, cascadeTabs } from 'utilities';
import { getAllNotificationsByUser } from 'action/NotificationAct';
import axios from 'axios';
import { useEffect, useState } from 'react';
const queryClient = new QueryClient();

export default function useGetEmployees() {
  const dispatch = useDispatch();
  const { data = [], error, isLoading } = useQuery(['employees'], () => dispatch(getEmployees()), {
    refetchOnWindowFocus: false,
    cacheTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 60
  });
  return { data, error, isLoading };
}

export const removeQueries = () => {
  queryClient.invalidateQueries('employees');
}
export function useGetTasks() {
  const dispatch = useDispatch();
  const { data = [], error, isLoading } = useQuery(['tasks'], () => dispatch(getTasks()), {
    refetchOnWindowFocus: false,
  });
  return { data, error, isLoading };
}
export function useGetThresholds() {
  const dispatch = useDispatch();
  const { data = [], error, isLoading } = useQuery(['thresholds'], () => dispatch(getAllOkrTab()), {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });
  return { data, error, isLoading };
}

export function useGetObjectives({ userId, companyId, type = "me", empId, okrYear }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  let user = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null;

  const fetchObjectives = async () => {
    if (!userId || !companyId) return;

    // Avoid premature calls for team/function/company until empId is available ("all" or specific id)
    if ((type === 'myteam' || type === 'myfunction' || type === 'mycompany') && (!empId || empId === '')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = user?.token || localStorage.getItem('authToken'); // Adjust based on how you store the token

      const params = {
        userId: userId,
        companyId: companyId,
        type: type,
        empId: empId,
      };
      if (okrYear && okrYear.toString().trim() !== '') {
        params.okrYear = okrYear.toString().trim();
      }

      const response = await axios.get(`${appURL}/objectives/getCompanyObjectives`, {
        params,
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Authorization': `Bearer ${token}`,
          'Connection': 'keep-alive',
          'Origin': 'http://localhost:4300',
          'Referer': 'http://localhost:4300/',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
          'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"'
        }
      });
      
      setData(response.data);
    } catch (err) {
      console.error('Error fetching objectives:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    fetchObjectives();
  };

  useEffect(() => {
    fetchObjectives();
  }, [userId, companyId, type, empId, okrYear]);

  return { data, error, isLoading, refetch };
}

export function useGetKeyResultsSingle() {
  const dispatch = useDispatch();
  let userData = localStorage.getItem("userData") !== null ? JSON.parse(localStorage.getItem("userData")) : null;
  const { data = [], error, isLoading } = useQuery(['keyresults'], () => dispatch(getKeyResultsSingle(userData.ownerId)), {
    refetchOnWindowFocus: false,
  });
  return { data, error, isLoading };
}


export function useGetNotifications() {
  const dispatch = useDispatch();
  const { data = [], error, isLoading } = useQuery(['notifications'], () => dispatch(getAllNotificationsByUser(AuthUserId)), {
    refetchOnWindowFocus: false,
  });
  return { data, error, isLoading };
}