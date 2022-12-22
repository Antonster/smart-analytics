import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffectOnce } from 'src/hooks';
import { dataActions } from 'src/store/actions';

import { DatasourceList, QuestionDataTable, QuestionList } from './components';
import * as S from './styles';

const Dashboard = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth?.user?.userId);
  const userToken = useSelector((state) => state.auth?.user?.userToken);
  const waiter = useSelector((state) => state?.data?.waiter);

  useEffectOnce(() => {
    dispatch(dataActions.getAllUserData({ userId, userToken }));
  });

  useEffect(
    () => () => {
      dispatch(dataActions.setActiveDatasource());
    },
    [dispatch],
  );

  return (
    <Spin spinning={waiter} tip="Loading..." size="large" indicator={<LoadingOutlined spin />}>
      <S.Dashboard>
        <S.DashboardDataNavigation>
          <DatasourceList />
          <QuestionList />
        </S.DashboardDataNavigation>
        <S.DashboardDataTable>
          <QuestionDataTable />
        </S.DashboardDataTable>
      </S.Dashboard>
    </Spin>
  );
};

export default memo(Dashboard);
