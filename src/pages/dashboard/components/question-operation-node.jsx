import { QueryBuilderComponent } from '@syncfusion/ej2-react-querybuilder';
import { Button, Popover, Select, Typography } from 'antd';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { questionOperationsRequireField, questionOperationValues } from 'src/constants';
import { dataActions } from 'src/store/actions';
import { calculateSQLQuery, PGTypeMapper } from 'src/utils';

import * as S from '../styles';

const QuestionOperationNode = ({
  booleanQueryInstance,
  question,
  question: { nodes: nodeList },
  operationNode: { booleanQuery, db_table, operation, selectedField, visibleColumns, collection },
  nodeIndex,
}) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth?.user?.userId);
  const userToken = useSelector((state) => state.auth?.user?.userToken);
  const activeDatasource = useSelector((state) => state?.data?.activeDatasource);
  const [validOperations, setValidOperations] = useState([]);
  const [validCollections, setValidCollections] = useState([]);
  const [booleanQueryRules, setBooleanQueryRules] = useState('');
  const [isFilterPopover, setFilterPopover] = useState(false);

  const requiresField = useMemo(
    () => questionOperationsRequireField.includes(operation),
    [operation],
  );

  const previousCollections = useMemo(
    () =>
      nodeList
        .filter((node) => node.operation === 'list of')
        .map((node) => node.collection)
        .filter((coll) => coll !== ''),
    [nodeList],
  );

  const prevNode = useMemo(() => nodeList[nodeIndex - 1], [nodeIndex, nodeList]);

  const collectionName = useMemo(() => {
    const nodeToUse = nodeIndex === 0 ? nodeList[nodeIndex] : prevNode;

    return nodeToUse.collection;
  }, [nodeIndex, nodeList, prevNode]);

  const onlyRelatedCollections = useMemo(() => {
    const outboundRelationships = collectionName
      ? activeDatasource.schema[collectionName].outbound_relationships || []
      : [];

    const inboundRelationships = collectionName
      ? activeDatasource.schema[collectionName].inbound_relationships || []
      : [];

    return collectionName ? [...inboundRelationships, ...outboundRelationships] : [];
  }, [activeDatasource, collectionName]);

  const onlyDirectFields = useMemo(
    () => (collectionName && collection ? activeDatasource.schema[collection].direct_fields : []),
    [activeDatasource, collection, collectionName],
  );

  const onQueryBuilderChange = useCallback(function () {
    // Save the instance so we can use it to convert the rules to SQL
    // Doesn't matter which one we just need the getSqlFromRules method

    // eslint-disable-next-line react/no-this-in-sfc
    setBooleanQueryRules(this.getRules());
  }, []);

  const onOperationChange = useCallback(
    (newOperation) => {
      const newNodeList = [
        ...nodeList.slice(0, nodeIndex),
        { operation: newOperation, selectedField: '', collection: '' },
      ];

      const updatedQuestion = { ...question, nodes: newNodeList };

      dispatch(
        dataActions.updateQuestion({
          userId,
          userToken,
          datasourceId: activeDatasource.id,
          questionId: question.id,
          formData: updatedQuestion,
        }),
      );
    },
    [activeDatasource, dispatch, nodeIndex, nodeList, question, userId, userToken],
  );

  const onCollectionChange = useCallback(
    (newCollection) => {
      const newNodeList = [
        ...nodeList.slice(0, nodeIndex),
        {
          operation,
          selectedField: '',
          collection: newCollection,
        },
      ];

      // If the user selected an option and the operation does not require a field create a new empty node at the end of the list
      // otherwise set the next item's collection to the current one and make the field dropdown visible
      if (newCollection && !requiresField) {
        newNodeList.push({
          operation: '',
          selectedField: '',
          collection: '',
        });
      }

      const updatedQuestion = { ...question, nodes: newNodeList };

      dispatch(
        dataActions.updateQuestion({
          userId,
          userToken,
          datasourceId: activeDatasource.id,
          questionId: question.id,
          formData: updatedQuestion,
        }),
      );
    },
    [
      activeDatasource,
      dispatch,
      nodeIndex,
      nodeList,
      operation,
      question,
      requiresField,
      userId,
      userToken,
    ],
  );

  const onCollectionFieldsChange = useCallback(
    (newCollectionFields) => {
      const newNodeList = [
        ...nodeList.slice(0, nodeIndex),
        {
          operation,
          selectedField,
          collection,
          visibleColumns: newCollectionFields,
          booleanQuery,
        },
        ...nodeList.slice(nodeIndex + 1, nodeList.length),
      ];

      const updatedQuestion = { ...question, nodes: newNodeList };

      dispatch(
        dataActions.updateQuestion({
          userId,
          userToken,
          datasourceId: activeDatasource.id,
          questionId: question.id,
          formData: updatedQuestion,
        }),
      );
    },
    [
      activeDatasource,
      booleanQuery,
      collection,
      dispatch,
      nodeIndex,
      nodeList,
      operation,
      question,
      selectedField,
      userId,
      userToken,
    ],
  );

  const onFieldChange = useCallback(
    (newField) => {
      const newNodeList = [
        ...nodeList.slice(0, nodeIndex),
        {
          booleanQuery,
          operation,
          db_table,
          selectedField: newField,
          collection,
        },
      ];

      // if the current operation allows further operations (e.g. top 10) add an empty node at the end
      if (newField && ['top 10 by'].includes(operation)) {
        newNodeList.push({
          operation: '',
          selectedField: '',
          collection: '',
        });
      }

      const updatedQuestion = { ...question, nodes: newNodeList };

      dispatch(
        dataActions.updateQuestion({
          userId,
          userToken,
          datasourceId: activeDatasource.id,
          questionId: question.id,
          formData: updatedQuestion,
        }),
      );
    },
    [
      activeDatasource,
      booleanQuery,
      collection,
      db_table,
      dispatch,
      nodeIndex,
      nodeList,
      operation,
      question,
      userId,
      userToken,
    ],
  );

  const onFilterPopoverChange = useCallback(() => {
    // if hiding, save the rules if not empty
    if (isFilterPopover && booleanQueryRules !== '') {
      const newNodeList = [
        ...nodeList.slice(0, nodeIndex),
        {
          booleanQuery: booleanQueryRules,
          operation,
          selectedField,
          db_table,
          collection,
          visibleColumns,
        },
        ...nodeList.slice(nodeIndex + 1, nodeList.length),
      ];

      const updatedQuestion = { ...question, nodes: newNodeList };

      dispatch(
        dataActions.updateQuestion({
          userId,
          userToken,
          datasourceId: activeDatasource.id,
          questionId: question.id,
          formData: updatedQuestion,
        }),
      );
    }

    setFilterPopover((current) => !current);
  }, [
    activeDatasource,
    booleanQueryRules,
    collection,
    db_table,
    dispatch,
    isFilterPopover,
    nodeIndex,
    nodeList,
    operation,
    question,
    selectedField,
    userId,
    userToken,
    visibleColumns,
  ]);

  const onAggregationChange = useCallback(
    (newAggregation) => {
      const newNodeList = [
        ...nodeList.slice(0, nodeIndex),
        {
          operation,
          selectedField,
          collection,
          visibleColumns,
          booleanQuery,
          groupByAggregations: newAggregation,
        },
        ...nodeList.slice(nodeIndex + 1, nodeList.length),
      ];

      const updatedQuestion = { ...question, nodes: newNodeList };

      dispatch(
        dataActions.updateQuestion({
          userId,
          userToken,
          datasourceId: activeDatasource.id,
          questionId: question.id,
          formData: updatedQuestion,
        }),
      );
    },
    [
      activeDatasource,
      booleanQuery,
      collection,
      dispatch,
      nodeIndex,
      nodeList,
      operation,
      question,
      selectedField,
      userId,
      userToken,
      visibleColumns,
    ],
  );

  const getCollectionsAndFieldsAllowedForOperation = useCallback(
    (currentOperation) => {
      switch (currentOperation) {
        case 'list of':
          return onlyRelatedCollections.map((elatedCollection) => Object.keys(elatedCollection)[0]);
        case 'number of(unique)':
        case 'total':
        case 'min':
        case 'max':
        case 'average':
        case 'group by':
        case 'top 10 by':
          return previousCollections;
        default:
          return [];
      }
    },
    [onlyRelatedCollections, previousCollections],
  );

  useEffect(() => {
    if (nodeIndex === 0) {
      setValidOperations(
        questionOperationValues.filter((validOperation) => validOperation !== 'group by'),
      );
      setValidCollections(Object.keys(activeDatasource.schema));
    } else {
      switch (prevNode.operation) {
        case 'list of':
          setValidOperations(questionOperationValues);
          break;
        case 'number of(unique)':
        case 'average':
        case 'max':
        case 'min':
        case 'group by':
        case 'top n by':
          setValidOperations([]);
          break;
        default:
          setValidOperations([]);
      }

      const newValidCollections = getCollectionsAndFieldsAllowedForOperation(operation);

      setValidCollections(newValidCollections);
    }
  }, [activeDatasource, collection, nodeIndex, operation]);

  useEffect(() => {
    const localCalculatedQuery = calculateSQLQuery(
      booleanQueryInstance,
      question,
      activeDatasource,
    );

    dispatch(
      dataActions.getQuestionData({
        userId,
        userToken,
        datasourceId: activeDatasource.id,
        questionId: question.id,
        formData: { question: { sql: localCalculatedQuery } },
      }),
    );
  }, [activeDatasource, booleanQueryInstance, dispatch, question, userId, userToken]);

  return (
    <S.QuestionOperationDetails $direction="column">
      <S.QuestionOperationCollection $direction="column">
        {(nodeIndex === 0 || prevNode.collection || prevNode.selectedField) && (
          <Select
            id={`operation-${nodeIndex}`}
            onChange={onOperationChange}
            allowClear
            defaultActiveFirstOption={false}
            style={{ width: 220 }}
            defaultValue={nodeList[nodeIndex].operation}
          >
            {validOperations.map((name) => (
              <Select.Option key={`${name}-${nodeIndex}`} value={name}>
                {nodeIndex > 0 ? (name !== 'group by' ? 'and their ' : '') + name : name}
              </Select.Option>
            ))}
          </Select>
        )}

        {nodeList[nodeIndex].operation && (
          <Select
            id={`collection-${nodeIndex}`}
            defaultValue={nodeList[nodeIndex].collection}
            onChange={onCollectionChange}
            style={{ width: 220 }}
            allowClear
          >
            {validCollections.map((collName) => (
              <Select.Option key={`${collName}-${nodeIndex}`} value={collName}>
                {collName}
              </Select.Option>
            ))}
          </Select>
        )}

        {nodeList[nodeIndex].collection && operation === 'list of' && (
          <Select
            mode="multiple"
            placeholder="ALL fields (or select)"
            id={nodeIndex}
            value={nodeList[nodeIndex].visibleColumns}
            onChange={onCollectionFieldsChange}
            style={{ width: 220 }}
          >
            {onlyDirectFields.map((fieldEntry) => {
              const fieldName = Object.keys(fieldEntry)[0];
              return (
                <Select.Option key={fieldName} value={fieldName}>
                  {fieldName}
                </Select.Option>
              );
            })}
          </Select>
        )}

        {requiresField && nodeList[nodeIndex].operation && nodeList[nodeIndex].collection && (
          <Select
            id="somethingsome"
            value={nodeList[nodeIndex].selectedField}
            onChange={onFieldChange}
            style={{ width: 220 }}
            allowClear
          >
            {onlyDirectFields.map((fieldEntry) => {
              const fieldName = Object.keys(fieldEntry)[0];
              return (
                <Select.Option key={fieldName} value={fieldName}>
                  {fieldName}
                </Select.Option>
              );
            })}
          </Select>
        )}

        {nodeList[nodeIndex].collection && nodeList[nodeIndex].operation !== 'group by' && (
          <Popover
            content={
              <QueryBuilderComponent
                rule={nodeList[nodeIndex].booleanQuery}
                change={onQueryBuilderChange}
                width="100%"
                columns={onlyDirectFields.map((fieldEntry) => ({
                  field: `/|\\${collection}/|\\./|\\${Object.keys(fieldEntry)[0]}/|\\`,
                  label: Object.keys(fieldEntry)[0],
                  type: PGTypeMapper(Object.values(fieldEntry)[0]),
                }))}
              />
            }
            trigger="click"
            placement="bottom"
            open={isFilterPopover}
          >
            <Button type="secondary" onClick={onFilterPopoverChange}>
              {`Filters (${
                booleanQueryInstance.getSqlFromRules(nodeList[nodeIndex].booleanQuery) ? '...' : ''
              })`}
            </Button>
          </Popover>
        )}

        {requiresField &&
          nodeList[nodeIndex].operation &&
          nodeList[nodeIndex].operation === 'group by' &&
          nodeList[nodeIndex].collection && (
            <>
              <Typography.Text>For each group calculate</Typography.Text>
              <Select
                mode="multiple"
                placeholder="Select fields to aggregate"
                id={nodeIndex}
                value={nodeList[nodeIndex].groupByAggregations}
                onChange={onAggregationChange}
                style={{ minWidth: 220, maxWidth: 450 }}
                allowClear
              >
                {['SUM', 'AVG', 'COUNT'].map((op) =>
                  previousCollections.map((collName) => {
                    const directFieldsForCollection = activeDatasource.schema[
                      collName
                    ].direct_fields.filter((fieldEntry) => {
                      const fieldType = Object.values(fieldEntry)[0];

                      return PGTypeMapper(fieldType) === 'number';
                    });

                    return directFieldsForCollection.map((fieldEntry) => {
                      const fieldName = Object.keys(fieldEntry)[0];

                      return (
                        <Select.Option
                          key={op + collName + fieldName}
                          value={`${op}("${collName}"."${fieldName}")`}
                        >
                          {`${op}("${collName}"."${fieldName}")`}
                        </Select.Option>
                      );
                    });
                  }),
                )}
              </Select>
            </>
          )}
      </S.QuestionOperationCollection>
    </S.QuestionOperationDetails>
  );
};

