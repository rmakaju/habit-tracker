import { NativeModules, Platform } from 'react-native';
import { SyncPayload } from './storage';

const { HabitWidgetModule } = NativeModules;

const isAvailable = Platform.OS === 'android' && HabitWidgetModule;

export const widgetBridge = {
  isAvailable,
  async updateWidgetData(payload: SyncPayload) {
    if (!isAvailable) return;
    HabitWidgetModule.updateWidgetData(JSON.stringify(payload));
  },
  async requestWidgetUpdate() {
    if (!isAvailable) return;
    HabitWidgetModule.requestWidgetUpdate();
  },
  async getPendingWidgetToggles(): Promise<Array<{ habitId: string; date: string }>> {
    if (!isAvailable) return [];
    return HabitWidgetModule.getPendingWidgetToggles();
  },
  async clearPendingWidgetToggles() {
    if (!isAvailable) return;
    HabitWidgetModule.clearPendingWidgetToggles();
  },
};
