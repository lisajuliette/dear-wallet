import { and, count, eq, gte, isNull } from 'drizzle-orm';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { db } from '@/db/client';
import { items } from '@/db/schema';
import { GoalScreen } from '@/features/goals/GoalScreen';
import {
  archiveGoal,
  createGoal,
  getActiveGoal,
  keepCountingGoal,
  progressForGoal,
  updateGoalTarget,
} from '@/features/goals/repository';
import { LOCAL_USER_ID } from '@/lib/localUser';

type Mode = 'none' | 'name' | 'amount' | 'progress' | 'reached';

export default function GoalRoute() {
  const [mode, setMode] = useState<Mode>('none');
  const [name, setName] = useState('');
  const [targetCents, setTargetCents] = useState(0);
  const [progressCents, setProgressCents] = useState(0);
  const [startedLabel, setStartedLabel] = useState('');
  const [nvmCount, setNvmCount] = useState(0);
  const [goalId, setGoalId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const goal = await getActiveGoal(db, LOCAL_USER_ID);
    if (!goal) {
      setMode('none');
      setGoalId(null);
      setName('');
      setTargetCents(0);
      setProgressCents(0);
      return;
    }
    const progress = await progressForGoal(db, LOCAL_USER_ID, goal);
    const started = new Date(goal.startedAt);
    const nvm = db
      .select({ n: count() })
      .from(items)
      .where(
        and(
          eq(items.userId, LOCAL_USER_ID),
          eq(items.kind, 'kept'),
          isNull(items.deletedAt),
          gte(items.happenedAt, goal.startedAt),
        ),
      )
      .get();

    setGoalId(goal.id);
    setName(goal.name);
    setTargetCents(goal.targetCents);
    setProgressCents(progress);
    setStartedLabel(
      started.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
    );
    setNvmCount(Number(nvm?.n ?? 0));
    setMode(goal.reachedAt ? 'reached' : 'progress');
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return (
    <GoalScreen
      mode={mode}
      name={name}
      targetCents={targetCents}
      progressCents={progressCents}
      startedLabel={startedLabel}
      nvmCount={nvmCount}
      onBack={() => router.back()}
      onPickIdea={(idea) => {
        setName(idea);
        setMode('amount');
      }}
      onCustomName={() => setMode('name')}
      onChangeName={setName}
      onNextAmount={() => setMode('amount')}
      onConfirmAmount={async (cents) => {
        if (goalId && mode === 'amount' && name) {
          const existing = await getActiveGoal(db, LOCAL_USER_ID);
          if (existing && existing.name === name) {
            await updateGoalTarget(db, LOCAL_USER_ID, existing.id, cents);
            await refresh();
            return;
          }
        }
        await createGoal(db, LOCAL_USER_ID, name, cents);
        await refresh();
      }}
      onEdit={() => setMode('amount')}
      onSwap={async () => {
        if (goalId) await archiveGoal(db, LOCAL_USER_ID, goalId);
        setName('');
        setMode('none');
        setGoalId(null);
      }}
      onPickNew={async () => {
        if (goalId) await archiveGoal(db, LOCAL_USER_ID, goalId);
        setName('');
        setMode('none');
        setGoalId(null);
      }}
      onKeepCounting={async () => {
        if (!goalId) return;
        await keepCountingGoal(db, LOCAL_USER_ID, goalId);
        await refresh();
      }}
    />
  );
}
