import { api } from '@/api/axios-client';

export async function getQRInfo(qrId: string) {
  try {
    const res = await api.get(`/restaurants/${qrId}`);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch QR info', error);
    throw error;
  }
}
