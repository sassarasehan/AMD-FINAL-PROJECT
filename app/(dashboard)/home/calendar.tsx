import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Modal, 
  TextInput, 
  Platform 
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const CalendarScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [eventText, setEventText] = useState('');
  const [currentSelectedDate, setCurrentSelectedDate] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    if (!Device.isDevice) {
      Alert.alert('Must use physical device for Push Notifications');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Permission Required', 
        'Push notifications are needed to remind you of events.'
      );
      return;
    }

    // For Android, set notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#667eea',
      });
    }
  };

  const handleDayPress = (day: DateData) => {
    const selectedDateObj = new Date(day.dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if selected date is in the past
    if (selectedDateObj < today) {
      Alert.alert('Invalid Date', 'Please select a current or future date.');
      return;
    }

    setSelectedDate(day.dateString);
    setCurrentSelectedDate(day.dateString);
    
    // Show custom modal instead of Alert.prompt for cross-platform compatibility
    setModalVisible(true);
  };

  const handleAddEvent = async () => {
    if (eventText.trim()) {
      try {
        // Mark the date with an event
        const newMarkedDates = {
          ...markedDates,
          [currentSelectedDate]: {
            selected: true,
            marked: true,
            selectedColor: '#667eea',
            dotColor: 'white'
          }
        };
        setMarkedDates(newMarkedDates);
        
        // Schedule notification
        await schedulePushNotification(currentSelectedDate, eventText.trim());
        
        // Reset and close modal
        setEventText('');
        setModalVisible(false);
        
        Alert.alert('Success', 'Event added and notification scheduled!');
      } catch (error) {
        console.error('Error adding event:', error);
        Alert.alert('Error', 'Failed to add event. Please try again.');
      }
    } else {
      Alert.alert('Invalid Input', 'Please enter an event description.');
    }
  };

  const schedulePushNotification = async (dateString: string, eventText: string) => {
    try {
      // Parse the date string properly
      const [year, month, day] = dateString.split('-').map(Number);
      const notificationDate = new Date(year, month - 1, day, 9, 0, 0); // Set to 9 AM
      
      // Ensure the notification is scheduled for future time
      const now = new Date();
      if (notificationDate <= now) {
        // If 9 AM has passed today, schedule for tomorrow 9 AM
        notificationDate.setDate(notificationDate.getDate() + 1);
      }
      
      // Calculate the delay in milliseconds from now
      const delayMs = notificationDate.getTime() - now.getTime();
      
      // Use trigger with timestamp for future scheduling
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Financial Reminder 💰",
          body: eventText,
          data: { 
            dateString: dateString,
            eventText: eventText
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_STAMP,
          timestamp: notificationDate.getTime(),
        },
      });
      
      console.log('Notification scheduled with ID:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    setEventText('');
    setModalVisible(false);
  };

  // Test function for immediate notification
  const testNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Test Notification",
          body: "This is a test notification from your financial calendar",
        },
        trigger: null, // Show immediately
      });
      Alert.alert('Success', 'Test notification sent!');
    } catch (error) {
      console.error('Error sending test notification:', error);
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  // Test function for delayed notification (5 seconds)
  const testDelayedNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Delayed Test",
          body: "This notification was scheduled 5 seconds ago",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIMESTAMP,
          timestamp: Date.now() + 5000, // 5 seconds from now
        },
      });
      Alert.alert('Success', 'Delayed notification scheduled! It will appear in 5 seconds.');
    } catch (error) {
      console.error('Error scheduling delayed notification:', error);
      Alert.alert('Error', 'Failed to schedule delayed notification');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Financial Calendar</Text>
      
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: '#667eea',
          todayTextColor: '#667eea',
          arrowColor: '#667eea',
          dotColor: '#667eea',
          selectedDotColor: 'white',
        }}
        minDate={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
      />
      
      {selectedDate && (
        <View style={styles.selectedDateContainer}>
          <Text style={styles.selectedDateText}>
            Selected: {new Date(selectedDate).toDateString()}
          </Text>
        </View>
      )}

      {/* Test buttons for notifications */}
      <View style={styles.testContainer}>
        <TouchableOpacity style={styles.testButton} onPress={testNotification}>
          <Text style={styles.testButtonText}>Test Notification</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.delayedTestButton} onPress={testDelayedNotification}>
          <Text style={styles.testButtonText}>Test in 5s</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Modal for Event Input */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Financial Event</Text>
            <Text style={styles.modalSubtitle}>
              Date: {new Date(currentSelectedDate).toDateString()}
            </Text>
            
            <TextInput
              style={styles.textInput}
              placeholder="Enter event description..."
              value={eventText}
              onChangeText={setEventText}
              multiline={true}
              numberOfLines={3}
              autoFocus={true}
            />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.addButton]} 
                onPress={handleAddEvent}
              >
                <Text style={styles.addButtonText}>Add Event</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#111827',
  },
  selectedDateContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedDateText: {
    fontSize: 16,
    color: '#374151',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  addButton: {
    backgroundColor: '#667eea',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  testContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 16,
    gap: 10,
  },
  testButton: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  delayedTestButton: {
    backgroundColor: '#f59e0b',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  testButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default CalendarScreen;