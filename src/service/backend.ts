// apiService.ts
import axios from 'axios';
import { Message } from '../components/ChatUtils';
import Snackbar from 'react-native-snackbar';
import Config from 'react-native-config';

const Url = `${Config.REACT_APP_BASE_URL}`

const Base_URL = Url;
const API_URL_VERIFY = `${Base_URL}api/auth`;
const API_URL = `${Base_URL}api/data`;
const API_URL_RESPONSE = `${Base_URL}api/response`;

export const saveMessages = async (messages: any[], uniqueId: string, victimName: string, caseNumber: string) => {
  let d = new Date();
  const dateString = d.toDateString();
  try {
    const data = { "unique_id": uniqueId, "messages": messages, "date": dateString, "name": victimName, "caseNumber": caseNumber };
    console.log(data);
    await axios.post(`${API_URL}/saveData`, { data });
  } catch (error) {
    console.error('Error saving messages:', error);
    throw error;
  }
};

export const fetchMessages = async (uniqueId: string|undefined, caseNumber: string) => {
  try {
    const response = await axios.get(`${API_URL}/getData/messages`, {
      params: {
        unique_id: uniqueId,
        caseNumber: caseNumber,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const fetchCases = async (uniqueId: string|undefined) => {
  try {
    const response = await axios.get(`${API_URL}/cases`, {
      params: {
        unique_id: uniqueId,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dates:', error);
    throw error;
  }
};

export const fetchResponse = async (message: Message | undefined, id: string|null) => {
  try {
    const data = [message, id];
    const response = await axios.post(`${API_URL_RESPONSE}/getResponse`, { data });
    console.log("My Res:",response.data);
    return response.data;
  } catch (error) {
    Snackbar.show({
      text: "Network Error",
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#e74c3c',
    })
    console.error('Error fetching response:', error);
    throw error;
  }
}

export const verifyUser = async (uniqueId: string|undefined) => {
  try {
    console.log('BE',uniqueId);
    const response = await axios.get(`${Base_URL}api/data/verify?unique_id=${uniqueId}`);
    console.log('BE',response.data);
    return response.data.exists;
  } catch (error) {
    console.error('Error fetching User:', error);
    throw error;
  }
};