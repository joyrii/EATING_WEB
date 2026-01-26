import React, { useEffect } from "react";
import { ModalContent, ModalOverlay } from "./style";

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
  width = "300px",
  padding,
  children,
}: BaseModalProps) {
  // 모달 내부를 눌렀을 때 모달이 닫히지 않도록 방지
  const preventOffModal = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // 모달이 열린 상태에서는 스크롤 방지
  useEffect(() => {
    // 모달이 열리면 body의 overflow를 hidden으로 설정
    document.body.style.overflow = "hidden";
    // 모달이 닫히면 body의 overflow를 원래대로 설정
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  return (
    // 모달 외부
    <ModalOverlay onClick={onClose} style={{ display: open ? "flex" : "none" }}>
      <ModalContent width={width} padding={padding} onClick={preventOffModal}>
        {/* 모달 내부 내용 */}
        {/** children으로 모달 내부에 원하는 내용을 넣을 수 있도록 함 */}
        {/** 예: <BaseModal><div>내용</div></BaseModal> */}
        {/** 모달 내부에서 onClose를 호출하려면, 모달 내부 컴포넌트에서 onClose 함수를 prop으로 받아 사용하면 됨 */}
        {/** 예: <button onClick={onClose}>닫기</button> */}
        {children}
      </ModalContent>
    </ModalOverlay>
  );
}
