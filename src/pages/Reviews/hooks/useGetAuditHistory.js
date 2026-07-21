import { useQuery } from '@tanstack/react-query';
import { getAuditHistory, getPrediction } from 'action/TasksAct';
import { useDispatch } from 'react-redux';

export default function useGetAuditHistory(id) {
  const dispatch = useDispatch();
  const { data = [], error, isLoading, isError } = useQuery(['audithistory'], () => dispatch(getAuditHistory(id)), {
    refetchOnWindowFocus: false,
  });
  return { data: data.data, error, isError, isLoading };
}

export function useGetPrediction(requestBody) {
  const dispatch = useDispatch();
  const { data = [], error, isLoading, isError } = useQuery(['prediction'], () => dispatch(getPrediction(requestBody)), {
    refetchOnWindowFocus: false,
  });
  return { data: data, error, isError, isLoading };
}