"use client";

import {
  NavBar,
  NavTab,
  TabLabel,
  TabLabelWrap,
  IconWrap,
  Indicator,
} from "./style";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function TabBar() {
  const tabs = [
    {
      href: "/home",
      icon: {
        active: "/svgs/home/navbar/home-active.svg",
        inactive: "/svgs/home/navbar/home-inactive.svg",
      },
      label: "홈",
    },
    {
      href: "/matching",
      icon: {
        active: "/svgs/home/navbar/matching-active.svg",
        inactive: "/svgs/home/navbar/matching-inactive.svg",
      },
      label: "매칭",
    },
    {
      href: "/settings",
      icon: {
        active: "/svgs/home/navbar/setting-active.svg",
        inactive: "/svgs/home/navbar/setting-inactive.svg",
      },
      label: "설정",
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
