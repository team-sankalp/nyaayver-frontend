import axios from 'axios';
import Config from 'react-native-config';

const Url = `${Config.REACT_APP_BASE_URL}`
const Base_URL = Url;

const API_URL = `${Base_URL}api/auth`;

type LoginPayload = {
  id: string;
  password: string;
};

type SignupPayload = {
  id: string;
  password: string;
  name: string;
  mobileNo: string;
  policeStaitionId: string;
};

class AuthService {
  static async login({ id, password }: LoginPayload) {
    try {
      const response = await axios.post(`${API_URL}/login`, { id, password });
      return response.data; // Assuming the token is returned in response.data
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async signup({ id, password, name, mobileNo, policeStaitionId }: SignupPayload) {
    try {
      console.log({ id, password, name, mobileNo, policeStaitionId });
      const response = await axios.post(`${API_URL}/signup`, { id, password, name, mobileNo, policeStaitionId });
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  static async getUserDetails(token: string) {
    try {
      console.log("MYMY",Url)
      const response = await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.user;
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  }

}

export default AuthService;
