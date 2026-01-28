import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  Share,
  Modal,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppSettings } from '../types';
import { NotificationService } from '../utils/notifications';
import { useTheme } from './ThemeProvider';

interface SettingsModalProps {
  visible: boolean;
  settings: AppSettings;
  onClose: () => void;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onExportData: () => string;
  onImportData: (data: string) => boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  settings,
  onUpdateSettings,
  onExportData,
}) => {
  const { theme } = useTheme();
  const [localSettings, setLocalSettings] = useState(settings);
  const [permissionStatus, setPermissionStatus] = useState('Checking...');
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [webDiagnostics, setWebDiagnostics] = useState<
    {
      hasNotificationApi: boolean;
      permission: string;
      isSecureContext: boolean;
      hasServiceWorker: boolean;
      visibilityState: string;
    } | null
  >(null);

  // Update local settings when props change
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    const loadPermissionStatus = async () => {
      const status = await NotificationService.getPermissionStatus();
      const label =
        status === 'granted'
          ? 'Granted'
          : status === 'denied'
            ? 'Denied'
            : status === 'unavailable'
              ? 'Not supported'
              : 'Not requested';
      setPermissionStatus(label);
    };

    if (visible) {
      loadPermissionStatus();
      setNotificationMessage(null);
      if (Platform.OS === 'web') {
        setWebDiagnostics(NotificationService.getWebDiagnostics());
      }
    }
  }, [visible]);

  const handleToggle = (key: keyof AppSettings) => {
    const newValue = !localSettings[key];
    const updatedSettings = { ...localSettings, [key]: newValue };
    setLocalSettings(updatedSettings);
    onUpdateSettings({ [key]: newValue });
  };

  const handleExport = async () => {
    try {
      const data = onExportData();
      await Share.share({
        message: data,
        title: 'Habit Tracker Data Export',
      });
    } catch (error) {
      Alert.alert('Export Failed', 'Could not export data');
    }
  };

  const SettingRow = ({ 
    title, 
    subtitle, 
    value, 
    onToggle, 
    type = 'switch' 
  }: { 
    title: string; 
    subtitle?: string; 
    value?: boolean; 
    onToggle?: () => void;
    type?: 'switch' | 'button';
  }) => {
    const isButton = type === 'button';
    const RowWrapper: any = isButton ? TouchableOpacity : View;
    const rowProps = isButton
      ? { onPress: onToggle, activeOpacity: 0.7, accessibilityRole: 'button' }
      : {};

    return (
      <RowWrapper
        {...rowProps}
        style={[styles.settingRow, { borderBottomColor: theme.border }]}
      >
        <View style={styles.settingInfo}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>}
        </View>
        {type === 'switch' && (
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: theme.border, true: theme.primary + '40' }}
            thumbColor={value ? theme.primary : theme.textSecondary}
          />
        )}
        {type === 'button' && (
          <View style={styles.button}>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </View>
        )}
      </RowWrapper>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Appearance</Text>
          <SettingRow
            title="Dark Mode"
            subtitle="Use dark theme throughout the app"
            value={localSettings.darkMode}
            onToggle={() => handleToggle('darkMode')}
          />
        </View>

        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Notifications</Text>
          <SettingRow
            title="Daily Reminders"
            subtitle="Get reminded to complete your habits"
            value={localSettings.notifications}
            onToggle={() => handleToggle('notifications')}
          />
          <View style={[styles.permissionRow, { borderBottomColor: theme.border }]}> 
            <Text style={[styles.permissionLabel, { color: theme.text }]}>Permission</Text>
            <Text style={[styles.permissionValue, { color: theme.textSecondary }]}>{permissionStatus}</Text>
          </View>
          <SettingRow
            title="Request permission"
            subtitle="Ask the browser or OS to allow notifications"
            type="button"
            onToggle={async () => {
              setNotificationMessage('Requesting permission...');
              const success = await NotificationService.requestPermissions();
              const status = await NotificationService.getPermissionStatus();
              const label =
                status === 'granted'
                  ? 'Granted'
                  : status === 'denied'
                    ? 'Denied'
                    : status === 'unavailable'
                      ? 'Not supported'
                      : 'Not requested';
              setPermissionStatus(label);

              if (!success) {
                if (Platform.OS === 'web') {
                  const diagnostics = NotificationService.getWebDiagnostics();
                  setNotificationMessage(`Permission not granted. API: ${diagnostics?.hasNotificationApi ? 'available' : 'missing'}, Secure: ${diagnostics?.isSecureContext ? 'yes' : 'no'}, Permission: ${diagnostics?.permission ?? 'unknown'}.`);
                  Alert.alert(
                    'Permission Not Granted',
                    `Notifications are blocked or unsupported.\n\nAPI: ${diagnostics?.hasNotificationApi ? 'available' : 'missing'}\nPermission: ${diagnostics?.permission ?? 'unknown'}\nSecure: ${diagnostics?.isSecureContext ? 'yes' : 'no'}\nVisibility: ${diagnostics?.visibilityState ?? 'unknown'}`
                  );
                } else {
                  setNotificationMessage('Permission not granted or unsupported.');
                  Alert.alert('Permission Not Granted', 'Notifications are blocked or unsupported.');
                }
              } else {
                setNotificationMessage('Permission granted. Try sending a test notification.');
                Alert.alert('Permission Granted', 'Notifications are enabled.');
              }
            }}
          />
          <SettingRow
            title="Send test notification"
            subtitle="Verify notifications are working"
            type="button"
            onToggle={async () => {
              setNotificationMessage('Sending test notification...');
              const success = await NotificationService.sendTestNotification();
              const status = await NotificationService.getPermissionStatus();
              const label =
                status === 'granted'
                  ? 'Granted'
                  : status === 'denied'
                    ? 'Denied'
                    : status === 'unavailable'
                      ? 'Not supported'
                      : 'Not requested';
              setPermissionStatus(label);

              if (!success) {
                if (Platform.OS === 'web') {
                  const diagnostics = NotificationService.getWebDiagnostics();
                  setNotificationMessage(`Test failed. API: ${diagnostics?.hasNotificationApi ? 'available' : 'missing'}, Secure: ${diagnostics?.isSecureContext ? 'yes' : 'no'}, Permission: ${diagnostics?.permission ?? 'unknown'}.`);
                  Alert.alert(
                    'Notification Failed',
                    `Permission was not granted or notifications are unsupported.\n\nAPI: ${diagnostics?.hasNotificationApi ? 'available' : 'missing'}\nPermission: ${diagnostics?.permission ?? 'unknown'}\nSecure: ${diagnostics?.isSecureContext ? 'yes' : 'no'}\nVisibility: ${diagnostics?.visibilityState ?? 'unknown'}`
                  );
                } else {
                  setNotificationMessage('Test failed. Permission not granted or unsupported.');
                  Alert.alert('Notification Failed', 'Permission was not granted or notifications are unsupported.');
                }
              } else {
                setNotificationMessage('Test sent. You should see a notification.');
                Alert.alert('Test Sent', 'A test notification was sent.');
              }
            }}
          />
          <SettingRow
            title="Send test in 10 seconds"
            subtitle="Schedules a short-delay test"
            type="button"
            onToggle={async () => {
              setNotificationMessage('Scheduling test notification...');
              const success = await NotificationService.sendTestNotificationAfterDelay(10);
              const status = await NotificationService.getPermissionStatus();
              const label =
                status === 'granted'
                  ? 'Granted'
                  : status === 'denied'
                    ? 'Denied'
                    : status === 'unavailable'
                      ? 'Not supported'
                      : 'Not requested';
              setPermissionStatus(label);

              if (!success) {
                if (Platform.OS === 'web') {
                  const diagnostics = NotificationService.getWebDiagnostics();
                  setNotificationMessage(`Schedule failed. API: ${diagnostics?.hasNotificationApi ? 'available' : 'missing'}, Secure: ${diagnostics?.isSecureContext ? 'yes' : 'no'}, Permission: ${diagnostics?.permission ?? 'unknown'}.`);
                  Alert.alert(
                    'Notification Failed',
                    `Permission was not granted or notifications are unsupported.\n\nAPI: ${diagnostics?.hasNotificationApi ? 'available' : 'missing'}\nPermission: ${diagnostics?.permission ?? 'unknown'}\nSecure: ${diagnostics?.isSecureContext ? 'yes' : 'no'}\nVisibility: ${diagnostics?.visibilityState ?? 'unknown'}`
                  );
                } else {
                  setNotificationMessage('Schedule failed. Permission not granted or unsupported.');
                  Alert.alert('Notification Failed', 'Permission was not granted or notifications are unsupported.');
                }
              } else {
                setNotificationMessage('Test scheduled. It should fire in about 10 seconds.');
                Alert.alert('Scheduled', 'A test notification will fire in about 10 seconds.');
              }
            }}
          />
          {Platform.OS === 'web' && webDiagnostics && (
            <View style={[styles.permissionRow, { borderBottomColor: theme.border }]}> 
              <Text style={[styles.permissionLabel, { color: theme.text }]}>Web Support</Text>
              <Text style={[styles.permissionValue, { color: theme.textSecondary }]}> 
                {webDiagnostics.hasNotificationApi ? 'API ✔︎' : 'API ✖︎'} · {webDiagnostics.isSecureContext ? 'Secure ✔︎' : 'Secure ✖︎'} · {webDiagnostics.hasServiceWorker ? 'SW ✔︎' : 'SW ✖︎'} · {webDiagnostics.visibilityState}
              </Text>
            </View>
          )}
          {Platform.OS === 'web' && webDiagnostics && (
            <Text style={[styles.webNote, { color: theme.textSecondary }]}> 
              {webDiagnostics.isSecureContext ? 'Secure context OK.' : 'Needs https or localhost.'} Notifications require user gesture and won’t work if blocked in browser settings.
            </Text>
          )}
          {notificationMessage && (
            <Text style={[styles.notificationMessage, { color: theme.textSecondary }]}>
              {notificationMessage}
            </Text>
          )}
        </View>

        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Data</Text>
          <SettingRow
            title="Export Data"
            subtitle="Share your habit data as JSON"
            type="button"
            onToggle={handleExport}
          />
          <SettingRow
            title="Import Data"
            subtitle="Restore data from backup"
            type="button"
            onToggle={() => Alert.alert('Import', 'Import functionality would open file picker')}
          />
        </View>

        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>About</Text>
          <SettingRow
            title="Version"
            subtitle="1.0.0"
            type="button"
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  section: {
    marginTop: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingVertical: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  permissionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  permissionValue: {
    fontSize: 14,
  },
  webNote: {
    fontSize: 12,
    fontStyle: 'italic',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  notificationMessage: {
    fontSize: 12,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 4,
  },
  button: {
    padding: 5,
  },
});
