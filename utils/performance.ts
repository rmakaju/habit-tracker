import { Alert } from 'react-native';

export class ErrorHandler {
  static logError(error: Error, context?: string) {
    console.error(`[ERROR] ${context || 'Unknown context'}:`, error);
    
    // In a production app, you would send this to a logging service
    // like Sentry, Bugsnag, or Firebase Crashlytics
  }

  static handleAsync<T>(
    asyncFunction: () => Promise<T>,
    context?: string
  ): Promise<T | null> {
    return asyncFunction().catch((error) => {
      this.logError(error, context);
      return null;
    });
  }

  static showUserError(message: string, title: string = 'Error') {
    Alert.alert(title, message, [{ text: 'OK' }]);
  }

  static handleAsyncWithUserFeedback<T>(
    asyncFunction: () => Promise<T>,
    context?: string,
    userErrorMessage?: string
  ): Promise<T | null> {
    return asyncFunction().catch((error) => {
      this.logError(error, context);
      
      if (userErrorMessage) {
        this.showUserError(userErrorMessage);
      }
      
      return null;
    });
  }
}

export class PerformanceMonitor {
  private static timers: Map<string, number> = new Map();

  static startTimer(label: string) {
    this.timers.set(label, Date.now());
  }

  static endTimer(label: string): number {
    const startTime = this.timers.get(label);
    if (!startTime) {
      console.warn(`Timer '${label}' was not started`);
      return 0;
    }

    const duration = Date.now() - startTime;
    console.log(`[PERFORMANCE] ${label}: ${duration}ms`);
    this.timers.delete(label);
    return duration;
  }

  static measureAsync<T>(
    asyncFunction: () => Promise<T>,
    label: string
  ): Promise<T> {
    this.startTimer(label);
    return asyncFunction().finally(() => {
      this.endTimer(label);
    });
  }

  static measureSync<T>(
    syncFunction: () => T,
    label: string
  ): T {
    this.startTimer(label);
    const result = syncFunction();
    this.endTimer(label);
    return result;
  }
}

export class StorageOptimizer {
  private static cache: Map<string, { data: any; timestamp: number }> = new Map();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  static setCached<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  static clearCache(): void {
    this.cache.clear();
  }

  static getWithCache<T>(
    key: string,
    fetchFunction: () => T
  ): T {
    const cached = this.getCached<T>(key);
    if (cached !== null) {
      return cached;
    }

    const fresh = fetchFunction();
    this.setCached(key, fresh);
    return fresh;
  }
}

export default {
  ErrorHandler,
  PerformanceMonitor,
  StorageOptimizer,
};
