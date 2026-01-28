import React, { useEffect } from 'react';
import styled from 'styled-components';

type BaseModalProps = {
  open: boolean;
  onClose: () => void;
  width?: string;
  padding?: string;
  children: React.ReactNode;
};

export function BaseModal({
  open,
  onClose,
  width = '300px',
  padding,
  children,
}: BaseModalProps) {
  // 모달이 열린 상태에서는 스크롤 방지
  useEffect(() => {
    if (!open) return;
    // 모달이 열리면 body의 overflow를 hidden으로 설정
    document.body.style.overflow = 'hidden';
    // 모달이 닫히면 body의 overflow를 원래대로 설정
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  if (!open) return null;

  // 모달 내부를 눌렀을 때 모달이 닫히지 않도록 방지
  const preventOffModal = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    // 모달 외부
    <ModalOverlay onClick={onClose}>
      <ModalContent width={width} padding={padding} onClick={preventOffModal}>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
}

// 모달
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div<{ width: string; padding?: string }>`
  background-color: #fcfcfc;
  border-radius: 10px;
  width: ${(p) => p.width};
  ${(p) => p.padding && `padding: ${p.padding};`}
`;
