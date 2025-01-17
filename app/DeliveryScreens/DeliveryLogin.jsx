import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
// import Svg, { Path, Circle } from 'react-native-svg';

const LoginScreen = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  // Custom illustration component
  // const LoginIllustration = () => (
  //   <Image source={require('../../assets/images/Login.png')} style={{
  //    margin:10
  //   }} />
  // );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Illustration
        <View style={styles.illustrationContainer}>
          <LoginIllustration />
          <View style={styles.personContainer}>
            <View style={styles.person} />
          </View>
        </View> */}

        {/* Login Form */}
        <KeyboardAvoidingView behavior='padding' style={styles.formContainer}>
          <Text style={styles.title}>Sign In / Login</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile number</Text>
            <TextInput
              style={styles.input}
              placeholder="username"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('DeliveryTab')} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>
              Forgot Password / Register
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  illustrationContainer: {
    height: Dimensions.get('window').height * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    margin : 40
  },
  formContainer: {
    flex: 1,
    justifyContent : 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FF6B6B',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333333',
  },
  loginButton: {
    height: 50,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    marginTop: 16,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#666666',
    fontSize: 14,
  },
});

export default LoginScreen;