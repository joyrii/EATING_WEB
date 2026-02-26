'use client';

import MatchingListItem from '@/components/home/MatchingListItem';
import { Description, Title, TitleContainer, MatchingList } from '../style';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getReportableRooms } from '@/api/review';
import MatchingDetailModal from '@/components/home/MatchingDetailModal';
import { fetchPendingMatches } from '@/api/matching';
import type { ChatRoomInfo } from '@/type/chat';

type PendingSlot = {
  group_id: string;
  round_id: string;
  matched_slot: { date: string; hour: number };
  restaurant_name: string;
  members: { user_id: string; name: string }[];
  has_reviewed: boolean;
  member_count: number;
  common_interests: string[];
  student_years_text: string;
  personality_text: string;
};

type ReportableRoom = {
  group_id: string;
  matched_slot: { date: string; hour: number };
  restaurant_name: string;
  members: { user_id: string; name: string; student_id: string }[];
};

export default function NoshowStore() {
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get('type') || 'noshow';

  const [rooms, setRooms] = useState<ReportableRoom[]>([]);
  const [pending, setPending] = useState<PendingSlot[]>([]);
  const [pendingLoading, setPendingLoading] = useState(true);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoomInfo | null>(null);
  const [selectedPending, setSelectedPending] = useState<PendingSlot | null>(
    null,
  );
  const [selectedJoinedCount, setSelectedJoinedCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const data = await getReportableRooms();
        setRooms((data ?? []) as ReportableRoom[]);
      } catch (error) {
        console.error('Failed to fetch reportable rooms:', error);
        setRooms([]);
      }
    })();
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setPendingLoading(true);
      try {
        const list = await fetchPendingMatches();
        if (!cancelled) setPending((list ?? []) as any);
      } catch (e) {
        console.error('Failed to load pending:', e);
        if (!cancelled) setPending([]);
      } finally {
        if (!cancelled) setPendingLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const pendingByGroupId = useMemo(() => {
    const map = new Map<string, PendingSlot>();
    for (const p of pending ?? []) map.set(String(p.group_id), p);
    return map;
  }, [pending]);

  const openDetail = (m: ReportableRoom) => {
    const found = pendingByGroupId.get(String(m.group_id)) ?? null;

    const joined = (m.members ?? []).length;
    const total = found?.member_count ?? joined;

    const roomLike: ChatRoomInfo = {
      group_id: m.group_id,
      member_count: total,
      matched_slot: m.matched_slot,
      channel_url: '',
      chat_code: '',
      members: (m.members ?? []).map(({ user_id, name }) => ({
        user_id,
        name,
      })),
      created_at: '',
    } as any;

    setSelectedRoom(roomLike);
    setSelectedPending(found);
    setSelectedJoinedCount(joined);
    setIsModalVisible(true);
  };

  return (
    <>
      <TitleContainer>
        <Title>
          {type === 'noshow' ? '노쇼' : '문제'}가 있었던 매장을 선택해주세요
        </Title>
        <Description>
          처단하자! {type === 'noshow' ? '노쇼' : '끝'}!
        </Description>
      </TitleContainer>

      <MatchingList>
        {rooms.map((m) => {
          const joined = (m.members ?? []).length;
          const total =
            pendingByGroupId.get(String(m.group_id))?.member_count ?? joined;

          return (
            <MatchingListItem
              key={m.group_id}
              date={m.matched_slot.date}
              hour={m.matched_slot.hour}
              currentCount={joined}
              totalCount={total}
              clickable
              onClick={() => {
                {
                  type === 'noshow'
                    ? router.push(`/noshow/matching/${m.group_id}/user`)
                    : router.push(
                        `/noshow/matching/${m.group_id}/inappropriate`,
                      );
                }
              }}
              onDetailClick={() => openDetail(m)}
            />
          );
        })}
      </MatchingList>

      <MatchingDetailModal
        open={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedRoom(null);
          setSelectedPending(null);
          setSelectedJoinedCount(0);
        }}
        selectedRoom={selectedRoom}
        selectedPending={selectedPending}
        pendingLoading={pendingLoading}
        sbJoinedMemberCount={selectedJoinedCount}
      />
    </>
  );
}
