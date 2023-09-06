import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Text, View } from '../../components/Themed';
import io from 'socket.io-client';
import { useUserContext } from '../../contexts/FirebaseContext';
import formatTimestamp from '../../utilities/timestamp';

export default function TabThreeScreen() {
  const { user } = useUserContext();
  const [message, setMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState<ChatMessage[]>([]);
  const socketRef = useRef<any>(null);

  interface ChatMessage {
    userId: string;
    message: string;
    time: string;
  }

  useEffect(() => {
    console.log(messageHistory);
  }, [messageHistory])

  useEffect(() => {
    if (user) {
      // Initialize the socket once when the component mounts
      socketRef.current = io('http://localhost:3000', {
        query: {
          userId: user.email,
        },
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to server.');
      });

      socketRef.current.on('message', (data: ChatMessage) => {
        const newMessage: ChatMessage = {
          userId: data.userId,
          time: data.time,
          message: data.message,
        };
        setMessageHistory((prevMessages) => [...prevMessages, newMessage]);
      });

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [user]);

  const sendMessage = () => {
    if (user && socketRef.current) {
      const timestamp = formatTimestamp(new Date());
      socketRef.current.emit('message', { userId: user.email, message, time: timestamp });
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text>{user.email}</Text>
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
      )}
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
