import SendbirdChat from '@sendbird/chat';
import { GroupChannelModule } from '@sendbird/chat/groupChannel';

type SB = Awaited<ReturnType<typeof SendbirdChat.init>>;

type SBWithGroupChannel = SB & {
  groupChannel: any;
};

let sb: SBWithGroupChannel | null = null;

export function getSendbirdInstance(): SBWithGroupChannel {
  if (!sb)
    throw new Error(
      'Sendbird instance is not initialized. Please call initializeSendbird first.',
    );
  return sb;
}

export async function connectSendbird(
  userId: string,
  nickname?: string,
  profileUrl?: string,
) {
  if (typeof window === 'undefined')
    throw new Error('Sendbird cannot be initialized on the server side.');

  // SDK init
  if (!sb) {
    sb = (await SendbirdChat.init({
      appId: process.env.NEXT_PUBLIC_SENDBIRD_APP_ID!,
      modules: [new GroupChannelModule()],
    })) as SBWithGroupChannel;
  }

  // 유저 connect
  await sb.connect(userId);

  // 닉네임 세팅
  if (profileUrl || nickname) {
    await sb.updateCurrentUserInfo({
      nickname: nickname ?? undefined,
      profileUrl: profileUrl ?? undefined,
    });
  }

  return sb;
}

export async function disconnectSendbird() {
  try {
    if (!sb) return;
    await sb.disconnect();
  } catch (error) {
    console.error('Failed to disconnect Sendbird:', error);
  } finally {
    sb = null;
  }
}

let connectPromise: Promise<any> | null = null;

export async function ensureSendbirdConnected(
  userId: string,
  nickname?: string,
  profileUrl?: string,
) {
  // 이미 연결 중이면 그 Promise를 공유
  if (connectPromise) return connectPromise;

  connectPromise = (async () => {
    const sb = await connectSendbird(userId, nickname, profileUrl);
    return sb;
  })();

  try {
    return await connectPromise;
  } finally {
    // 실패/성공 후 다음 호출을 위해 초기화
    connectPromise = null;
  }
}
