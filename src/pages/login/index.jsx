import { Alert, Button, Form, Input } from 'antd';
import { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'src/hooks';
import { authActions } from 'src/store/actions';
import { yupSync } from 'src/utils';
import * as yup from 'yup';

import * as S from './styles';

const yupSchema = yup.object().shape({
  email: yup.string().required('Please input your email!').email('Please input valid email'),
  password: yup.string().required('Please input your password!'),
});

const antSchema = yupSync(yupSchema);

const Login = () => {
  const dispatch = useDispatch();
  const isAuth = useAuth();
  const waiter = useSelector((state) => state.auth?.waiter);
  const loginError = useSelector((state) => state.auth?.error);

  const onSubmitForm = useCallback(
    (formData) => {
      dispatch(authActions.loginOrSignup(formData));
    },
    [dispatch],
  );

  if (isAuth) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <S.LoginContainer>
      <S.FormWrapper>
        <Form
          name="login"
          size="middle"
          layout="vertical"
          onFinish={onSubmitForm}
          autoComplete="off"
          validateTrigger="onSubmit"
        >
          <Form.Item label="Email" name="email" rules={[antSchema]}>
            <Input />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[antSchema]}>
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={waiter} block>
              Login/Signup
            </Button>
          </Form.Item>
        </Form>
        {loginError && (
          <S.AlertWrapper>
            <Alert message={`Error: ${loginError}`} type="error" />
          </S.AlertWrapper>
        )}
      </S.FormWrapper>
    </S.LoginContainer>
  );
};

export default memo(Login);
