import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from '@react-native-community/netinfo';
export const StorageTokenKey = '@secure_token';

const STATUS_OK = 200;

export const apiCall = async (
  url: string,
  data: any,
  successCallback: (data) => void = () => null,
  errorCallback: (error) => void = () => null,
) => {
  let token = null;
  try {
    token = await AsyncStorage.getItem(StorageTokenKey);
  }
  catch (error) {
    alert(JSON.stringify(error))
  }
  const status = await NetInfo.fetch();

  if (status && !status.isConnected) {
    Alert.alert('No internet connection');
    return errorCallback({ msg: 'No internet connection' });
  }

  fetch('https://www.care-steps.com' + url, {
    method: 'POST',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: data,
  })
  .then(response => {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return response.json().then(data => data.status === 'fail' ? errorCallback(data) : successCallback(data));
    } else {
      return response.text().then(data => response.status === STATUS_OK ? successCallback(data) : errorCallback(data));
    }
  })
  .catch(error => alert(error));
};
