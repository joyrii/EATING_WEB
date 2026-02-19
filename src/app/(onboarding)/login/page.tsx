import { Suspense } from 'react';
import LoginClient from './LoginClient';

export default function Login() {
  return (
    <Suspense>
      <LoginClient />
    </Suspense>
  );
}
