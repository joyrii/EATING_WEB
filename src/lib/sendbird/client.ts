'use client';

import SendbirdChat from '@sendbird/chat';
import { GroupChannelModule } from '@sendbird/chat/groupChannel';
import type { GroupChannel } from '@sendbird/chat/groupChannel';

type SB = any;

let sb: SB | null = null;
let connectPromise: Promise<SB> | null = null;

function getGroupChannelApi(inst: SB) {
  const gc = inst?.groupChannel;
  if (!gc) throw new Error('GroupChannel module is not loaded.');
  return gc as {
    getChannel: (channelUrl: string) => Promise<GroupChannel>;
    createMyGroupChannelListQuery: (params: {
      includeEmpty?: boolean;
      order?: 'latest_last_message' | string;
      limit?: number;
    }) => {
      next: () => Promise<GroupChannel[]>;
      hasNext?: boolean;
    };
    addGroupChannelHandler?: (...args: any[]) => any;
    removeGroupChannelHandler?: (...args: any[]) => any;
  };
}

// Sendbird 인스턴스 반환(초기화/연결 안 됐으면 throw)
export function getSendbirdInstance(): SB {
  if (!sb)
    throw new Error(
      'Sendbird is not initialized. Call connectSendbird() first.',
    );
  return sb;
}

// 최초 init + connect + 내 프로필(nickname/profileUrl) 세팅
export async function connectSendbird(
  userId: string,
  nickname?: string,
  profileUrl?: string,
): Promise<SB> {
  if (typeof window === 'undefined') {
    throw new Error('Sendbird cannot be initialized on the server side.');
  }

  // 1) init (once)
  if (!sb) {
    sb = await SendbirdChat.init({
      appId: process.env.NEXT_PUBLIC_SENDBIRD_APP_ID!,
      modules: [new GroupChannelModule()],
    });
  }

  // 2) connect
  if (sb.currentUser?.userId !== userId) {
    await sb.connect(userId);
  }

  // 3) update user info (optional)
  if (profileUrl || nickname) {
    await sb.updateCurrentUserInfo({
      nickname: nickname ?? undefined,
      profileUrl: profileUrl ?? undefined,
    });
  }

  return sb;
}

// connect 중복 호출 방지(StrictMode/useEffect 중복 대응)
export async function ensureSendbirdConnected(
  userId: string,
  nickname?: string,
  profileUrl?: string,
): Promise<SB> {
  if (sb?.currentUser?.userId === userId) return sb;

  if (connectPromise) return connectPromise;

  connectPromise = connectSendbird(userId, nickname, profileUrl);

  try {
    return await connectPromise;
  } finally {
    connectPromise = null;
  }
}

// 연결 해제(로그아웃 등)
export async function disconnectSendbird() {
  try {
    if (!sb) return;
    await sb.disconnect();
  } catch (error) {
    console.error('Failed to disconnect Sendbird:', error);
  } finally {
    sb = null;
    connectPromise = null;
  }
}

export type ChannelMeta = {
  channelUrl: string;
  memberCount: number;
  unreadCount: number;
  lastMessageText: string | null;
  lastMessageCreatedAt: number | null; // ms
};

function extractLastMessageText(lastMessage: any): string | null {
  if (!lastMessage) return null;
  if (typeof lastMessage.message === 'string') return lastMessage.message;
  if (typeof lastMessage.name === 'string') return lastMessage.name;
  return null;
}

export async function getChannelMetaByGroupId(params: {
  userId: string;
  groupId: string;
  nickname?: string;
  profileUrl?: string;
}): Promise<ChannelMeta | null> {
  const { userId, groupId, nickname, profileUrl } = params;

  const inst = await ensureSendbirdConnected(userId, nickname, profileUrl);
  const groupChannel = getGroupChannelApi(inst);

  const channelUrl = `match_${groupId}`;

  try {
    const ch = await groupChannel.getChannel(channelUrl);

    return {
      channelUrl,
      memberCount: ch.memberCount ?? 0,
      unreadCount: ch.unreadMessageCount ?? 0,
      lastMessageText: extractLastMessageText(ch.lastMessage),
      lastMessageCreatedAt: ch.lastMessage?.createdAt ?? null,
    };
  } catch (e) {
    console.warn('[Sendbird] getChannelMetaByGroupId failed:', channelUrl, e);
    return null;
  }
}

export async function listMyGroupChannels(params: {
  userId: string;
  nickname?: string;
  profileUrl?: string;
  limit?: number;
  maxPages?: number; // pagination 안전장치
}): Promise<GroupChannel[]> {
  const { userId, nickname, profileUrl, limit = 50, maxPages = 5 } = params;

  const inst = await ensureSendbirdConnected(userId, nickname, profileUrl);
  const groupChannel = getGroupChannelApi(inst);

  const query = groupChannel.createMyGroupChannelListQuery({
    includeEmpty: true,
    order: 'latest_last_message',
    limit,
  });

  const all: GroupChannel[] = [];
  let page = 0;

  while (page < maxPages) {
    const channels = await query.next();
    all.push(...channels);

    if (!query.hasNext) break;
    page += 1;
  }

  return all;
}

//groupId -> memberCount만 빠르게 필요할 때
export async function getMemberCountByGroupId(params: {
  userId: string;
  groupId: string;
  nickname?: string;
  profileUrl?: string;
}): Promise<number> {
  const meta = await getChannelMetaByGroupId(params);
  return meta?.memberCount ?? 0;
}

// channelUrl로 채널 객체 가져오기
export async function getGroupChannelByUrl(params: {
  userId: string;
  channelUrl: string;
  nickname?: string;
  profileUrl?: string;
}): Promise<GroupChannel> {
  const { userId, channelUrl, nickname, profileUrl } = params;

  const inst = await ensureSendbirdConnected(userId, nickname, profileUrl);
  const groupChannel = getGroupChannelApi(inst);

  return await groupChannel.getChannel(channelUrl);
}
