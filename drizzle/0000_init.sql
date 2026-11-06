CREATE TABLE `diary_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`entry_date` text NOT NULL,
	`prompt_id` text,
	`mood` text,
	`body` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`deleted_at` text,
	`dirty` integer DEFAULT true NOT NULL,
	`synced_at` text
);
--> statement-breakpoint
CREATE TABLE `goals` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`target_cents` integer NOT NULL,
	`started_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`reached_at` text,
	`archived_at` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`deleted_at` text,
	`dirty` integer DEFAULT true NOT NULL,
	`synced_at` text
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`name` text NOT NULL,
	`amount_cents` integer,
	`currency` text DEFAULT 'USD' NOT NULL,
	`category` text,
	`note` text,
	`photo_path` text,
	`tag` text,
	`bought_after_all_at` text,
	`happened_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`deleted_at` text,
	`dirty` integer DEFAULT true NOT NULL,
	`synced_at` text
);
--> statement-breakpoint
CREATE TABLE `milestones` (
	`user_id` text NOT NULL,
	`milestone_id` text NOT NULL,
	`achieved_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`seen_at` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`dirty` integer DEFAULT true NOT NULL,
	`synced_at` text,
	PRIMARY KEY(`user_id`, `milestone_id`)
);
--> statement-breakpoint
CREATE TABLE `outbox` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`table_name` text NOT NULL,
	`row_id` text NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `page_stickers` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`diary_entry_id` text NOT NULL,
	`sticker_id` text NOT NULL,
	`x` real NOT NULL,
	`y` real NOT NULL,
	`scale` real DEFAULT 1 NOT NULL,
	`rotation` real DEFAULT 0 NOT NULL,
	`z` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`deleted_at` text,
	`dirty` integer DEFAULT true NOT NULL,
	`synced_at` text
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`display_name` text,
	`palette` text DEFAULT 'cloud' NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`sounds` integer DEFAULT true NOT NULL,
	`haptics` integer DEFAULT true NOT NULL,
	`reduced_motion` integer DEFAULT false NOT NULL,
	`app_lock` text DEFAULT 'off' NOT NULL,
	`checkin_enabled` integer DEFAULT true NOT NULL,
	`checkin_weekday` integer DEFAULT 0 NOT NULL,
	`checkin_time` text DEFAULT '19:00' NOT NULL,
	`onboarded_at` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`dirty` integer DEFAULT true NOT NULL,
	`synced_at` text
);
--> statement-breakpoint
CREATE TABLE `quests` (
	`user_id` text NOT NULL,
	`day` text NOT NULL,
	`quest_id` text NOT NULL,
	`completed_at` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`dirty` integer DEFAULT true NOT NULL,
	`synced_at` text,
	PRIMARY KEY(`user_id`, `day`)
);
--> statement-breakpoint
CREATE TABLE `stars` (
	`user_id` text NOT NULL,
	`day` text NOT NULL,
	`earned_by` text NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`dirty` integer DEFAULT true NOT NULL,
	`synced_at` text,
	PRIMARY KEY(`user_id`, `day`)
);
--> statement-breakpoint
CREATE TABLE `sticker_awards` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`sticker_id` text NOT NULL,
	`source` text NOT NULL,
	`source_id` text,
	`awarded_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`deleted_at` text,
	`dirty` integer DEFAULT true NOT NULL,
	`synced_at` text
);
--> statement-breakpoint
CREATE TABLE `unlocks` (
	`user_id` text NOT NULL,
	`unlock_id` text NOT NULL,
	`unlocked_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`dirty` integer DEFAULT true NOT NULL,
	`synced_at` text,
	PRIMARY KEY(`user_id`, `unlock_id`)
);
