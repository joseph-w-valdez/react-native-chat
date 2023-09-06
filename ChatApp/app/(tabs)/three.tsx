import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native'; // Import ScrollView, View, and KeyboardAvoidingView
import { Text } from '../../components/Themed';
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
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Existing content */}
        <View>
          {messageHistory.map((message, index) => (
            <Text key={index}>
              {message.userId} ({message.time}): {message.message}
            </Text>
          ))}
        </View>
      </ScrollView>

      <View style={styles.fixedContainer}>
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
    </KeyboardAvoidingView>
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
    width: '100%',
    color: 'white',
    marginTop:6,
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
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end', // Content will start at the bottom
  },
  fixedContainer: {
    padding: 16,
    width: '100%',
  },
});
