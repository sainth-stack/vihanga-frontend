import { getEmployees } from 'action/EmployeeAct'
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { getAllOkrTab } from 'action/OKRTabAct';
import { getObjectives } from 'action/UserAct';
import { getObjectives as getGoals } from 'action/GoalsAct';
import { getKeyResultsSingle } from 'action/keyResultAct';
import { getTasks } from 'action/TasksAct';
import { AuthUserId } from 'utilities';
import { getAllNotificationsByUser } from 'action/NotificationAct';

export default function useGetEmployees() {
  const dispatch = useDispatch();
  const { data = [], error, isLoading } = useQuery(['employees'], () => dispatch(getEmployees()), {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60
  });
  return { data, error, isLoading };
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


export function useGetObjectives(role, id) {
  const dispatch = useDispatch();
  const { data = [], error, isLoading } = useQuery(['objectives',id], () => dispatch(getObjectives(role, id)), {
    refetchOnWindowFocus: false,
  });
  return { data, error, isLoading };
}
export function useGetGoals() {
  const dispatch = useDispatch();
  let user = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null;
  let userData = localStorage.getItem("userData") !== null ? JSON.parse(localStorage.getItem("userData")) : null;
  const { data = [], error, isLoading } = useQuery(['goals'], () => dispatch(getGoals(user.role, userData.ownerId)), {
    refetchOnWindowFocus: false,
  });
  return { data, error, isLoading };
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