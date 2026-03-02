import { getBanners } from '@/api/home';
import HomeLayoutClient from './HomeLayoutClient';

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const banners = await getBanners();

  return <HomeLayoutClient banners={banners}>{children}</HomeLayoutClient>;
}
