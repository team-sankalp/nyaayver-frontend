// AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from './AuthService';
import Snackbar from 'react-native-snackbar';

interface AuthContextType {
  userToken: string | null;
  login: (id: string, password: string) => Promise<void>;
  signup: (id: string, password: string, name: string, mobileNo: string, policeStaitionId: string) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
}

export const AuthContext = createContext<AuthContextType>(
  {
    userToken: null,
    login: async () => {},
    signup: async () => {},
    logout: async () => {},
    getCurrentUser: async () => null,
  }
);

interface User {
  unique_id: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<User | null>(null);

  const login = async (id: string, password: string) => {
    try {
      const response = await AuthService.login({ id, password });
      const token = response.token;
      await AsyncStorage.setItem('userToken', token);
      setUserToken(token);
    } catch (error) {
      console.error('Login failed:', error);
      Snackbar.show({
        text: "Wrong Id or Password",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#e74c3c',
      })
    }
  };


  const signup = async (id: string, password: string, name: string, mobileNo: string, policeStaitionId: string) => {
    try {
      console.log({ id, password, name, mobileNo, policeStaitionId });
      const response = await AuthService.signup({ id, password, name, mobileNo, policeStaitionId });
      const token = response.token;
      await AsyncStorage.setItem('userToken', token);
      setUserToken(token);
    } catch (error) {
      console.error('Signup failed:', error);
      Snackbar.show({
        text: "Signup Failed",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#e74c3c',
      })
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setUserToken(null);
  };

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setUserToken(token);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const fetchUserDetails = async (token: string) => {
    try {
      const userData = await AuthService.getUserDetails(token);
      setUserDetails(userData);
      return userData;
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      return null;
    }
  };

  const getCurrentUser = async (): Promise<User | null> => {
    if (userDetails) {
      return {unique_id:  userDetails.unique_id};
    }
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const userData = await fetchUserDetails(token);
        return {unique_id:  userData.unique_id};
      }
    } catch (error) {
      console.error('Error retrieving current user:', error);
    }
    return null;
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, login, signup, logout, getCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
