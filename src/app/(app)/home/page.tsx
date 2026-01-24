"use client";

import GuideSection from "@/components/home/GuideSection";
import { useMatching } from "./context";

export default function Home() {
  const { currentStatus } = useMatching();

  return (
    <>
      {/* 안내 섹션 */}
      {currentStatus === "before" || currentStatus === "inProgress" ? (
        <GuideSection />
      ) : (
        ""
      )}
    </>
  );
}
