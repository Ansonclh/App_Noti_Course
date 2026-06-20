import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, FlatList, Alert, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';
const App = () => {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [db,setDb] = useState(null);
  const loadDB = async ()=>{
    setDb(await SQLite.openDatabaseAsync('notes.db'))
    if(db != null) {
      await db.runAsync(
        'CREATE TABLE IF NOT EXISTS Notes (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT);',
        [],
        () => console.log('Table created successfully'),
        (_, error) => console.log('Error in creating table:', error)
      );
  }
  }
  useEffect(() => {
    loadDB().then(()=>{
      fetchNotes();
    });
  }, [note, notes]);
  
  const fetchNotes = async () => {
      if(db != null) {
        const allRows = await db.getAllAsync('SELECT * FROM Notes');
        let updateNotes = []
        for (const row of allRows) {
          updateNotes.push({"id":row.id, "content":row.content});
        }
        setNotes(updateNotes);
      }
  };
  const addNote = async () => {
    if (!note.trim()) {
      Alert.alert('Please enter a note');
      return;
    }
    db.runAsync('INSERT INTO Notes (content) VALUES (?);',
        [note]).then((output)=>{
          fetchNotes();
        });
    setNote('');
  };
  const deleteNote = (id) => {
      db.runAsync(
        'DELETE FROM Notes WHERE id = ?;',
        id,
        (_, result) => {
          console.log('Note deleted:', result);
        },
        (_, error) => console.log('Error deleting note:', error)
      ).then(async ()=>{
        await fetchNotes();
      })
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reminder Notes</Text>
      <TextInput
        style={styles.input}
        placeholder="Write a note"
        value={note}
        onChangeText={setNote}
      />
      <Pressable  style={styles.button} onPressIn={addNote}>
      <Text style={styles.buttonText}>Add Note</Text>
      </Pressable>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>{item.content}</Text>
            <Pressable style={styles.button} onPressIn={() => deleteNote(item.id)}>
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 25
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  noteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginTop: 10,
  },
  noteText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: 'purple',
    color:'white',
    alignItems:'center',
    justifyContent: 'center',
    height: 50,
    margin:10
  },
  buttonText: {
    color:'white',
    fontSize:20,
    alignSelf: 'center'
  }
});
export default App;