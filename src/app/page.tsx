import { redirect } from 'next/navigation';

export default function Page() {
  // (임시) 로그인 화면으로 리다이렉트
  redirect('/login');
}
