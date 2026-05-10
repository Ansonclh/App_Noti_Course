// App.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import messaging from '@react-native-firebase/messaging';

// Note: Firebase is automatically initialized via google-services.json in Android
// Background message handler is registered in index.js

const App = () => {
  const [fcmToken, setFcmToken] = useState('');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Request permission for notifications
    requestUserPermission();

    // Get FCM token
    messaging()
      .getToken()
      .then(token => {
        console.log('FCM Token:', token);
        setFcmToken(token);
      })
      .catch(err => console.log('Error getting FCM token:', err));

    // Handle foreground messages
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification received:', remoteMessage);
      setNotifications(prev => [
        ...prev,
        {
          title: remoteMessage.notification?.title || 'No Title',
          body: remoteMessage.notification?.body || 'No Body',
          time: new Date().toLocaleTimeString()
        }
      ]);
    });

    // Handle initial notification (app opened from quit state via notification)
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened by notification:', remoteMessage);
          setNotifications(prev => [
            ...prev,
            {
              title: remoteMessage.notification?.title || 'No Title',
              body: remoteMessage.notification?.body || 'No Body',
              time: new Date().toLocaleTimeString()
            }
          ]);
        }
      });

    // Cleanup listener on unmount
    return () => {
      unsubscribeForeground();
    };
  }, []);

  const requestUserPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Notification permission granted');
      }
    } catch (error) {
      console.log('Permission request error:', error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
      <View style={{ marginVertical: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
          Firebase Messaging App
        </Text>
        <Text style={{ fontSize: 12, color: '#666', marginBottom: 15 }}>
          Your FCM Token:
        </Text>
        <Text 
          style={{ 
            fontSize: 11, 
            backgroundColor: '#fff', 
            padding: 10, 
            borderRadius: 5,
            fontFamily: 'monospace',
            marginBottom: 20
          }}
          selectable={true}
        >
          {fcmToken || 'Loading...'}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 10 }}>
          Received Notifications ({notifications.length}):
        </Text>
        {notifications.map((notif, index) => (
          <View
            key={index}
            style={{
              backgroundColor: '#fff',
              padding: 12,
              marginBottom: 10,
              borderRadius: 5,
              borderLeftWidth: 4,
              borderLeftColor: '#4CAF50'
            }}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 12 }}>
              {notif.title}
            </Text>
            <Text style={{ fontSize: 11, color: '#666', marginVertical: 5 }}>
              {notif.body}
            </Text>
            <Text style={{ fontSize: 10, color: '#999' }}>
              {notif.time}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default App;