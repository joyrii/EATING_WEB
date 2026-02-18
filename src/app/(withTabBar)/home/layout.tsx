import { getBanners } from '@/api/home';
import HomeLayoutClient from './HomeLayoutClient';
import { MatchingStatus } from '@/constants/MATCHING';

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const banners = await getBanners();

  return <HomeLayoutClient banners={banners}>{children}</HomeLayoutClient>;
}
