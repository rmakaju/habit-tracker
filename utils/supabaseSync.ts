import { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { SyncPayload } from './storage';

export interface SyncStorageAdapter {
  getSyncPayload: () => SyncPayload;
  applySyncPayload: (payload: SyncPayload) => void;
  setLastSyncedAt: (date: string | null) => void;
}

export class SupabaseSync {
  private session: Session | null = null;

  async initialize(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.warn('Supabase session error:', error.message);
    }
    this.session = data.session || null;
    return this.session;
  }

  onAuthStateChange(callback: (session: Session | null) => void): () => void {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      this.session = session;
      callback(session);
    });

    return () => subscription.unsubscribe();
  }

  isSignedIn(): boolean {
    return Boolean(this.session?.user);
  }

  getUserEmail(): string | null {
    return this.session?.user?.email ?? null;
  }

  async signInWithPassword(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  }

  async signUpWithPassword(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  async syncNow(storage: SyncStorageAdapter): Promise<{ action: 'pulled' | 'pushed' | 'noop' }>{
    if (!this.session?.user) return { action: 'noop' };

    const localPayload = storage.getSyncPayload();
    const userId = this.session.user.id;

    const { data: remoteRow, error } = await supabase
      .from('user_data')
      .select('data, updated_at')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    if (!remoteRow?.data) {
      await this.pushPayload(localPayload);
      storage.setLastSyncedAt(new Date().toISOString());
      return { action: 'pushed' };
    }

    const remotePayload = this.normalizeRemotePayload(remoteRow.data, remoteRow.updated_at);
    const remoteUpdatedAt = new Date(remotePayload.updatedAt).getTime();
    const localUpdatedAt = new Date(localPayload.updatedAt).getTime();

    if (remoteUpdatedAt > localUpdatedAt) {
      storage.applySyncPayload(remotePayload);
      storage.setLastSyncedAt(new Date().toISOString());
      return { action: 'pulled' };
    }

    if (remoteUpdatedAt < localUpdatedAt) {
      await this.pushPayload(localPayload);
      storage.setLastSyncedAt(new Date().toISOString());
      return { action: 'pushed' };
    }

    storage.setLastSyncedAt(new Date().toISOString());
    return { action: 'noop' };
  }

  async pushPayload(payload: SyncPayload): Promise<void> {
    if (!this.session?.user) return;

    const userId = this.session.user.id;
    const { error } = await supabase
      .from('user_data')
      .upsert(
        {
          user_id: userId,
          data: payload,
          updated_at: payload.updatedAt,
        },
        { onConflict: 'user_id' }
      );

    if (error) throw new Error(error.message);
  }

  private normalizeRemotePayload(data: any, updatedAt?: string | null): SyncPayload {
    if (data?.updatedAt) {
      return data as SyncPayload;
    }

    return {
      updatedAt: updatedAt || new Date().toISOString(),
      data: {
        habits: data?.habits || [],
        entries: data?.entries || [],
        categories: data?.categories || [],
        settings: data?.settings || {
          darkMode: false,
          notifications: true,
          weekStartsOn: 'monday',
          defaultView: 'grid',
          chartColor: '#40c463',
        },
      },
    };
  }
}

export const supabaseSync = new SupabaseSync();
