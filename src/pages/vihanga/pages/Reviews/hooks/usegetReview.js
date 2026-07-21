import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { getAllReviewsForm } from 'action/ReviewFormAct'
import { AuthUserId } from 'utilities';
import { getFormByEmployeeId } from 'action/LaunchFormAct';
import { getAdvancedFormByEmployeeId } from 'action/AdvancedLaunchFormAct';

export default function useGetReview() {
  const dispatch = useDispatch();
  const { data = [], error, isLoading } = useQuery(['reviewsForm'], () => dispatch(getAllReviewsForm()), {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60
  });
  return { data, error, isLoading };
}


export function useGetLaunchForms() {
  const dispatch = useDispatch();
  const { data = [], error, isLoading } = useQuery(['reviewsFormForEmployee'], () => dispatch(getFormByEmployeeId(AuthUserId)), {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60
  });

  return { data, error, isLoading };

}


export function useGetAdvancedLaunchForms() {
  const dispatch = useDispatch();
  const { data = [], error, isLoading } = useQuery(['reviewsFormForEmployee'], () => dispatch(getAdvancedFormByEmployeeId(AuthUserId)), {
    refetchOnWindowFocus: false,
    //staleTime: 1000 * 60 * 60
  });

  return { data, error, isLoading };

}