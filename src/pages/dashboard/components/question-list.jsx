import { DeleteTwoTone } from '@ant-design/icons';
import { nanoid } from '@reduxjs/toolkit';
import { QueryBuilderComponent } from '@syncfusion/ej2-react-querybuilder';
import { Collapse } from 'antd';
import { memo, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dataActions } from 'src/store/actions';

import * as S from '../styles';
import QuestionOperationNode from './question-operation-node';
import QuestionPopover from './question-popover';

const QuestionList = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth?.user?.userId);
  const userToken = useSelector((state) => state.auth?.user?.userToken);
  const [isNewQuestionPopover, setNewQuestionPopover] = useState(false);
  const [booleanQueryInstance, setBooleanQueryInstance] = useState(null);
  const questionList = useSelector((state) => state?.data?.questionList);
  const activeDatasource = useSelector((state) => state?.data?.activeDatasource);

  const activeQuestions = useMemo(
    () => questionList?.filter((question) => question.datasource_id === activeDatasource?.id),
    [activeDatasource, questionList],
  );

  const onCollapseChange = useCallback(
    (questionId) => {
      const selectedQuestion = questionList.find((question) => +question.id === +questionId);

      if (!selectedQuestion) {
        dispatch(dataActions.setQuestionData([]));
      }
    },
    [dispatch, questionList],
  );

  const onCreateQuestion = useCallback(
    (formData) => {
      dispatch(
        dataActions.createQuestion({
          userId,
          userToken,
          datasourceId: activeDatasource?.id,
          formData: { ...formData, nodes: [{ operation: '', collection: '' }] },
        }),
      );
      setNewQuestionPopover(false);
    },
    [activeDatasource, dispatch, userId, userToken],
  );

  const onDeleteQuestion = useCallback(
    (questionId) => {
      dispatch(
        dataActions.deleteQuestion({
          userId,
          userToken,
          datasourceId: activeDatasource?.id,
          questionId,
        }),
      );
    },
    [activeDatasource, dispatch, userId, userToken],
  );

  const onQueryBuilderCreated = useCallback(function () {
    setBooleanQueryInstance(this);
  }, []);

  return (
    <S.QuestionList $direction="column">
      {!booleanQueryInstance && (
        <S.QuestionHiddenBuilder>
          <QueryBuilderComponent created={onQueryBuilderCreated} />
        </S.QuestionHiddenBuilder>
      )}

      <QuestionPopover
        formId="Add_question"
        buttonText="Create"
        open={isNewQuestionPopover}
        onOpenChange={setNewQuestionPopover}
        resetAfterSubmit
        onSubmit={onCreateQuestion}
      />

      {activeQuestions?.length > 0 && (
        <Collapse
          accordion
          destroyInactivePanel
          style={{ width: '100%' }}
          onChange={onCollapseChange}
        >
          {activeQuestions.map((question) => (
            <Collapse.Panel
              key={question.id}
              header={question.name}
              extra={
                <DeleteTwoTone
                  twoToneColor="#eb2f96"
                  onClick={() => onDeleteQuestion(question.id)}
                />
              }
            >
              <S.QuestionDetails $wrap="wrap">
                {question?.nodes?.map((operationNode, nodeIndex) => (
                  <QuestionOperationNode
                    key={nanoid()}
                    booleanQueryInstance={booleanQueryInstance}
                    question={question}
                    operationNode={operationNode}
                    nodeIndex={nodeIndex}
                  />
                ))}
              </S.QuestionDetails>
            </Collapse.Panel>
          ))}
        </Collapse>
      )}
    </S.QuestionList>
  );
};

export default memo(QuestionList);
