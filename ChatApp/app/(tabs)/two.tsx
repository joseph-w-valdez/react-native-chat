import React, { useEffect, useState } from 'react';
import { StyleSheet, Button } from 'react-native';
import { Text, View } from '../../components/Themed';
import { getAuth, User,  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, Auth, UserCredential } from 'firebase/auth';

import app from '../firebaseConfig';

export default function TabTwoScreen() {
  const [user, setUser] = useState<User | null>(null);
  const auth: Auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleSignUp = async () => {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, 'test@example.com', 'password');
      const newUser = userCredential.user;
      setUser(newUser);
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, 'test@example.com', 'password');
      const signedInUser = userCredential.user;
      setUser(signedInUser);
    } catch (error) {
      console.error('Error signing in:', error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      {user ? (
        <Button onPress={handleSignOut} title='Log out' />
      ) : (
        <>
          <Button onPress={handleSignUp} title='Register' />
          <Button onPress={handleSignIn} title='Login' />
        </>
      )}
      <Button onPress={() => console.log('Forgot password?')} title='Forgot password?' />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
