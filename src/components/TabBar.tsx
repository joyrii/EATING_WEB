'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useUser } from '@/context/userContext';

export default function TabBar() {
  const { me } = useUser();
  const isAdmin = me?.is_admin ?? false;

  const tabs = [
    {
      href: '/home',
      icon: {
        active: '/svgs/home/navbar/home-active.svg',
        inactive: '/svgs/home/navbar/home-inactive.svg',
      },
      label: '홈',
    },
    {
      href: isAdmin ? '/matching' : '/ready',
      icon: {
        active: '/svgs/home/navbar/matching-active.svg',
        inactive: '/svgs/home/navbar/matching-inactive.svg',
      },
      label: '매칭',
    },
    {
      href: isAdmin ? '/settings' : '/ready-2',
      icon: {
        active: '/svgs/home/navbar/setting-active.svg',
        inactive: '/svgs/home/navbar/setting-inactive.svg',
      },
      label: '설정',
    },
  ];

  const pathname = usePathname();
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => pathname === tab.href),
  );

  return (
    <NavBar>
      <Indicator $index={activeIndex} $count={tabs.length} />

      {tabs.map((tab, index) => {
        const active = index === activeIndex;
        const Icon = active ? tab.icon.active : tab.icon.inactive;

        return (
          <NavTab key={tab.label} href={tab.href} $active={active}>
            <IconWrap>
              <Image
                src={Icon}
                alt={`${tab.label}-icon`}
                width={24}
                height={24}
              />
            </IconWrap>
            <TabLabelWrap $active={active}>
              <TabLabel $active={active}>{tab.label}</TabLabel>
            </TabLabelWrap>
          </NavTab>
        );
      })}
    </NavBar>
  );
}

// 탭바
const NavBar = styled.nav`
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);

  width: 245px;
  height: 68px;
  padding: 10px;

  background-color: #ffeee5;
  border-radius: 100px;

  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const Indicator = styled.div<{ $index: number; $count: number }>`
  position: absolute;
  top: 10px;
  left: 10px;

  height: calc(100% - 20px);
  width: calc((100% - 20px) / ${({ $count }) => $count});

  transform: translateX(calc(${(p) => p.$index} * 100%));
  transition: transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1);

  background-color: #ffffff;
  border-radius: 100px;

  pointer-events: none;
`;

const NavTab = styled(Link)<{ $active: boolean }>`
  position: relative;
  z-index: 1;

  flex: 1;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  text-decoration: none;
  color: #ff5900;
`;

const IconWrap = styled.span`
  width: 24px;
  height: 24px;
  flex: 0 0 24px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const TabLabelWrap = styled.span<{ $active: boolean }>`
  max-width: ${(p) => (p.$active ? '84px' : '0px')};
  overflow: hidden;
  white-space: nowrap;

  transition: max-width 240ms cubic-bezier(0.2, 0.8, 0.2, 1);
`;

const TabLabel = styled.span<{ $active: boolean }>`
  font-size: 12px;
  font-weight: 700;
  line-height: 145%;
  letter-spacing: -0.01em;

  margin-left: 6px;
  white-space: nowrap;

  opacity: ${(p) => (p.$active ? 1 : 0)};
  transform: translateX(${(p) => (p.$active ? '0' : '-10px')});

  transition:
    opacity 180ms ease,
    transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1);
`;
