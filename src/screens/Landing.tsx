import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';
import Snackbar from 'react-native-snackbar'

// Navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../routes/AuthStack';

type LoandingScreenProps = NativeStackScreenProps<AuthStackParamList, 'Landing'>

const Landing = ({navigation}: LoandingScreenProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}> Welcome To </Text>
        <Text style={styles.title}> NYAAYVEER </Text>
      </View>
      <Text style={styles.subtitle}>Simplifying FIR Drafting with AI-Driven Legal Insight.</Text>
      <Image 
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Pressable style={styles.signupButton}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signupText}>Login</Text>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate('Signup')}
      >
      <Text style={styles.footerText}>
        Already have an account?{' '}
        <Text style={styles.loginText}>Sign up</Text>
      </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  titleContainer: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingRight: '50%',
  },
  title: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#003366',
    textAlign: 'left',
    marginBottom: 20,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 50,
    marginTop: 30,
  },
  signupButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 20,
  },
  signupText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#0000FF',
    fontWeight: 'bold',
  },
});

export default Landing;