QuestionOperationNode.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  booleanQueryInstance: PropTypes.object.isRequired,
  question: PropTypes.shape({
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
    datasource_id: PropTypes.number,
    id: PropTypes.number,
    name: PropTypes.string,
    nodes: PropTypes.arrayOf(
      PropTypes.shape({
        booleanQuery: PropTypes.shape({
          condition: PropTypes.string,
          rules: PropTypes.arrayOf(
            PropTypes.shape({
              field: PropTypes.string,
              label: PropTypes.string,
              operator: PropTypes.string,
              type: PropTypes.string,
              value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
              condition: PropTypes.string,
              rules: PropTypes.arrayOf(
                PropTypes.shape({
                  field: PropTypes.string,
                  label: PropTypes.string,
                  operator: PropTypes.string,
                  type: PropTypes.string,
                  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
                }),
              ),
            }),
          ),
        }),
        collection: PropTypes.string,
        operation: PropTypes.string,
        selectedField: PropTypes.string,
        visibleColumns: PropTypes.arrayOf(PropTypes.string),
        groupByAggregations: PropTypes.string,
      }),
    ),
  }).isRequired,
  operationNode: PropTypes.shape({
    booleanQuery: PropTypes.shape({
      condition: PropTypes.string,
      rules: PropTypes.arrayOf(
        PropTypes.shape({
          field: PropTypes.string,
          label: PropTypes.string,
          operator: PropTypes.string,
          type: PropTypes.string,
          value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
          condition: PropTypes.string,
          rules: PropTypes.arrayOf(
            PropTypes.shape({
              field: PropTypes.string,
              label: PropTypes.string,
              operator: PropTypes.string,
              type: PropTypes.string,
              value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
            }),
          ),
        }),
      ),
    }),
    collection: PropTypes.string,
    operation: PropTypes.string,
    selectedField: PropTypes.string,
    visibleColumns: PropTypes.arrayOf(PropTypes.string),
    groupByAggregations: PropTypes.string,
    db_table: PropTypes.string, // string?
  }).isRequired,
  nodeIndex: PropTypes.number.isRequired,
};

export default QuestionOperationNode;
