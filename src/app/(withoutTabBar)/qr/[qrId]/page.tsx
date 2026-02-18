import QRClient from './QRClient';

export default async function QRPage({
  params,
}: {
  params: Promise<{ qrId: string }>;
}) {
  const { qrId } = await params;
  return <QRClient qrId={qrId} />;
}
