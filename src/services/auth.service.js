import { api } from 'src/api';

export const loginOrSignup = async (data) => {
  const result = await api.post(`/authenticate`, data);

  return result;
};
