import styled from '@emotion/styled';

export default styled.div`
  display: flex;
  flex-direction: ${({ $direction }) => $direction || 'row'};
  flex-wrap: ${({ $wrap }) => $wrap || 'nowrap'};
  justify-content: ${({ $justify }) => $justify || 'flex-start'};
  align-items: ${({ $align }) => $align || 'stretch'};
`;
