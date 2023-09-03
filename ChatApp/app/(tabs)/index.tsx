import { Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';



export default function TabOneScreen() {
  const [count, setCount] = useState(0)

  return (
    <View style={styles.container}>
      <Text style={[styles.title, {marginVertical:8}]}>JK Simmons Returns</Text>
      <TouchableOpacity
        onPress={()=>setCount(count + 1)}
        style={{backgroundColor:'green', padding:6, marginVertical:8}}
      >
        <Text>Click Me!</Text>
      </TouchableOpacity>
      <Button
        onPress={() => setCount(0)}
        title='Reset Count'
      />
      <Text style={[{backgroundColor:'red', marginVertical:8, padding:6, borderRadius:2}]}>You clicked {count} times!</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
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
