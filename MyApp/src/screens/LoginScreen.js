import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebase_auth } from '../firebaseConfig';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const auth = firebase_auth;

  // Function to handle log in using Firebase
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

    } catch (err) {
      setError(err.message);
    }
  };

  // Simple input fields and button implementation
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <Button title="Log In" onPress={handleLogin} />

      <Text style={styles.linkText}>
        Don't have an account?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
          Sign Up
        </Text>
      </Text>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'grey',
  },
  linkText: {
    marginTop: 16,
    textAlign: 'center',
    color: 'white',
  },
  link: {
    color: '#3D5A80',
    textDecorationLine: 'underline',
  },
});

