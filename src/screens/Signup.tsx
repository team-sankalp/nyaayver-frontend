import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Platform,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Snackbar from 'react-native-snackbar';
import { AuthContext } from '../appwrite/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../routes/AuthStack';
import { verifyUser } from '../service/backend';

type SignupScreenProps = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const Signup = ({ navigation }: SignupScreenProps) => {
  const { signup } = useContext(AuthContext);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [mobileNo, setMobileNo] = useState<string>('');
  const [policeStaitionId, setPoliceStaitionId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [doSignup, setDoSignup] = useState(false);

  const handleUser = async (id: string) => {
    try {
      const response = await verifyUser(id);
      console.log(response);
      if(response){
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error verifying user:', error);
      return false;
    }
  };

  const handleSignup = async() => {
    console.log(id, password, name, mobileNo, policeStaitionId);
    if (id.length < 1 || password.length < 1) {
      setError('All fields are required');
      Snackbar.show({
        text: "All fields are required",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#e74c3c',
      })
    } else if (!isChecked) {
      setError('Please accept terms and conditions');
      Snackbar.show({
        text: "Please accept terms and conditions",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#e74c3c',
      })
    } else if (mobileNo.length < 10){
      setError('Provide valid Phone No.')
      Snackbar.show({
        text: "Provide valid Phone No.",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#e74c3c',
      })
    } else {
      setDoSignup(true);
    }
    if(doSignup){
      // const Verified = await handleUser(id);
      let Verified = true;
      console.log(Verified);
      if(Verified){
        setError('');
        signup(id, password, name, mobileNo, policeStaitionId);
      }
      else{
        setError('User is not Verified');
        Snackbar.show({
          text: "User is not Verified",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#e74c3c',
        })
      }
  }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Back Icon */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        {/* Logo */}
        <ImageBackground
          source={require('../../assets/logo.png')} // Replace with the actual logo path
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>Sign Up to Start</Text>

        {/* Input Fields */}
        <TextInput
          value={name}
          onChangeText={(text) => {
            setError('');
            setName(text);
          }}
          placeholderTextColor="#000"
          placeholder="Enter your Name"
          style={styles.input}
        />
        <TextInput
          value={id}
          onChangeText={(text) => {
            setError('');
            setId(text);
          }}
          placeholderTextColor="#000"
          placeholder="Enter your Unique ID"
          style={styles.input}
        />
        <TextInput
          value={mobileNo}
          onChangeText={(text) => {
            setError('');
            setMobileNo(text);
          }}
          placeholderTextColor="#000"
          placeholder="Enter your Phone No."
          style={styles.input}
        />
        <TextInput
          value={policeStaitionId}
          onChangeText={(text) => {
            setError('');
            setPoliceStaitionId(text);
          }}
          placeholderTextColor="#000"
          placeholder="Enter Postal Code"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={(text) => {
            setError('');
            setPassword(text);
          }}
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry={true}
          placeholderTextColor="#000"
        />

        <View style={styles.checkboxContainer}>
          <CheckBox value={isChecked} onValueChange={setIsChecked} style={styles.checkbox} />
          <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
            <Text style={styles.checkboxText}>
              I agree with the Terms of Service and Privacy policy
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleSignup}>
          <Text style={styles.createButtonText}>Create Account</Text>
        </TouchableOpacity>

        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.loginText}>Login</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD700',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  backText: {
    fontSize: 24,
    color: '#003366',
    fontWeight: 'bold',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    marginTop: 20,
    elevation: -1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 25,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#000',
    color: '#000',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxText: {
    fontSize: 14,
    color: '#000',
  },
  createButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 20,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#000',
  },
  loginText: {
    color: '#0000FF',
    fontWeight: 'bold',
  },
});

export default Signup;
