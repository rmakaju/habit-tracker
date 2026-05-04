import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeProvider';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  isBusy?: boolean;
  errorMessage?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  visible,
  onClose,
  onSignIn,
  onSignUp,
  isBusy = false,
  errorMessage = null,
}) => {
  const { theme } = useTheme();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      return;
    }

    if (mode === 'signin') {
      await onSignIn(email.trim(), password.trim());
    } else {
      await onSignUp(email.trim(), password.trim());
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: theme.background }]}> 
        <View style={[styles.header, { borderBottomColor: theme.border }]}> 
          <Text style={[styles.title, { color: theme.text }]}>Cloud Sync</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={22} color={theme.text} />
          </TouchableOpacity>
        </View>

        <View style={[styles.content, { backgroundColor: theme.surface }]}> 
          <Text style={[styles.label, { color: theme.text }]}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="none"
            keyboardType="email-address"
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          />

          <Text style={[styles.label, { color: theme.text }]}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Your password"
            placeholderTextColor={theme.textSecondary}
            secureTextEntry
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          />

          {errorMessage ? (
            <Text style={[styles.errorText, { color: '#c0392b' }]}>{errorMessage}</Text>
          ) : null}

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isBusy}
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}
          >
            {isBusy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            style={styles.secondaryButton}
          >
            <Text style={[styles.secondaryText, { color: theme.textSecondary }]}> 
              {mode === 'signin'
                ? 'Need an account? Create one'
                : 'Already have an account? Sign in'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 6,
    borderRadius: 16,
  },
  content: {
    marginTop: 24,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  primaryButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 13,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 12,
  },
});
