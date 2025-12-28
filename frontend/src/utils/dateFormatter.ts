import { format, isToday, isYesterday, parseISO } from 'date-fns';

/**
 * Format timestamp for message display (WhatsApp style)
 * - If today: Show time only (e.g., "10:30 AM")
 * - If yesterday: Show "Yesterday"
 * - Otherwise: Show date (e.g., "12/28/2025")
 */
export const formatMessageTime = (timestamp: string): string => {
  try {
    const date = parseISO(timestamp);
    
    if (isToday(date)) {
      return format(date, 'h:mm a'); // "10:30 AM"
    }
    
    if (isYesterday(date)) {
      return 'Yesterday';
    }
    
    return format(date, 'MM/dd/yyyy'); // "12/28/2025"
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format timestamp for message bubble (time only)
 */
export const formatBubbleTime = (timestamp: string): string => {
  try {
    const date = parseISO(timestamp);
    return format(date, 'h:mm a'); // "10:30 AM"
  } catch (error) {
    console.error('Error formatting bubble time:', error);
    return '';
  }
};

/**
 * Format timestamp for chat header (last seen)
 */
export const formatLastSeen = (timestamp: string): string => {
  try {
    const date = parseISO(timestamp);
    
    if (isToday(date)) {
      return `today at ${format(date, 'h:mm a')}`;
    }
    
    if (isYesterday(date)) {
      return `yesterday at ${format(date, 'h:mm a')}`;
    }
    
    return format(date, 'MM/dd/yyyy'); // "12/28/2025"
  } catch (error) {
    console.error('Error formatting last seen:', error);
    return 'recently';
  }
};