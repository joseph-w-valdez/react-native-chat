import { useState } from 'react';
import { StyleSheet, Button, TextInput } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useUserContext } from '../../contexts/FirebaseContext';

export default function TabTwoScreen() {
  const { user, signUp, signIn, signOut } = useUserContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    await signUp(email, password);
  };

  const handleSignIn = async () => {
    await signIn(email, password);
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text>Welcome {email}</Text>
          <Button onPress={signOut} title='Log out' />
        </>
      ) : (
        <>
          <Text>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            placeholder="Enter your name"
            onChangeText={setEmail} />
          <Text>Password:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry />
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: 200,
    color: 'white'
  },
});
