import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Habit } from '../types';

// Configure how notifications are handled when the app is running
// Wrap in try-catch to handle Expo Go limitations gracefully
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch (error) {
  console.warn('Notification handler setup failed (this is normal in Expo Go):', error);
}

const webNotificationTimers = new Map<string, number>();

const getWebNotification = () => (globalThis as any).Notification as any;

const clearWebNotificationTimer = (id: string) => {
  const timerId = webNotificationTimers.get(id);
  if (timerId !== undefined) {
    (globalThis as any).clearTimeout(timerId);
    webNotificationTimers.delete(id);
  }
};

const showWebNotification = async (title: string, body: string, data?: Record<string, string>) => {
  const WebNotification = getWebNotification();
  if (!WebNotification) {
    return false;
  }

  try {
    new WebNotification(title, { body, data });
    return true;
  } catch (error) {
    console.warn('Error showing web notification:', error);
  }

  try {
    const navigatorRef = (globalThis as any).navigator;
    if (navigatorRef?.serviceWorker?.getRegistration) {
      const registration = await navigatorRef.serviceWorker.getRegistration();
      if (registration?.showNotification) {
        await registration.showNotification(title, { body, data });
        return true;
      }
    }
  } catch (error) {
    console.warn('Error showing web notification via service worker:', error);
  }
  return false;
};

const scheduleWebNotification = (
  id: string,
  title: string,
  body: string,
  getNextTrigger: () => Date,
  data?: Record<string, string>
) => {
  const WebNotification = getWebNotification();
  if (!WebNotification) {
    return null;
  }

  const scheduleNext = () => {
    const nextTrigger = getNextTrigger();
    const delay = Math.max(0, nextTrigger.getTime() - Date.now());

    const timeoutId = (globalThis as any).setTimeout(async () => {
      await showWebNotification(title, body, data);
      scheduleNext();
    }, delay);

    webNotificationTimers.set(id, timeoutId);
  };

  scheduleNext();
  return id;
};

const getNextDailyTrigger = (reminderTime: Date) => {
  const now = new Date();
  const next = new Date(now);
  next.setHours(reminderTime.getHours(), reminderTime.getMinutes(), 0, 0);
  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }
  return next;
};

const getNextWeeklyTrigger = (reminderTime: Date, weekday: number) => {
  const now = new Date();
  const next = new Date(now);
  next.setHours(reminderTime.getHours(), reminderTime.getMinutes(), 0, 0);

  const normalizedWeekday = weekday % 7; // 7 -> 0 (Sunday)
  const currentDay = next.getDay();
  let daysAhead = (normalizedWeekday - currentDay + 7) % 7;
  if (daysAhead === 0 && next <= now) {
    daysAhead = 7;
  }
  next.setDate(next.getDate() + daysAhead);
  return next;
};

export class NotificationService {
  static getWebDiagnostics(): {
    hasNotificationApi: boolean;
    permission: string;
    isSecureContext: boolean;
    hasServiceWorker: boolean;
    visibilityState: string;
  } | null {
    if (Platform.OS !== 'web') {
      return null;
    }

    const WebNotification = (globalThis as any).Notification;
    const permission = WebNotification?.permission ?? 'unknown';
    const navigatorRef = (globalThis as any).navigator;
    const hasServiceWorker = Boolean(navigatorRef?.serviceWorker);
    const visibilityState = (globalThis as any).document?.visibilityState ?? 'unknown';
    return {
      hasNotificationApi: Boolean(WebNotification),
      permission,
      isSecureContext: Boolean((globalThis as any).isSecureContext),
      hasServiceWorker,
      visibilityState,
    };
  }

  static async getPermissionStatus(): Promise<'granted' | 'denied' | 'undetermined' | 'unavailable'> {
    try {
      if (Platform.OS === 'web') {
        const WebNotification = (globalThis as any).Notification;
        if (!WebNotification) {
          return 'unavailable';
        }
        const permission = WebNotification.permission as NotificationPermission | undefined;
        if (permission === 'granted') return 'granted';
        if (permission === 'denied') return 'denied';
        return 'undetermined';
      }

      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted' ? 'granted' : status === 'denied' ? 'denied' : 'undetermined';
    } catch (error) {
      console.warn('Error getting notification permission status:', error);
      return 'unavailable';
    }
  }

  static async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      const WebNotification = getWebNotification();
      if (!WebNotification) {
        console.warn('Web Notifications API is not available in this browser.');
        return false;
      }

