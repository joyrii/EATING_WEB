"use client";

import { NavBar, NavTab } from "./style";
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

  return (
    <NavBar>
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        const Icon = active ? tab.icon.active : tab.icon.inactive;
        const Label = active ? tab.label : null;

        return (
          <NavTab key={tab.label} href={tab.href} $active={active}>
            <Image
              src={Icon}
              alt={`${tab.label}-icon`}
              width={24}
              height={24}
            />
            {Label}
          </NavTab>
        );
      })}
    </NavBar>
  );
}
