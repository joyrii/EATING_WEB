import { getIceBreakingQuestions } from '@/api/matching';
import { useState } from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

export default function IceBreakingModal({
  isOpen,
  onClose,
  topics,
}: {
  isOpen: boolean;
  onClose: () => void;
  topics?: string[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <IceBreakingTitle>아이스브레이킹 주제 추천</IceBreakingTitle>
          <img
            src="/svgs/chat/close.svg"
            alt="Close Icon"
            onClick={onClose}
            style={{ cursor: 'pointer' }}
          />
        </ModalHeader>
        <ModalBody>
          <IceBreakingImg
            src="/svgs/chat/ice-breaking.svg"
            alt="Ice Breaking"
          />
          <IceBreakingList>
            {topics?.map((topic, index) => (
              <IceBreakingTopic key={index}>
                <Ice>🧊</Ice>
                {index + 1}. {topic}
              </IceBreakingTopic>
            ))}
          </IceBreakingList>
        </ModalBody>
      </Modal>
    </Overlay>,
    document.body,
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const Modal = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 1001;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 16px 24px 0;
  flex: 0 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalBody = styled.div`
  padding-bottom: 50px;
  flex: 1 1 auto;
  overflow-y: auto;

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  -webkit-overflow-scrolling: touch;
`;

const IceBreakingTitle = styled.h2`
  font-size: 21px;
  font-weight: 600;
`;

const IceBreakingImg = styled.img`
  width: 160px;
  margin-top: 11px;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const IceBreakingList = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const IceBreakingTopic = styled.div`
  width: 88%;
  font-size: 16px;
  font-weight: 500;
  color: #575757;
  background-color: #fcfcfc;
  border-radius: 10px;
  padding: 10px 20px;
  display: flex;
  flex-direction: row;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

const Ice = styled.div`
  margin-right: 5px;
`;
