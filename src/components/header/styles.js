import styled from '@emotion/styled';
import { FlexContainer } from 'src/styles';

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 64px;
  padding: 0 24px;
  background: #001529;
`;

export const NavContainer = styled(FlexContainer)`
  & > a:not(:last-child) {
    margin: 0 24px 0 0;
  }
`;
