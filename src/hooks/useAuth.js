import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from 'src/store/actions';

const useAuth = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth?.user?.userId);
  const userToken = useSelector((state) => state.auth?.user?.userToken);
  const authExpiry = useSelector((state) => state.auth?.user?.authExpiry);

  if (!!userId && !!userToken && !!authExpiry && dayjs(authExpiry) - dayjs() > 0) {
    return true;
  }

  if (!!authExpiry && dayjs(authExpiry) - dayjs() > 0) {
    dispatch(authActions.logout());
  }

  return false;
};

export default useAuth;
