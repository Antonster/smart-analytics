import styled from '@emotion/styled';
import { ContentContainer } from 'src/styles';

export const LoginContainer = styled(ContentContainer)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

export const FormWrapper = styled.div`
  width: 300px;
  position: relative;

  @media (max-width: 574px) {
    width: 100%;
  }
`;

export const AlertWrapper = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  top: 100%;
`;
