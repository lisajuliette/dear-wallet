import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { db } from '@/db/client';
import { listByMonth, listByWeek } from '@/features/items/repository';
import { buildRecap, type RecapKind, type RecapPeriod } from '@/features/recap/buildRecap';
import { RecapScreen } from '@/features/recap/RecapScreen';
import { LOCAL_USER_ID } from '@/lib/localUser';

function parsePeriod(value: string | undefined): RecapPeriod {
  return value === 'week' ? 'week' : 'month';
}

function parseKind(value: string | undefined): RecapKind {
  return value === 'loved' ? 'loved' : 'wanted';
}

export default function RecapRoute() {
  const params = useLocalSearchParams<{ period?: string; kind?: string }>();
  const [period, setPeriod] = useState<RecapPeriod>(parsePeriod(params.period));
  const [kind, setKind] = useState<RecapKind>(parseKind(params.kind));
  const [items, setItems] = useState<Awaited<ReturnType<typeof listByMonth>>>([]);
  const at = useMemo(() => new Date(), []);

  const refresh = useCallback(async () => {
    const rows =
      period === 'week'
        ? await listByWeek(db, LOCAL_USER_ID, at)
        : await listByMonth(db, LOCAL_USER_ID, at);
    setItems(rows);
  }, [at, period]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const data = useMemo(
    () =>
      buildRecap({
        period,
        kind,
        at,
        items: items.map((row) => ({
          id: row.id,
          name: row.name,
          amountCents: row.amountCents,
          happenedAt: row.happenedAt,
          kind: row.kind,
          boughtAfterAllAt: row.boughtAfterAllAt,
        })),
      }),
    [at, items, kind, period],
  );

  return (
    <RecapScreen
      data={data}
      period={period}
      kind={kind}
      onChangePeriod={setPeriod}
      onChangeKind={setKind}
      onBack={() => router.back()}
    />
  );
}
