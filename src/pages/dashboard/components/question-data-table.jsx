import { nanoid } from '@reduxjs/toolkit';
import { Table } from 'antd';
import { useSelector } from 'react-redux';

const QuestionDataTable = () => {
  const activeQuestionData = useSelector((state) => state?.data?.activeQuestionData);

  return (
    <>
      {Array.isArray(activeQuestionData) && activeQuestionData?.length > 0 && (
        <Table
          scroll={{ x: 'auto' }}
          dataSource={activeQuestionData?.map((item) => ({ key: nanoid(), ...item }))}
          columns={Object.keys(activeQuestionData[0])?.map((fieldName) => ({
            key: fieldName,
            title: fieldName,
            dataIndex: fieldName,
          }))}
        />
      )}
    </>
  );
};

export default QuestionDataTable;
