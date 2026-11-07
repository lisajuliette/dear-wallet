import {
  CHECKIN_NOTIFICATION_ID,
  parseCheckinTime,
  syncWeeklyCheckin,
  toExpoWeekday,
} from '@/features/settings/notifications';

describe('notifications helpers', () => {
  it('maps schema Sunday=0 to Expo weekday 1', () => {
    expect(toExpoWeekday(0)).toBe(1);
    expect(toExpoWeekday(6)).toBe(7);
  });

  it('parses check-in time', () => {
    expect(parseCheckinTime('19:00')).toEqual({ hour: 19, minute: 0 });
    expect(parseCheckinTime('9:30')).toEqual({ hour: 9, minute: 30 });
  });

  it('cancels without scheduling when disabled', async () => {
    const cancelAsync = jest.fn(async () => undefined);
    const scheduleAsync = jest.fn(async () => 'id');
    const result = await syncWeeklyCheckin({
      enabled: false,
      weekday: 0,
      time: '19:00',
      cancelAsync,
      scheduleAsync,
      getPermissionsAsync: jest.fn(async () => ({ status: 'granted' })) as never,
      requestPermissionsAsync: jest.fn() as never,
    });
    expect(cancelAsync).toHaveBeenCalledWith(CHECKIN_NOTIFICATION_ID);
    expect(scheduleAsync).not.toHaveBeenCalled();
    expect(result.scheduled).toBe(false);
  });

  it('requests permission then schedules weekly trigger when enabling', async () => {
    const cancelAsync = jest.fn(async () => undefined);
    const scheduleAsync = jest.fn(async () => 'id');
    const getPermissionsAsync = jest.fn(async () => ({ status: 'undetermined' }));
    const requestPermissionsAsync = jest.fn(async () => ({ status: 'granted' }));

    const result = await syncWeeklyCheckin({
      enabled: true,
      weekday: 0,
      time: '19:00',
      cancelAsync,
      scheduleAsync,
      getPermissionsAsync: getPermissionsAsync as never,
      requestPermissionsAsync: requestPermissionsAsync as never,
    });

    expect(requestPermissionsAsync).toHaveBeenCalled();
    expect(scheduleAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        identifier: CHECKIN_NOTIFICATION_ID,
        trigger: expect.objectContaining({
          weekday: 1,
          hour: 19,
          minute: 0,
        }),
      }),
    );
    expect(result.scheduled).toBe(true);
  });
});
