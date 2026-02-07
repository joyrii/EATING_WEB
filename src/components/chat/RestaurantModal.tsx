import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';

export default function RestaurantModal({
  isOpen,
  onClose,
  restaurant,
}: {
  isOpen: boolean;
  onClose: () => void;
  restaurant: any;
}) {
  const [mounted, setMounted] = useState(false);
  const [isOpenHoursDropdown, setIsOpenHoursDropdown] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen) return null;

  const MENU = [
    { name: '뚝배기 라면', price: '6,000원' },
    { name: '치즈불짜파게티', price: '12,000원' },
    { name: '진미당김밥', price: '5,000원' },
    { name: '스팸김밥', price: '6,000원' },
    { name: '참치김밥', price: '6,000원' },
    { name: '매운오뎅김밥', price: '6,000원' },
    { name: '더블체다치즈김밥', price: '7,000원' },
    { name: '참치땡초김밥', price: '7,000원' },
  ];

  const OPEN_HOURS = [
    { day: '월', time: '10:00 - 19:30', lastOrder: '19:00 라스트오더' },
    { day: '화', time: '10:00 - 19:30', lastOrder: '19:00 라스트오더' },
    { day: '수', time: '10:00 - 19:30', lastOrder: '19:00 라스트오더' },
    { day: '목', time: '10:00 - 19:30', lastOrder: '19:00 라스트오더' },
    { day: '금', time: '10:00 - 19:30', lastOrder: '19:00 라스트오더' },
    { day: '토', time: '10:00 - 19:30', lastOrder: '19:00 라스트오더' },
    { day: '일', time: '정기휴무', lastOrder: '' },
  ];

  return createPortal(
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Bar />
        </ModalHeader>
        <ModalBody>
          <RestaurantName>진미당</RestaurantName>
          <RestaurantInfoList>
            <RestaurantInfoItem>
              <RestaurantInfoIcon
                src="/svgs/chat/location.svg"
                alt="Location Icon"
              />
              <RestaurantInfoText>
                서울 서대문구 이화여대길 65-4 1층 101호
              </RestaurantInfoText>
            </RestaurantInfoItem>
            <RestaurantInfoItem>
              <RestaurantInfoIcon
                src="/svgs/chat/benefit.svg"
                alt="Benefit Icon"
              />
              <RestaurantInfoTextHighlight>
                10% 할인
              </RestaurantInfoTextHighlight>
            </RestaurantInfoItem>
            <RestaurantInfoItem style={{ alignItems: 'flex-start' }}>
              <RestaurantInfoIcon src="/svgs/chat/time.svg" alt="Time Icon" />
              {isOpenHoursDropdown ? (
                <>
                  <RestaurantInfoText>
                    월 <Seperator>|</Seperator> 10:00 - 19:30
                  </RestaurantInfoText>
                  <DropdownButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpenHoursDropdown(!isOpenHoursDropdown);
                    }}
                  >
                    <IoChevronDown size={20} color="#707070" />
                  </DropdownButton>
                </>
              ) : (
                <HoursList>
                  {OPEN_HOURS.map((item, index) => {
                    const isLast = index === OPEN_HOURS.length - 1;
                    return (
                      <HoursItem key={item.day}>
                        <HoursDay>{item.day}</HoursDay>
                        <Seperator>|</Seperator>
                        <Hours>
                          {item.time}
                          {item.lastOrder && (
                            <LastOrder>{item.lastOrder}</LastOrder>
                          )}
                        </Hours>
                        {isLast && (
                          <IoChevronUp
                            size={20}
                            color="#707070"
                            style={{ marginLeft: '8px', cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsOpenHoursDropdown(!isOpenHoursDropdown);
                            }}
                          />
                        )}
                      </HoursItem>
                    );
                  })}
                </HoursList>
              )}
            </RestaurantInfoItem>
            <RestaurantInfoItem>
              <RestaurantInfoIcon src="/svgs/chat/call.svg" alt="Call Icon" />
              <RestaurantInfoText>
                02-363-3333
                <CopyButton
                  onClick={() => navigator.clipboard.writeText('02-363-3333')}
                >
                  복사
                </CopyButton>
              </RestaurantInfoText>
            </RestaurantInfoItem>
          </RestaurantInfoList>
          <Divider />
          <Menu>
            메뉴
            <MenuList>
              {MENU.map((item) => (
                <MenuItem key={item.name}>
                  <MenuName>{item.name}</MenuName>
                  <MenuPrice>{item.price}</MenuPrice>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </ModalBody>
      </Modal>
    </Overlay>,
    document.body,
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: transparent;
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
  padding: 16px 24px 50px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 16px 24px 0;
  flex: 0 0 auto;
`;

const ModalBody = styled.div`
  padding: 0 24px 50px;
  flex: 1 1 auto;
  overflow-y: auto;

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  -webkit-overflow-scrolling: touch;
`;

const Bar = styled.div`
  width: 50px;
  height: 4px;
  background: #d9d9d9;
  border-radius: 17px;
  margin: 0 auto;
`;

const RestaurantName = styled.h2`
  font-size: 24px;
  font-weight: 600;
`;

const RestaurantInfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 7px;
`;

const RestaurantInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RestaurantInfoIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const RestaurantInfoText = styled.p`
  font-size: 14px;
  color: #8d8d8d;
`;

const RestaurantInfoTextHighlight = styled.span`
  color: #ff7a33;
  font-weight: 700;
`;

const Seperator = styled.span`
  margin: 0 5px;
`;

const DropdownButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  align-items: center;
  display: flex;
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  font-size: 14px;
  color: #638d83;
  cursor: pointer;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #d6d6d6;
  margin: 20px auto;
`;

const Menu = styled.div`
  font-size: 18px;
  font-weight: 500;
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 7px;
`;

const MenuItem = styled.div`
  display: flex;
  justify-content: space-between;
`;

const MenuName = styled.span`
  font-size: 14px;
  font-weight: 300;
`;

const MenuPrice = styled.span`
  font-size: 14px;
  font-weight: 400;
`;

const HoursList = styled.div`
  display: flex;
  flex-direction: column;
`;

const HoursItem = styled.div`
  display: flex;
  margin-top: 4px;
  color: #8a8a8a;
  align-items: flex-start;
`;

const HoursDay = styled.span`
  font-size: 14px;
  font-weight: 400;
`;

const Hours = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #8d8d8d;
`;

const LastOrder = styled.span`
  font-size: 14px;
  color: #8d8d8d;
`;
