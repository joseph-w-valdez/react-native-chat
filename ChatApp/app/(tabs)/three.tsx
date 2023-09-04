import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Text, View } from '../../components/Themed';
import io from 'socket.io-client';
import { useUserContext } from '../../contexts/FirebaseContext';

export default function TabThreeScreen() {
  const { user } = useUserContext();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('Connected to server.');
    });

    socket.on('message', (data: string) => {
      console.log('Received message from server:', data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    console.log(message)
    const socket = io('http://localhost:3000');
    socket.emit('message', message);
    setMessage('')
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text>Message:</Text>
          <TextInput
            style={styles.input}
            value={message}
            placeholder="Enter your message"
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.button} onPress={sendMessage}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>You are not logged in!</Text>
      )

    }

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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: 200,
    color: 'white',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
