import { apiCall } from './index';

export interface IUser {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  company_name: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
  role: string;
}

export const apiGetUserRequest = (onSuccess: (user: IUser) => void, onError = () => {}) => {
  return apiCall('/api/user', {}, onSuccess, onError);
};

export const apiGetAllUserRequest = (text: string, onSuccess: (users: { users: IUser[] }) => void, onError = () => {}) => {
  const formData = new FormData();
  formData.append('text', text);
  return apiCall('/api/users/get_all_search', formData, onSuccess, onError);
};
