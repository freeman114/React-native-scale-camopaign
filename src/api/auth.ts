import { apiCall } from './index';

type Token = string;

export const apiGetTokenRequest = (
  email: string,
  password: string,
  onSuccess: (token: Token) => void,
  onError
) => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  return apiCall('/api/token', formData, onSuccess, onError);
};


export const changeToken = (
  userId: number,
  onSuccess: (response) => void,
  onError,
) => {
  const formData = new FormData();
  formData.append('id', userId.toString());
  return apiCall('/api/users/go_to_account', formData, onSuccess, onError);
};