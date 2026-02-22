import { PendingMatch } from '@/api/matching';

export type ChannelMeta = {
  code: string; // group_id
  matched_slot: { date: string; hour: number };
  restaurant_name?: string;
  members?: { user_id: string; name: string }[];
};

export function safeParseMeta(data: any): ChannelMeta | null {
  if (!data || typeof data !== 'string') return null;
  try {
    const obj = JSON.parse(data);
    if (!obj?.code || !obj?.matched_slot) return null;
    return obj as ChannelMeta;
  } catch {
    return null;
  }
}

export function toKstIso(date: string, hour: number) {
  const hh = String(hour).padStart(2, '0');
  return `${date}T${hh}:00:00+09:00`;
}

function guessPendingByMembers(channel: any, pending: PendingMatch[]) {
  const chIds: string[] = (channel?.members ?? [])
    .map((m: any) => m?.userId)
    .filter(Boolean);

  if (chIds.length === 0) return null;

  const chSet = new Set(chIds);

  const candidates = pending.filter((p) => {
    const pIds = p.members.map((m) => m.user_id);
    if (pIds.length !== chSet.size) return false;
    for (const id of pIds) if (!chSet.has(id)) return false;
    return true;
  });

  return candidates.length === 1 ? candidates[0] : null;
}

export async function ensureChannelMeta(
  channel: any,
  pending: PendingMatch[],
): Promise<ChannelMeta | null> {
  const existing = safeParseMeta(channel?.data);
  if (existing) return existing;

  const guessed = guessPendingByMembers(channel, pending);
  if (!guessed) return null;

  const meta: ChannelMeta = {
    code: guessed.group_id,
    matched_slot: guessed.matched_slot,
    restaurant_name: guessed.restaurant_name,
    members: guessed.members,
  };

  try {
    await channel.updateChannel?.({
      data: JSON.stringify(meta),
      customType: 'EATING_MATCH',
    });
  } catch (e) {
    console.warn('Failed to update channel meta:', e);
  }

  return meta;
}
