import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, fontSize, borderRadius } from '../theme/spacing';
import { formatBubbleTime } from '../utils/dateFormatter';

interface MessageBubbleProps {
  message: string;
  sender: string;
  timestamp: string;
  isOwnMessage: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  sender,
  timestamp,
  isOwnMessage,
}) => {
  return (
    <View
      style={[
        styles.container,
        isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isOwnMessage ? styles.ownMessage : styles.otherMessage,
        ]}
      >
        {!isOwnMessage && <Text style={styles.senderName}>{sender}</Text>}
        
        <Text
          style={[
            styles.messageText,
            isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
          ]}
        >
          {message}
        </Text>
        
        <View style={styles.timestampContainer}>
          <Text
            style={[
              styles.timestamp,
              isOwnMessage ? styles.ownTimestamp : styles.otherTimestamp,
            ]}
          >
            {formatBubbleTime(timestamp)}
          </Text>
          
          {isOwnMessage && (
            <View style={styles.checkmarks}>
              <Text style={styles.checkmark}>✓✓</Text>
            </View>
          )}
        </View>
      </View>
      
      <View
        style={[
          styles.bubbleTail,
          isOwnMessage ? styles.ownTail : styles.otherTail,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    marginHorizontal: spacing.sm,
    maxWidth: '80%',
  },
  ownMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    position: 'relative',
  },
  ownMessage: {
    backgroundColor: colors.sentMessage,
  },
  otherMessage: {
    backgroundColor: colors.receivedMessage,
  },
  senderName: {
    fontSize: fontSize.xs,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  messageText: {
    fontSize: fontSize.md,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  ownMessageText: {
    color: colors.textPrimary,
  },
  otherMessageText: {
    color: colors.textPrimary,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.xs,
  },
  timestamp: {
    fontSize: fontSize.xs,
    marginRight: spacing.xs,
  },
  ownTimestamp: {
    color: colors.textSecondary,
  },
  otherTimestamp: {
    color: colors.textLight,
  },
  checkmarks: {
    marginLeft: spacing.xs,
  },
  checkmark: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: 'bold',
  },
  bubbleTail: {
    position: 'absolute',
    bottom: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
  },
  ownTail: {
    right: -6,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.sentMessage,
  },
  otherTail: {
    left: -6,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.receivedMessage,
  },
});