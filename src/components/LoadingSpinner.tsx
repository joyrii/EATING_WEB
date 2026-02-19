import styled from 'styled-components';

export default function LoadingSpinner() {
  return (
    <LoadingWrapper>
      <Spinner />
    </LoadingWrapper>
  );
}

// loading spinner
const LoadingWrapper = styled.div`
  min-height: 100vh;
  background-color: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  width: 36px;
  height: 36px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #ff5900;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
