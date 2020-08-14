import { apiCall } from './index';

export const apiGetLevelsRequest = (onSuccess: (levels) => void, onError = () => {}) => {
  return apiCall('/api/levels', {}, onSuccess, onError);
};
