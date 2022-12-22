import { Button, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dataActions } from 'src/store/actions';

import * as S from '../styles';
import DatasourceItem from './datasource-item';
import DatasourcePopover from './datasource-popover';

const DatasourceList = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth?.user?.userId);
  const userToken = useSelector((state) => state.auth?.user?.userToken);
  const datasourceList = useSelector((state) => state?.data?.datasourceList);
  const error = useSelector((state) => state?.data?.error);
  const [isNewDatasourcePopover, setNewDatasourcePopover] = useState(false);

  const onCreateDatasourceFinish = useCallback(
    (values) => {
      dispatch(dataActions.createDatasource({ userId, userToken, formData: values }));
      setNewDatasourcePopover(false);
    },
    [dispatch, userId, userToken],
  );

  useEffect(() => {
    if (error) message.error(`Error: ${error}`);
  }, [error]);

  return (
    <S.DatasourceList $direction="column">
      <DatasourcePopover
        formId="Add_datasource"
        onSubmit={onCreateDatasourceFinish}
        resetAfterSubmit
        open={isNewDatasourcePopover}
        onOpenChange={setNewDatasourcePopover}
        buttonText="Create"
      >
        <Button type="dashed">Add datasource</Button>
      </DatasourcePopover>

      <S.DatasourceListWrapper $direction="column">
        {datasourceList?.map(({ id, name, host, port, db_name, username, password }) => (
          <DatasourceItem
            key={id}
            datasourceId={id}
            name={name}
            host={host}
            port={port}
            db_name={db_name}
            username={username}
            password={password}
          />
        ))}
      </S.DatasourceListWrapper>
    </S.DatasourceList>
  );
};

export default DatasourceList;
