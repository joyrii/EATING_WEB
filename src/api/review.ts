import { api } from '@/api/axios-client';
import axios from 'axios';

export const getPendingReviews = async () => {
  try {
    const res = await api.get('/reviews/pending');
    return res.data;
  } catch (error) {
    console.error('Error fetching pending reviews:', error);
    throw error;
  }
};

export const submitReview = async (
  match_group_id: string,
  rating: number,
  excluded_user_ids: string[],
  reported_users: { user_id: string; description: string }[],
  feedback_text: string,
) => {
  try {
    const payload = {
      match_group_id,
      rating,
      excluded_user_ids,
      reported_users,
      feedback_text,
    };

    console.log('[submitReview payload]', payload);

    const res = await api.post('/reviews/', payload);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('[submitReview  error]', {
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.error('[submitReview error]', error);
    }
    throw error;
  }
};

export const getReportableRooms = async () => {
  try {
    const res = await api.get(`/reports/rooms`);
    return res.data;
  } catch (error) {
    console.error('Error fetching reportable rooms:', error);
    throw error;
  }
};

export const submitReport = async (
  match_group_id: string,
  targets: { user_id: string; report_type: string }[],
  description?: string,
  image_urls?: string[],
) => {
  try {
    const res = await api.post('/reports', {
      match_group_id,
      targets,
      description,
      image_urls,
    });
    return res.data;
  } catch (error) {
    console.error('Error submitting report:', error);
    throw error;
  }
};
