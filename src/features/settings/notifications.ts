import * as Notifications from 'expo-notifications';

export const CHECKIN_NOTIFICATION_ID = 'dear-wallet-weekly-checkin';

/** Rotating weekly check-in lines from COPY.md — never guilt-based. */
export const CHECKIN_COPY = [
  'psst. anything tempt u this week?',
  'ur diary misses ur gossip ♡',
  "tiny check-in: how's ur wallet feeling?",
  "one nvm this week? that's a win.",
] as const;

/** Schema weekday 0=Sunday … 6=Saturday → Expo WEEKLY 1=Sunday … 7=Saturday. */
export function toExpoWeekday(schemaWeekday: number): number {
  const clamped = ((schemaWeekday % 7) + 7) % 7;
  return clamped + 1;
}

export function parseCheckinTime(time: string): { hour: number; minute: number } {
  const [h = '19', m = '00'] = time.split(':');
  const hour = Math.min(23, Math.max(0, Number.parseInt(h, 10) || 19));
  const minute = Math.min(59, Math.max(0, Number.parseInt(m, 10) || 0));
  return { hour, minute };
}

export function pickCheckinBody(at: Date = new Date()): string {
  const index = at.getUTCDate() % CHECKIN_COPY.length;
  return CHECKIN_COPY[index] ?? CHECKIN_COPY[0];
}

export type ScheduleCheckinInput = {
  enabled: boolean;
  weekday: number;
  time: string;
  /** Injected for tests. */
  scheduleAsync?: typeof Notifications.scheduleNotificationAsync;
  cancelAsync?: typeof Notifications.cancelScheduledNotificationAsync;
  requestPermissionsAsync?: typeof Notifications.requestPermissionsAsync;
  getPermissionsAsync?: typeof Notifications.getPermissionsAsync;
};

/**
 * Cancel then (if enabled) schedule one weekly local notification.
 * Asks permission only when enabling and permission is not already granted.
 */
export async function syncWeeklyCheckin(input: ScheduleCheckinInput): Promise<{
  scheduled: boolean;
  permissionGranted: boolean;
}> {
  const cancel =
    input.cancelAsync ?? Notifications.cancelScheduledNotificationAsync.bind(Notifications);
  const schedule =
    input.scheduleAsync ?? Notifications.scheduleNotificationAsync.bind(Notifications);
  const requestPerms =
    input.requestPermissionsAsync ?? Notifications.requestPermissionsAsync.bind(Notifications);
  const getPerms =
    input.getPermissionsAsync ?? Notifications.getPermissionsAsync.bind(Notifications);

  await cancel(CHECKIN_NOTIFICATION_ID);

  if (!input.enabled) {
    return { scheduled: false, permissionGranted: false };
  }

  let permission = await getPerms();
  if (permission.status !== 'granted') {
    permission = await requestPerms();
  }
  if (permission.status !== 'granted') {
    return { scheduled: false, permissionGranted: false };
  }

  const { hour, minute } = parseCheckinTime(input.time);
  await schedule({
    identifier: CHECKIN_NOTIFICATION_ID,
    content: {
      title: 'Dear Wallet',
      body: pickCheckinBody(),
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: toExpoWeekday(input.weekday),
      hour,
      minute,
    },
  });

  return { scheduled: true, permissionGranted: true };
}
