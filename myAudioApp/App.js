import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import { useState } from 'react';
import { Audio } from 'expo-av';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);

  // Load and play the audio
  async function playSound() {
    if (sound === null) {
      // Load the sound for the first time
      const { sound: playbackObject } = await Audio.Sound.createAsync(
        require('./assets/sampleAudioForReactnative.m4a')
      );
      setSound(playbackObject);
      await playbackObject.playAsync();  // Play the sound
      setIsPlaying(true);
    } else {
      const status = await sound.getStatusAsync();
      if (status.positionMillis === status.durationMillis) {
        // If sound finished, reset and play again
        await sound.setPositionAsync(0);
        await sound.playAsync();
        setIsPlaying(true);
      } else {
        // Resume playback from where it was paused
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
