import { api } from '@/api/axios-client';

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
  reported_users: string[],
  feedback_text: string,
) => {
  try {
    const res = await api.post('/reviews', {
      match_group_id,
      rating,
      excluded_user_ids,
      reported_users,
      feedback_text,
    });
    return res.data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};
