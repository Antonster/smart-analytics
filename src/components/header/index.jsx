import { Button } from 'antd';
import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAuth } from 'src/hooks';
import { authActions } from 'src/store/actions';

import * as S from './styles';

const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useAuth();

  const onLogout = () => {
    dispatch(authActions.logout());
  };

  return (
    <S.Header>
      <S.NavContainer>
        <Link to="/">
          <Button>Home</Button>
        </Link>
        {isAuth && (
          <Link to="/dashboard">
            <Button>Dashboard</Button>
          </Link>
        )}
      </S.NavContainer>

      {isAuth ? (
        <Button onClick={onLogout}>Logout</Button>
      ) : (
        <Link to="/login">
          <Button>Login/Sign up</Button>
        </Link>
      )}
    </S.Header>
  );
};

export default memo(Header);
