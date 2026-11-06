import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from '@/db/schema';

export const DATABASE_NAME = 'dear-wallet.db';

const expo = openDatabaseSync(DATABASE_NAME);

export const db = drizzle(expo, { schema });
export type AppDatabase = typeof db;
