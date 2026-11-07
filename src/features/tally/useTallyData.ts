import { useCallback, useEffect, useState } from 'react';

import { db } from '@/db/client';
import { keptTotalCents, listKeptByRange } from '@/features/items/repository';
import type { TallyRange, TallyViewModel } from '@/features/tally/TallyScreen';
import { dayRange, monthRange, weekRange } from '@/lib/dates';
import { getLocalUserId } from '@/lib/localUser';

function boundsFor(range: TallyRange, at: Date) {
  if (range === 'day') return dayRange(at);
  if (range === 'week') return weekRange(at);
  return monthRange(at);
}

export function useTallyData(range: TallyRange, at: Date = new Date()) {
  const [vm, setVm] = useState<TallyViewModel | null>(null);

  const refresh = useCallback(async () => {
    const bounds = boundsFor(range, at);
    const [items, keptCents, savingsCents, debtCents, allTimeCents] = await Promise.all([
      listKeptByRange(db, getLocalUserId(), range, at),
      keptTotalCents(db, getLocalUserId(), bounds),
      keptTotalCents(db, getLocalUserId(), bounds, 'savings'),
      keptTotalCents(db, getLocalUserId(), bounds, 'debt'),
      keptTotalCents(db, getLocalUserId(), null),
    ]);

    setVm({
      range,
      items,
      keptCents,
      savingsCents,
      debtCents,
      allTimeCents,
    });
  }, [range, at]);

  useEffect(() => {
    const handle = setTimeout(() => {
      void refresh();
    }, 0);
    return () => clearTimeout(handle);
  }, [refresh]);

  return { vm, refresh };
}
