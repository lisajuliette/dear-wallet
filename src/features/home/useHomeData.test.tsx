import { act, waitFor } from '@testing-library/react-native';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

import { createTestDatabase, type TestDatabase } from '@/db/testClient';
import { useHomeData } from '@/features/home/useHomeData';
import { createItem } from '@/features/items/repository';
import { useSettingsStore } from '@/features/rewards/settingsStore';
import { awardStar } from '@/features/rewards/stars';
import { LOCAL_USER_ID } from '@/lib/localUser';

import { renderWithTheme } from '../../../test/render';

let mockDb: TestDatabase;

jest.mock('@/db/client', () => ({
  get db() {
    return mockDb;
  },
}));

function HomeDataProbe({ onReady }: { onReady: (api: ReturnType<typeof useHomeData>) => void }) {
  const api = useHomeData();
  useEffect(() => {
    onReady(api);
  }, [api, onReady]);
  return (
    <View>
      <Text>{api.vm?.state ?? 'loading'}</Text>
      <Text>{String(api.vm?.todayCents ?? -1)}</Text>
      <Text>{String(api.vm?.starCount ?? -1)}</Text>
    </View>
  );
}

describe('useHomeData', () => {
  beforeEach(() => {
    mockDb = createTestDatabase();
    useSettingsStore.setState({ displayName: 'Jazmine' });
  });

  it('builds a first-day home model from an empty database', async () => {
    const { getByText } = await renderWithTheme(<HomeDataProbe onReady={() => {}} />);
    await waitFor(() => expect(getByText('first_day')).toBeTruthy());
  });

  it('refreshes after a kept log and star', async () => {
    let api: ReturnType<typeof useHomeData> | null = null;
    const { getByText } = await renderWithTheme(
      <HomeDataProbe
        onReady={(next) => {
          api = next;
        }}
      />,
    );
    await waitFor(() => expect(getByText('first_day')).toBeTruthy());

    await createItem(mockDb, {
      userId: LOCAL_USER_ID,
      kind: 'kept',
      name: 'matcha',
      amountCents: 620,
      happenedAt: new Date(),
    });
    awardStar(mockDb, LOCAL_USER_ID, 'log');

    await act(async () => {
      await api?.refresh();
    });

    await waitFor(() => {
      expect(getByText('620')).toBeTruthy();
      expect(getByText('1')).toBeTruthy();
    });
  });
});
