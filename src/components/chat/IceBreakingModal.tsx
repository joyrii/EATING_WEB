import { useState } from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

export default function IceBreakingModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen) return null;

  const ICE_BREAKING_TOPICS = [
    '학과 생활 이야기',
    '학교 주변 최애 맛집 이야기',
    '(새내기) 너 수시로 왔어 정시로 왔어?',
    '(새내기) 고등학교 시절 이야기',
    '넷플 예능 (흑백 요리사 / 솔로지옥 / 환연3)',
    '두쫀쿠 최고 존엄 맛집 이야기',
    '(새내기) 과잠 / 학잠 / 주경바막 / 돕바 / 후리스 등 공구 물품 디자인 이야기',
    '기대되는 수업, 궁금한 전공',
  ];

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
            {ICE_BREAKING_TOPICS.map((topic, index) => (
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
