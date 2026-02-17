import { createServerSupabaseClient } from '@/lib/supabase/server';
import ConfirmClient from './ConfirmClient';

export default async function Page() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  let name = '';

  if (session?.access_token) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      name = data.name;
    }
  }

  return <ConfirmClient name={name} />;
}
