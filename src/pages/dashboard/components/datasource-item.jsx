import { Button } from 'antd';
import PropTypes from 'prop-types';
import { memo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dataActions } from 'src/store/actions';

import * as S from '../styles';
import DatasourcePopover from './datasource-popover';

const DatasourceItem = ({ datasourceId, name, host, port, db_name, username, password }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth?.user?.userId);
  const userToken = useSelector((state) => state.auth?.user?.userToken);
  const activeDatasource = useSelector((state) => state?.data?.activeDatasource);
  const [isUpdateDatasourcePopover, setUpdateDatasourcePopover] = useState(false);

  const onDatasourceItemClick = useCallback(() => {
    dispatch(dataActions.setActiveDatasource(datasourceId));
  }, [datasourceId, dispatch]);

  const onUpdateDatasourceFinish = useCallback(
    (values) => {
      dispatch(dataActions.updateDatasource({ userId, userToken, datasourceId, formData: values }));
      setUpdateDatasourcePopover(false);
    },
    [datasourceId, dispatch, userId, userToken],
  );

  const onDeleteDatasource = useCallback(() => {
    dispatch(dataActions.deleteDatasource({ userId, userToken, datasourceId }));
  }, [datasourceId, dispatch, userId, userToken]);

  return (
    <S.DatasourceItem
      $align="center"
      $justify="space-between"
      $isSelected={activeDatasource?.id === datasourceId}
      onClick={onDatasourceItemClick}
    >
      <S.DatasourceItemTitle>{name}</S.DatasourceItemTitle>

      <S.DatasourceItemButtons>
        <DatasourcePopover
          formId={`item ${datasourceId}`}
          onSubmit={(value) => onUpdateDatasourceFinish(value)}
          open={isUpdateDatasourcePopover}
          onOpenChange={setUpdateDatasourcePopover}
          initialValues={{
            name,
            host,
            port,
            db_name,
            username,
            password,
          }}
          buttonText="Update"
        >
          <Button>Edit</Button>
        </DatasourcePopover>
        <Button onClick={onDeleteDatasource}>Delete</Button>
      </S.DatasourceItemButtons>
    </S.DatasourceItem>
  );
};

DatasourceItem.propTypes = {
  datasourceId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  host: PropTypes.string.isRequired,
  port: PropTypes.string.isRequired,
  db_name: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

export default memo(DatasourceItem);
