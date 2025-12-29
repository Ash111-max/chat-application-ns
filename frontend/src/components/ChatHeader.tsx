import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, fontSize } from '../theme/spacing';

interface ChatHeaderProps {
  onlineUsers?: number;
  onLogout: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onlineUsers = 1, 
  onLogout 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarEmoji}>💬</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Chat Room</Text>
          <View style={styles.statusContainer}>
            <View style={styles.onlineIndicator} />
            <Text style={styles.subtitle}>
              {onlineUsers} {onlineUsers === 1 ? 'user' : 'users'} online
            </Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
        <Text style={styles.logoutEmoji}>🚪</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarEmoji: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.online,
    marginRight: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  logoutButton: {
    padding: spacing.sm,
  },
  logoutEmoji: {
    fontSize: 24,
  },
});