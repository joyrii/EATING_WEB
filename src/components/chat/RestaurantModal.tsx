import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { getRestaurantById, getRestaurants } from '@/api/application';

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
  const [restaurantData, setRestaurantData] = useState(restaurant);
  const [restaurantMenu, setRestaurantMenu] = useState([]);
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // pending API 요청 수
  const [pending, setPending] = useState(0);
  const begin = () => setPending((p) => p + 1);
  const end = () => setPending((p) => Math.max(0, p - 1));
  const isLoading = pending > 0;

  // 초기화
  useEffect(() => {
    if (!isOpen) return;
    setRestaurantData(restaurant);
    setRestaurantMenu([]);
    setIsOpenHoursDropdown(false);
  }, [isOpen, restaurant?.id]);

  // 애니메이션
  useEffect(() => {
    if (!mounted) return;

    if (isOpen) {
      setShouldRender(true);
      setVisible(false);
      const t = setTimeout(() => {
        modalRef.current?.getBoundingClientRect();
        setVisible(true);
      }, 0);

      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [isOpen, mounted, restaurant?.id]);

  // 식당 상세 정보 업데이트
  const reqSeq = useRef(0);

  useEffect(() => {
    if (!isOpen || !restaurant?.id) return;

    const seq = ++reqSeq.current;

    (async () => {
      begin();
      try {
        const detail = await getRestaurantById(restaurant.id);
        if (reqSeq.current !== seq) return;
        setRestaurantData(detail);
      } catch (e) {
        if (reqSeq.current !== seq) return;
        console.error(e);
      } finally {
        end();
      }
    })();
  }, [isOpen, restaurant?.id]);

  // 식당 메뉴 정보 업데이트
  useEffect(() => {
    if (!isOpen || !restaurantData) return;
    (async () => {
      begin();
      try {
        const list = await getRestaurants();
        const matched = list.find((r) => r.id === restaurantData.id);
        setRestaurantMenu(matched?.menu_items || []);
      } catch (e) {
        console.error(e);
      } finally {
        end();
      }
    })();
  }, [restaurantData?.id, isOpen]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !shouldRender) return null;

  const MENU = restaurantMenu.length
    ? restaurantMenu.map((item: any) => ({
        name: item.name,
        price: item.price ? `${item.price}원` : '가격 정보 없음',
      }))
    : [{ name: '메뉴 정보가 없습니다', price: '' }];

  type BusinessHours = Partial<
    Record<
      | 'monday'
      | 'tuesday'
      | 'wednesday'
      | 'thursday'
      | 'friday'
      | 'saturday'
      | 'sunday',
      {
        open: string;
        close: string;
        lastOrder?: string;
        breakStart?: string;
        breakEnd?: string;
      }
    >
  >;
  type OpenHourRow = { day: string; time: string; lastOrder?: string };

  const DAY_MAP: Array<{
    key: keyof BusinessHours;
    label: string;
  }> = [
    { key: 'monday', label: '월' },
    { key: 'tuesday', label: '화' },
    { key: 'wednesday', label: '수' },
    { key: 'thursday', label: '목' },
    { key: 'friday', label: '금' },
    { key: 'saturday', label: '토' },
    { key: 'sunday', label: '일' },
  ];

  function toOpenHours(bussiness_hours?: BusinessHours): OpenHourRow[] {
    return DAY_MAP.map(({ key, label }) => {
      const value = bussiness_hours?.[key];

      if (value == null) {
        return { day: label, time: '정기 휴무' };
      }

      return {
        day: label,
        time: `${value.open} - ${value.close}`,
        lastOrder: value.lastOrder,
      };
    });
  }

  const OPEN_HOURS = toOpenHours(restaurantData?.business_hours);

  const handleAnimationEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== 'transform') return;
    if (!isOpen) setShouldRender(false);
  };

  return createPortal(
    <Overlay
      $open={visible}
      onClick={() => {
        onClose();
        setIsOpenHoursDropdown(false);
      }}
    >
      <Modal
        ref={modalRef}
        $open={visible}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onTransitionEnd={handleAnimationEnd}
      >
        <ModalHeader>
          <BarWrapper onClick={onClose}>
            <Bar />
          </BarWrapper>
        </ModalHeader>
        <ModalBody>
          <RestaurantName>{restaurantData?.name}</RestaurantName>
          {isLoading ? (
            <div style={{ height: '80vh' }}>불러오는 중...</div>
          ) : (
            <>
              <RestaurantInfoList>
                <RestaurantInfoItem>
                  <RestaurantInfoIcon
                    src="/svgs/chat/location.svg"
                    alt="Location Icon"
                  />
                  <RestaurantInfoText>
                    {restaurantData?.address || '주소 정보가 없습니다'}
                  </RestaurantInfoText>
                </RestaurantInfoItem>
                <RestaurantInfoItem>
                  <RestaurantInfoIcon
                    src="/svgs/chat/benefit.svg"
                    alt="Benefit Icon"
                  />
                  <RestaurantInfoTextHighlight>
                    {restaurantData?.promotion || '할인 정보가 없습니다'}
                  </RestaurantInfoTextHighlight>
                </RestaurantInfoItem>
                <RestaurantInfoItem style={{ alignItems: 'flex-start' }}>
                  <RestaurantInfoIcon
                    src="/svgs/chat/time.svg"
                    alt="Time Icon"
                  />
                  {isOpenHoursDropdown ? (
                    <>
                      {OPEN_HOURS.slice(0, 1).map((item) => {
                        return (
                          <HoursItem key={item.day}>
                            <HoursDay>{item.day}</HoursDay>
                            <Seperator>|</Seperator>
                            <Hours>{item.time}</Hours>
                          </HoursItem>
                        );
                      })}
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
                                <LastOrder>
                                  {item.lastOrder} 라스트오더
                                </LastOrder>
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
                  <RestaurantInfoIcon
                    src="/svgs/chat/call.svg"
                    alt="Call Icon"
                  />
                  <RestaurantInfoText>
                    {restaurantData?.phone || '전화번호 정보가 없습니다'}
                    <CopyButton
                      onClick={() =>
                        navigator.clipboard.writeText(
                          restaurantData?.phone || '',
                        )
                      }
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
            </>
          )}
        </ModalBody>
      </Modal>
    </Overlay>,
    document.body,
  );
}

const Overlay = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;

  opacity: ${(props) => (props.$open ? 1 : 0)};
  transition: opacity 240ms ease;

  pointer-events: ${(p) => (p.$open ? 'auto' : 'none')};
`;

const Modal = styled.div<{ $open: boolean }>`
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

  transform: translate3d(0, ${(p) => (p.$open ? '0' : '100%')}, 0);
  transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1);

  will-change: transform;
`;

const ModalHeader = styled.div`
  padding: 16px 24px 0;
  flex: 0 0 auto;
  margin-bottom: 18px;
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

const BarWrapper = styled.div`
  padding: 5px 0;
  display: flex;
  justify-content: center;
  cursor: pointer;
`;

const Bar = styled.div`
  width: 50px;
  height: 4px;
  background: #d9d9d9;
  border-radius: 17px;
  margin: 0 auto;
  cursor: pointer;
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
