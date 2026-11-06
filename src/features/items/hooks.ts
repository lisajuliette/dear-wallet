import { useCallback, useEffect, useState } from 'react';

import { db } from '@/db/client';
import {
  keptTotalCents,
  listByDay,
  listByMonth,
  listByWeek,
  type Item,
} from '@/features/items/repository';
import { dayRange, monthRange, weekRange } from '@/lib/dates';
import { LOCAL_USER_ID } from '@/lib/localUser';

export type ItemsRange = 'day' | 'week' | 'month';

type KeptTotals = {
  keptCents: number;
  savingsCents: number;
  debtCents: number;
  allTimeCents: number;
};

async function loadItems(range: ItemsRange, at: Date): Promise<Item[]> {
  if (range === 'day') return listByDay(db, LOCAL_USER_ID, at);
  if (range === 'week') return listByWeek(db, LOCAL_USER_ID, at);
  return listByMonth(db, LOCAL_USER_ID, at);
}

function rangeFor(range: ItemsRange, at: Date) {
  if (range === 'day') return dayRange(at);
  if (range === 'week') return weekRange(at);
  return monthRange(at);
}

async function loadTotals(range: ItemsRange, at: Date): Promise<KeptTotals> {
  const bounds = rangeFor(range, at);
  const [keptCents, savingsCents, debtCents, allTimeCents] = await Promise.all([
    keptTotalCents(db, LOCAL_USER_ID, bounds),
    keptTotalCents(db, LOCAL_USER_ID, bounds, 'savings'),
    keptTotalCents(db, LOCAL_USER_ID, bounds, 'debt'),
    keptTotalCents(db, LOCAL_USER_ID, null),
  ]);
  return { keptCents, savingsCents, debtCents, allTimeCents };
}

/** Lists items for the local user in the given tally range. */
export function useItems(range: ItemsRange = 'day', at: Date = new Date()) {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    return loadItems(range, at).then((next) => {
      setData(next);
      setLoading(false);
    });
  }, [range, at]);

  useEffect(() => {
    const handle = setTimeout(() => {
      void refresh();
    }, 0);
    return () => clearTimeout(handle);
  }, [refresh]);

  return { items: data, loading, refresh };
}

/** Kept / side / all-time totals for the local user. */
export function useKeptTotals(range: ItemsRange = 'day', at: Date = new Date()) {
  const [totals, setTotals] = useState<KeptTotals>({
    keptCents: 0,
    savingsCents: 0,
    debtCents: 0,
    allTimeCents: 0,
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    return loadTotals(range, at).then((next) => {
      setTotals(next);
      setLoading(false);
    });
  }, [range, at]);

  useEffect(() => {
    const handle = setTimeout(() => {
      void refresh();
    }, 0);
    return () => clearTimeout(handle);
  }, [refresh]);

  return { totals, loading, refresh };
}
