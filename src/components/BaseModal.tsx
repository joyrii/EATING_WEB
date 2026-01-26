import React, { useEffect } from 'react';
import { ModalContent, ModalOverlay } from './style';

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