      const permission = await WebNotification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Web notification permission not granted.');
        return false;
      }

      return true;
    }

    if (!Device.isDevice && Platform.OS !== 'web') {
      console.log('Using an emulator: Push Notifications (FCM/APNS) may not work, but local notifications might.');
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get notification permissions!');
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('habit-reminders', {
        name: 'Habit Reminders',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }

    return true;
  }

  static async scheduleHabitReminder(habit: Habit, reminderTime: Date): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      if (Platform.OS === 'web') {
        const id = `web-daily-${habit.id}`;
        clearWebNotificationTimer(id);
        return scheduleWebNotification(
          id,
          'Habit Reminder',
          `Time to work on: ${habit.name}`,
          () => getNextDailyTrigger(reminderTime),
          { habitId: habit.id }
        );
      }

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Habit Reminder',
          body: `Time to work on: ${habit.name}`,
          data: { habitId: habit.id },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: reminderTime.getHours(),
          minute: reminderTime.getMinutes(),
          repeats: true,
          channelId: 'habit-reminders',
        },
      });

      return identifier;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  static async sendTestNotification(): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return false;
      }

      if (Platform.OS === 'web') {
        const WebNotification = getWebNotification();
        if (!WebNotification) {
          return false;
        }
        return await showWebNotification('Test Notification', 'Notifications are working correctly.');
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test Notification',
          body: 'Notifications are working correctly.',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
          channelId: 'habit-reminders',
        },
        trigger: null, // Send immediately
      });

      return true;
    } catch (error) {
      console.error('Error sending test notification:', error);
      return false;
    }
  }

  static async sendTestNotificationAfterDelay(seconds: number = 10): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return false;
      }

      if (Platform.OS === 'web') {
        const WebNotification = getWebNotification();
        if (!WebNotification) {
          return false;
        }
        (globalThis as any).setTimeout(async () => {
          await showWebNotification('Test Notification', 'This was scheduled a few seconds ago.');
        }, Math.max(0, seconds) * 1000);
        return true;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test Notification',
          body: 'This was scheduled a few seconds ago.',
          channelId: 'habit-reminders',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: Math.max(1, Math.floor(seconds)),
          repeats: false,
          channelId: 'habit-reminders',
        },
      });

      return true;
    } catch (error) {
      console.error('Error scheduling test notification:', error);
      return false;
    }
  }

  static async cancelHabitReminder(notificationId: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        clearWebNotificationTimer(notificationId);
        return;
      }
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  static async cancelAllHabitReminders(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        webNotificationTimers.forEach((_, id) => clearWebNotificationTimer(id));
        return;
      }
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  static async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      if (Platform.OS === 'web') {
        return [];
      }
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  static async scheduleWeeklyReminder(habit: Habit, reminderTime: Date, weekday: number): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      if (Platform.OS === 'web') {
        const id = `web-weekly-${habit.id}-${weekday}`;
        clearWebNotificationTimer(id);
        return scheduleWebNotification(
          id,
          'Weekly Habit Reminder',
          `Don't forget: ${habit.name}`,
          () => getNextWeeklyTrigger(reminderTime, weekday),
          { habitId: habit.id }
        );
      }

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Weekly Habit Reminder',
          body: `Don't forget: ${habit.name}`,
          data: { habitId: habit.id },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: weekday,
          hour: reminderTime.getHours(),
          minute: reminderTime.getMinutes(),
          repeats: true,
          channelId: 'habit-reminders',
        },
      });

      return identifier;
    } catch (error) {
      console.error('Error scheduling weekly notification:', error);
      return null;
    }
  }

  static async rescheduleHabitReminders(habits: Habit[]): Promise<void> {
    // Cancel all existing notifications
    await this.cancelAllHabitReminders();

    // Schedule new notifications for habits with reminders enabled
    for (const habit of habits) {
      if (habit.reminderTime) {
        if (habit.frequency === 'weekly') {
          // For weekly habits, schedule for specific days
          const days = habit.customFrequency?.specificDays || [1]; // Default to Monday
          for (const day of days) {
            await this.scheduleWeeklyReminder(habit, new Date(habit.reminderTime), day);
          }
        } else {
          // For daily habits
          await this.scheduleHabitReminder(habit, new Date(habit.reminderTime));
        }
      }
    }
  }
}

export default NotificationService;
