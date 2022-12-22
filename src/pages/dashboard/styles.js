import styled from '@emotion/styled';
import { ContentContainer, FlexContainer } from 'src/styles';

export const Dashboard = styled(ContentContainer)`
  padding: 24px;
`;

export const DashboardDataNavigation = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 0 0 24px;
`;

export const DashboardDataTable = styled.div`
  margin: 0 0 24px;
`;

export const DatasourceList = styled(FlexContainer)``;

export const DatasourceListWrapper = styled(FlexContainer)`
  width: 400px;
`;

export const DatasourceItem = styled(FlexContainer)`
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.3s;
  background: ${({ $isSelected }) => ($isSelected ? '#e6f7ff' : '#ffffff')};
  color: ${({ $isSelected }) => ($isSelected ? '#1890ff' : '')};
  border-right: ${({ $isSelected }) => ($isSelected ? '3px solid #1890ff' : '3px solid #ffffff')};

  &:hover {
    color: #1890ff;
  }
`;

export const DatasourceItemTitle = styled.div`
  margin: 0 12px 0 0;
`;

export const DatasourceItemButtons = styled.div``;

export const QuestionList = styled(FlexContainer)`
  min-width: 400px;
`;

export const QuestionHiddenBuilder = styled.div`
  display: none;
`;

export const QuestionDetails = styled(FlexContainer)``;

export const QuestionOperationDetails = styled(FlexContainer)`
  margin: 6px;
`;

export const QuestionOperationCollection = styled(FlexContainer)``;
