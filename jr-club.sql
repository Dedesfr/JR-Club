-- -------------------------------------------------------------
-- TablePlus 7.1.1(711)
--
-- https://tableplus.com/
--
-- Database: jrclub
-- Generation Time: 2026-05-29 16:17:46.1230
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "public"."branch";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS branch_id_seq;

-- Table Definition
CREATE TABLE "public"."branch" (
    "id" int8 NOT NULL DEFAULT nextval('branch_id_seq'::regclass),
    "name" varchar(255) NOT NULL,
    "is_global" bool NOT NULL DEFAULT false,
    "created_at" timestamp(0),
    "updated_at" timestamp(0),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."leagues";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS leagues_id_seq;

-- Table Definition
CREATE TABLE "public"."leagues" (
    "id" int8 NOT NULL DEFAULT nextval('leagues_id_seq'::regclass),
    "name" varchar(255) NOT NULL,
    "sport_id" int8 NOT NULL,
    "description" text,
    "start_date" date NOT NULL,
    "end_date" date,
    "status" varchar(255) NOT NULL DEFAULT 'upcoming'::character varying,
    "created_by" int8 NOT NULL,
    "created_at" timestamp(0),
    "updated_at" timestamp(0),
    "category" varchar(255),
    "entry_type" varchar(255),
    "stage" varchar(255) NOT NULL DEFAULT 'setup'::character varying,
    "participant_total" int4,
    "group_count" int4,
    "group_size" int4,
    "sets_to_win" int4 NOT NULL DEFAULT 2,
    "points_per_set" int4 NOT NULL DEFAULT 21,
    "advance_upper_count" int4 NOT NULL DEFAULT 0,
    "advance_lower_count" int4 NOT NULL DEFAULT 0,
    "upper_champion_entry_id" int8,
    "lower_champion_entry_id" int8,
    "third_place_match_id" int8,
    "lower_third_place_match_id" int8,
    "start_stage" varchar(255) NOT NULL DEFAULT 'group'::character varying,
    "sport_category_id" int8,
    "group_locked" bool NOT NULL DEFAULT false,
    "documentation_url" varchar(255),
    "banner_path" varchar(255),
    "branch_id" int8,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."league_awards";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS league_awards_id_seq;

-- Table Definition
CREATE TABLE "public"."league_awards" (
    "id" int8 NOT NULL DEFAULT nextval('league_awards_id_seq'::regclass),
    "league_id" int8 NOT NULL,
    "title" varchar(255) NOT NULL,
    "winner_label" varchar(255) NOT NULL,
    "sort_order" int4 NOT NULL DEFAULT 1,
    "created_at" timestamp(0),
    "updated_at" timestamp(0),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."league_entry_players";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS league_entry_players_id_seq;

-- Table Definition
CREATE TABLE "public"."league_entry_players" (
    "id" int8 NOT NULL DEFAULT nextval('league_entry_players_id_seq'::regclass),
    "league_entry_id" int8 NOT NULL,
    "user_id" int8 NOT NULL,
    "sort_order" int4 NOT NULL DEFAULT 0,
    "created_at" timestamp(0),
    "updated_at" timestamp(0),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."migrations";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS migrations_id_seq;

-- Table Definition
CREATE TABLE "public"."migrations" (
    "id" int4 NOT NULL DEFAULT nextval('migrations_id_seq'::regclass),
    "migration" varchar(255) NOT NULL,
    "batch" int4 NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."users";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS users_id_seq;

-- Table Definition
CREATE TABLE "public"."users" (
    "id" int8 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    "name" varchar(255) NOT NULL,
    "email" varchar(255) NOT NULL,
    "email_verified_at" timestamp(0),
    "password" varchar(255) NOT NULL,
    "remember_token" varchar(100),
    "created_at" timestamp(0),
    "updated_at" timestamp(0),
    "role" varchar(255) NOT NULL DEFAULT 'member'::character varying,
    "push_subscription" json,
    "gender" varchar(255),
    "branch_id" int8 NOT NULL DEFAULT '1'::bigint,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."password_reset_tokens";
-- Table Definition
CREATE TABLE "public"."password_reset_tokens" (
    "email" varchar(255) NOT NULL,
    "token" varchar(255) NOT NULL,
    "created_at" timestamp(0),
    PRIMARY KEY ("email")
);

DROP TABLE IF EXISTS "public"."sessions";
-- Table Definition
CREATE TABLE "public"."sessions" (
    "id" varchar(255) NOT NULL,
    "user_id" int8,
    "ip_address" varchar(45),
    "user_agent" text,
    "payload" text NOT NULL,
    "last_activity" int4 NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."cache";
-- Table Definition
CREATE TABLE "public"."cache" (
    "key" varchar(255) NOT NULL,
    "value" text NOT NULL,
    "expiration" int4 NOT NULL,
    PRIMARY KEY ("key")
);

DROP TABLE IF EXISTS "public"."cache_locks";
-- Table Definition
CREATE TABLE "public"."cache_locks" (
    "key" varchar(255) NOT NULL,
    "owner" varchar(255) NOT NULL,
    "expiration" int4 NOT NULL,
    PRIMARY KEY ("key")
);

DROP TABLE IF EXISTS "public"."jobs";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS jobs_id_seq;

-- Table Definition
CREATE TABLE "public"."jobs" (
    "id" int8 NOT NULL DEFAULT nextval('jobs_id_seq'::regclass),
    "queue" varchar(255) NOT NULL,
    "payload" text NOT NULL,
    "attempts" int2 NOT NULL,
    "reserved_at" int4,
    "available_at" int4 NOT NULL,
    "created_at" int4 NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."job_batches";
-- Table Definition
CREATE TABLE "public"."job_batches" (
    "id" varchar(255) NOT NULL,
    "name" varchar(255) NOT NULL,
    "total_jobs" int4 NOT NULL,
    "pending_jobs" int4 NOT NULL,
    "failed_jobs" int4 NOT NULL,
    "failed_job_ids" text NOT NULL,
    "options" text,
    "cancelled_at" int4,
    "created_at" int4 NOT NULL,
    "finished_at" int4,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."activities";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS activities_id_seq;

-- Table Definition
CREATE TABLE "public"."activities" (
    "id" int8 NOT NULL DEFAULT nextval('activities_id_seq'::regclass),
    "sport_id" int8 NOT NULL,
    "created_by" int8 NOT NULL,
    "title" varchar(255) NOT NULL,
    "description" text,
    "location" varchar(255) NOT NULL,
    "scheduled_at" timestamp(0) NOT NULL,
    "max_participants" int4 NOT NULL,
    "status" varchar(255) NOT NULL DEFAULT 'open'::character varying,
    "created_at" timestamp(0),
    "updated_at" timestamp(0),
    "branch_id" int8,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."failed_jobs";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS failed_jobs_id_seq;

-- Table Definition
CREATE TABLE "public"."failed_jobs" (
    "id" int8 NOT NULL DEFAULT nextval('failed_jobs_id_seq'::regclass),
    "uuid" varchar(255) NOT NULL,
    "connection" text NOT NULL,
    "queue" text NOT NULL,
    "payload" text NOT NULL,
    "exception" text NOT NULL,
    "failed_at" timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."teams";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS teams_id_seq;

-- Table Definition
CREATE TABLE "public"."teams" (
    "id" int8 NOT NULL DEFAULT nextval('teams_id_seq'::regclass),
    "name" varchar(255) NOT NULL,
    "sport_id" int8,
    "created_by" int8 NOT NULL,
    "created_at" timestamp(0),
    "updated_at" timestamp(0),
    "logo_path" varchar(255),
    "branch_id" int8,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."sports";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS sports_id_seq;

-- Table Definition
CREATE TABLE "public"."sports" (
    "id" int8 NOT NULL DEFAULT nextval('sports_id_seq'::regclass),
    "name" varchar(255) NOT NULL,
    "icon" varchar(255) NOT NULL DEFAULT 'sports'::character varying,
    "max_players_per_team" int4 NOT NULL DEFAULT 5,
    "description" text,
    "created_at" timestamp(0),
    "updated_at" timestamp(0),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."activity_participants";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS activity_participants_id_seq;

-- Table Definition
CREATE TABLE "public"."activity_participants" (
    "id" int8 NOT NULL DEFAULT nextval('activity_participants_id_seq'::regclass),
    "activity_id" int8 NOT NULL,
    "user_id" int8 NOT NULL,
    "joined_at" timestamp(0) NOT NULL,
    "created_at" timestamp(0),
    "updated_at" timestamp(0),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."team_members";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS team_members_id_seq;

-- Table Definition
CREATE TABLE "public"."team_members" (
    "id" int8 NOT NULL DEFAULT nextval('team_members_id_seq'::regclass),
    "team_id" int8 NOT NULL,
    "user_id" int8 NOT NULL,
    "role" varchar(255) NOT NULL DEFAULT 'member'::character varying,
    "joined_at" timestamp(0) NOT NULL,
    "created_at" timestamp(0),
    "updated_at" timestamp(0),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."league_teams";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS league_teams_id_seq;

-- Table Definition
CREATE TABLE "public"."league_teams" (
    "id" int8 NOT NULL DEFAULT nextval('league_teams_id_seq'::regclass),
    "league_id" int8 NOT NULL,
    "team_id" int8 NOT NULL,
    "registered_at" timestamp(0) NOT NULL,
    "created_at" timestamp(0),
    "updated_at" timestamp(0),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."matches";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS matches_id_seq;

-- Table Definition
CREATE TABLE "public"."matches" (
    "id" int8 NOT NULL DEFAULT nextval('matches_id_seq'::regclass),
    "league_id" int8 NOT NULL,
    "home_team_id" int8,
    "away_team_id" int8,
    "scheduled_at" timestamp(0) NOT NULL,
    "status" varchar(255) NOT NULL DEFAULT 'scheduled'::character varying,
    "home_score" int4 NOT NULL DEFAULT 0,
    "away_score" int4 NOT NULL DEFAULT 0,
    "created_at" timestamp(0),
    "updated_at" timestamp(0),
    "home_entry_id" int8,
    "away_entry_id" int8,
    "league_group_id" int8,
    "stage" varchar(255),
    "round" int4,
    "bracket_slot" varchar(255),
    "next_match_id" int8,
    "locked" bool NOT NULL DEFAULT false,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."league_groups";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS league_groups_id_seq;

-- Table Definition
CREATE TABLE "public"."league_groups" (
    "id" int8 NOT NULL DEFAULT nextval('league_groups_id_seq'::regclass),
    "league_id" int8 NOT NULL,
    "name" varchar(255) NOT NULL,
    "position" int4 NOT NULL,
    "created_at" timestamp(0),
    "updated_at" timestamp(0),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."league_group_entries";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS league_group_entries_id_seq;

-- Table Definition
CREATE TABLE "public"."league_group_entries" (
    "id" int8 NOT NULL DEFAULT nextval('league_group_entries_id_seq'::regclass),
    "league_group_id" int8 NOT NULL,
    "league_entry_id" int8 NOT NULL,
    "seed" int4,
    "points" int4 NOT NULL DEFAULT 0,
    "manual_advance_rank" int4,
    "created_at" timestamp(0),
    "updated_at" timestamp(0),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."match_substitutions";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS match_substitutions_id_seq;

-- Table Definition
CREATE TABLE "public"."match_substitutions" (
    "id" int8 NOT NULL DEFAULT nextval('match_substitutions_id_seq'::regclass),
    "match_id" int8 NOT NULL,
    "entry_id" int8 NOT NULL,
    "original_player_id" int8 NOT NULL,
    "substitute_id" int8 NOT NULL,
    "reason" text,
    "activated_at" timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" timestamp(0),
    "updated_at" timestamp(0),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."match_sets";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS match_sets_id_seq;

-- Table Definition
CREATE TABLE "public"."match_sets" (
    "id" int8 NOT NULL DEFAULT nextval('match_sets_id_seq'::regclass),
    "match_id" int8 NOT NULL,
    "set_number" int4 NOT NULL,
    "home_points" int4 NOT NULL,
    "away_points" int4 NOT NULL,
    "created_at" timestamp(0),
    "updated_at" timestamp(0),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."league_entry_substitutes";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS league_entry_substitutes_id_seq;

-- Table Definition
CREATE TABLE "public"."league_entry_substitutes" (
    "id" int8 NOT NULL DEFAULT nextval('league_entry_substitutes_id_seq'::regclass),
    "league_entry_id" int8 NOT NULL,
    "user_id" int8 NOT NULL,
    "created_at" timestamp(0),
    "updated_at" timestamp(0),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."match_documents";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS match_documents_id_seq;

-- Table Definition
CREATE TABLE "public"."match_documents" (
    "id" int8 NOT NULL DEFAULT nextval('match_documents_id_seq'::regclass),
    "match_id" int8 NOT NULL,
    "path" varchar(255) NOT NULL,
    "original_name" varchar(255) NOT NULL,
    "uploaded_by" int8 NOT NULL,
    "created_at" timestamp(0),
    "updated_at" timestamp(0),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."league_entries";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS league_entries_id_seq;

-- Table Definition
CREATE TABLE "public"."league_entries" (
    "id" int8 NOT NULL DEFAULT nextval('league_entries_id_seq'::regclass),
    "league_id" int8 NOT NULL,
    "player1_id" int8 NOT NULL,
    "player2_id" int8,
    "substitute_id" int8,
    "seed" int4,
    "created_at" timestamp(0),
    "updated_at" timestamp(0),
    "group_name" varchar(255),
    "group_picture_path" varchar(255),
    "team_id" int8,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."sport_categories";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS sport_categories_id_seq;

-- Table Definition
CREATE TABLE "public"."sport_categories" (
    "id" int8 NOT NULL DEFAULT nextval('sport_categories_id_seq'::regclass),
    "sport_id" int8 NOT NULL,
    "code" varchar(255) NOT NULL,
    "name" varchar(255) NOT NULL,
    "entry_type" varchar(255) NOT NULL DEFAULT 'team'::character varying,
    "player_count" int4 NOT NULL DEFAULT 1,
    "gender_rule" varchar(255) NOT NULL DEFAULT 'open'::character varying,
    "sort_order" int4 NOT NULL DEFAULT 0,
    "is_active" bool NOT NULL DEFAULT true,
    "created_at" timestamp(0),
    "updated_at" timestamp(0),
    PRIMARY KEY ("id")
);

INSERT INTO "public"."branch" ("id", "name", "is_global", "created_at", "updated_at") VALUES
(1, 'Pusat', 't', NULL, NULL),
(2, 'DKI', 'f', NULL, NULL),
(3, 'Jateng', 'f', NULL, NULL),
(4, 'Lampung', 'f', NULL, NULL);

INSERT INTO "public"."leagues" ("id", "name", "sport_id", "description", "start_date", "end_date", "status", "created_by", "created_at", "updated_at", "category", "entry_type", "stage", "participant_total", "group_count", "group_size", "sets_to_win", "points_per_set", "advance_upper_count", "advance_lower_count", "upper_champion_entry_id", "lower_champion_entry_id", "third_place_match_id", "lower_third_place_match_id", "start_stage", "sport_category_id", "group_locked", "documentation_url", "banner_path", "branch_id") VALUES
(1, 'JR Men Double Championship', 4, 'Start Competition: 7 Mei 2026. Time: 17.00 - 20.00. Location: Grand Sport Centre, Kuningan.', '2026-05-07', '2026-05-07', 'active', 1, '2026-05-04 07:32:03', '2026-05-06 08:06:24', 'MD', 'double', 'group', 16, 2, 8, 1, 30, 4, 4, NULL, NULL, NULL, NULL, 'group', 3, 't', NULL, NULL, NULL),
(2, 'JR Women Double Championship', 4, 'Start Competition: 7 Mei 2026. Time: 17.00 - 20.00. Location: Grand Sport Centre, Kuningan.', '2026-05-07', '2026-05-07', 'active', 1, '2026-05-04 07:32:03', '2026-05-05 14:51:46', 'WD', 'double', 'group', 16, 2, 8, 1, 30, 4, 4, NULL, NULL, NULL, NULL, 'group', 4, 't', NULL, NULL, NULL),
(3, 'Mix Double Championship', 4, 'Start Competition: 7 Mei 2026. Time: 17.00 - 20.00. Location: Grand Sport Centre, Kuningan.', '2026-05-07', '2026-05-07', 'active', 1, '2026-05-04 07:32:03', '2026-05-06 08:11:02', 'XD', 'double', 'group', 16, 2, 8, 1, 30, 4, 4, NULL, NULL, NULL, NULL, 'group', 5, 't', NULL, NULL, NULL),
(4, '(Dummy) JR Men Doubles Finals Seed', 4, 'Completed ganda putra tournament with group stage, upper bracket, and lower bracket results.', '2026-03-08', '2026-05-04', 'completed', 1, '2026-05-04 07:32:03', '2026-05-05 11:16:13', 'MD', 'double', 'completed', 16, 2, 8, 2, 15, 4, 4, 1, 9, 71, 72, 'group', 3, 'f', NULL, NULL, NULL),
(5, '(Dummy) JR Men Doubles Group Stage', 4, 'Completed ganda putra tournament group stage, waiting for bracket seeding.', '2026-03-07', '2026-05-04', 'completed', 1, '2026-05-04 07:32:05', '2026-05-05 11:15:46', 'MD', 'double', 'group', 16, 2, 8, 2, 15, 4, 4, NULL, NULL, NULL, NULL, 'group', 3, 'f', NULL, NULL, NULL),
(6, 'Basketball 3 on 3 Tournament Jasa Raharja', 2, 'Completed basketball 3 on 3 tournament seeded from final event results.', '2026-03-22', '2026-03-30', 'completed', 1, '2026-05-04 07:32:06', '2026-05-05 11:18:25', '3V3', 'team', 'completed', 16, NULL, NULL, 1, 21, 0, 0, 37, NULL, 144, NULL, 'bracket', 6, 'f', NULL, '/storage/league-banners/KTsFVupDOPl4IPtkbIMOGAxa9aZYy2G8fbEGTU23.jpg', NULL);

INSERT INTO "public"."league_awards" ("id", "league_id", "title", "winner_label", "sort_order", "created_at", "updated_at") VALUES
(1, 6, 'Man of The Match', 'M. Nugroho - Divisi Pelayanan', 1, '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(2, 6, 'Three Points Contest', 'Dillan - Divisi Keuangan', 2, '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(3, 6, 'Free Throw Contest', 'Reno Vancasavio - Divisi STK', 3, '2026-05-04 07:32:25', '2026-05-04 07:32:25');

INSERT INTO "public"."migrations" ("id", "migration", "batch") VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_04_20_000000_add_jrclub_fields_to_users_table', 1),
(5, '2026_04_20_000001_create_jrclub_tables', 1),
(6, '2026_04_20_000002_add_league_tournament_format', 1),
(7, '2026_04_20_000003_add_group_name_and_entry_substitutes', 1),
(8, '2026_04_20_104008_create_match_substitutions_table', 1),
(9, '2026_04_20_104022_create_match_documents_table', 1),
(10, '2026_04_20_104035_add_third_place_match_id_to_leagues_table', 1),
(11, '2026_04_21_000001_add_group_picture_path_to_league_entries', 1),
(12, '2026_04_21_034539_add_lower_third_place_match_id_to_leagues_table', 1),
(13, '2026_04_25_000001_add_start_stage_to_leagues_table', 1),
(14, '2026_04_25_000002_create_sport_categories_table', 1),
(15, '2026_04_25_000003_add_team_id_to_league_entries_table', 1),
(16, '2026_04_30_000001_make_sport_id_nullable_on_teams', 1),
(17, '2026_05_03_000001_add_logo_path_to_teams_table', 1),
(18, '2026_05_04_000001_create_league_awards_table', 1),
(19, '2026_05_04_000002_add_group_locked_to_leagues_table', 1),
(20, '2026_05_04_100000_create_league_entry_players_table', 1),
(21, '2026_05_04_110000_add_documentation_url_to_leagues_table', 1),
(22, '2026_05_05_100000_add_banner_path_to_leagues_table', 2),
(23, '2026_05_13_000001_add_locked_to_matches_table', 3),
(24, '2026_05_29_000001_create_branch_table', 4),
(25, '2026_05_29_000002_add_branch_id_to_users_table', 4),
(26, '2026_05_29_000003_add_branch_id_to_content_tables', 4);

INSERT INTO "public"."users" ("id", "name", "email", "email_verified_at", "password", "remember_token", "created_at", "updated_at", "role", "push_subscription", "gender", "branch_id") VALUES
(1, 'JR Club Admin', 'admin@jasaraharja.co.id', NULL, '$2y$12$v97ZirtVdZuM1E5nFTOBKe37.z4Cg8ux0U9TOq0rMPAba7//Q3d0q', NULL, '2026-05-04 07:31:28', '2026-05-04 07:31:28', 'admin', NULL, 'male', 1),
(2, 'Aditya', 'human-capital.aditya@jasaraharja.co.id', NULL, '$2y$12$9gg9nZgFXVUv8ehLm2ImHOf8OKeLyFeOMZAkneb.M97fl7rJG/gym', NULL, '2026-05-04 07:31:29', '2026-05-04 07:31:29', 'member', NULL, 'male', 1),
(3, 'Niam', 'human-capital.niam@jasaraharja.co.id', NULL, '$2y$12$3kuo30lVnXFw.DuUTnbKxuJ8uGHRpEUnI2OC/MX0VdJ/uVJY8eXHG', NULL, '2026-05-04 07:31:29', '2026-05-04 07:31:29', 'member', NULL, 'male', 1),
(4, 'Oki', 'human-capital.oki@jasaraharja.co.id', NULL, '$2y$12$0bVQ/92Q8d6WiZler9VUNOWzRAhE8RcxioL2m1qrwWE0e3ZBnLpGu', NULL, '2026-05-04 07:31:29', '2026-05-04 07:31:29', 'member', NULL, 'male', 1),
(5, 'Ruri', 'human-capital.ruri@jasaraharja.co.id', NULL, '$2y$12$8bwkuk2k4NuP4YljiFHPCO69lafkQFh9TgyyhTLLd7.nRSWRgWgU6', NULL, '2026-05-04 07:31:30', '2026-05-04 07:31:30', 'member', NULL, 'female', 1),
(6, 'Anis', 'human-capital.anis@jasaraharja.co.id', NULL, '$2y$12$cWvqtCR4On3U7kvsrr/Q3.QgHuDe4Ob/XC2WXQJZCg6szOR84Jn6G', NULL, '2026-05-04 07:31:30', '2026-05-04 07:31:30', 'member', NULL, 'female', 1),
(7, 'Yonsei', 'human-capital.yonsei@jasaraharja.co.id', NULL, '$2y$12$EWrOrtj59LdEVKs7UqGBUeGiU/gvwkUfuYGUW0zBuNvnhffk5N3y2', NULL, '2026-05-04 07:31:30', '2026-05-04 07:31:30', 'member', NULL, 'female', 1),
(8, 'Ikhsan', 'human-capital.ikhsan@jasaraharja.co.id', NULL, '$2y$12$4LCgRNmmYtbUWakFKvHo6usGpOvKOMUn/kLEeea1AkX3CUoEmLON.', NULL, '2026-05-04 07:31:30', '2026-05-05 10:29:49', 'member', NULL, 'male', 1),
(9, 'Tina', 'human-capital.tina@jasaraharja.co.id', NULL, '$2y$12$kojhmczqHbtyp3Z9547P/.v8pB3.W4aQOSDdB7VL/thUw9rR9i2k6', NULL, '2026-05-04 07:31:31', '2026-05-05 10:29:57', 'member', NULL, 'female', 1),
(10, 'Andri', 'human-capital.andri@jasaraharja.co.id', NULL, '$2y$12$USbds7DzpKVqFcHCCZUZK.kcOvc4UAoF5dPeoIRPozBPfjeJdS11u', NULL, '2026-05-04 07:31:31', '2026-05-04 07:31:31', 'member', NULL, NULL, 1),
(11, 'Sisca', 'human-capital.sisca@jasaraharja.co.id', NULL, '$2y$12$XOGNia0wVpG6U46h8Hgls.ZdUG5zwZvDa20njNHQBZF0.CzRf3zB2', NULL, '2026-05-04 07:31:31', '2026-05-04 07:31:31', 'member', NULL, NULL, 1),
(12, 'Erik', 'sekretariat-perusahaan.erik@jasaraharja.co.id', NULL, '$2y$12$o8oRHbrz8uiptuubSuYSxOTn988LY2gPVtiWgn5gMYYENYNLpckqG', NULL, '2026-05-04 07:31:32', '2026-05-05 10:07:56', 'member', NULL, 'male', 1),
(13, 'Ridho', 'sekretariat-perusahaan.ridho@jasaraharja.co.id', NULL, '$2y$12$SYNC3M3QD8Z1dCYT7DSXguxTf.M99gxtNBpNgrJIcOr2ktZt752bO', NULL, '2026-05-04 07:31:32', '2026-05-05 10:08:03', 'member', NULL, 'male', 1),
(14, 'Tito', 'sekretariat-perusahaan.tito@jasaraharja.co.id', NULL, '$2y$12$C4dQ1gikR85NRvm4uCVkx.KhukwZeNf7VPMXpuioTHes1sfF0TvHa', NULL, '2026-05-04 07:31:32', '2026-05-04 07:31:32', 'member', NULL, 'male', 1),
(15, 'Salwa', 'sekretariat-perusahaan.salwa@jasaraharja.co.id', NULL, '$2y$12$ZMratYapISWcYL4ZlUpsBuFndfXQ4VP6BBf1XhEmjKJrkB0BR4LfS', NULL, '2026-05-04 07:31:32', '2026-05-04 07:31:32', 'member', NULL, 'female', 1),
(16, 'Umai', 'sekretariat-perusahaan.umai@jasaraharja.co.id', NULL, '$2y$12$24Vdf6nm7cbN5DlHkPzCFuYTxb.e1.PU/ZY7B37/5fcsVfh9gIE4W', NULL, '2026-05-04 07:31:33', '2026-05-04 07:31:33', 'member', NULL, 'female', 1),
(17, 'Ani', 'sekretariat-perusahaan.ani@jasaraharja.co.id', NULL, '$2y$12$GI3gd8a5ZQkOhAnapLJeaOfYFQfkpZU6o20FLRVM.P32YAL5q2h1e', NULL, '2026-05-04 07:31:33', '2026-05-04 07:31:33', 'member', NULL, 'female', 1),
(18, 'Tyo', 'sekretariat-perusahaan.tyo@jasaraharja.co.id', NULL, '$2y$12$33MF.bCydNhiCMEKn8AameIm4UVJtxuXrqxCUJpWqJNv.tnAl1siq', NULL, '2026-05-04 07:31:33', '2026-05-05 11:03:20', 'member', NULL, 'male', 1),
(19, 'Igin', 'sekretariat-perusahaan.igin@jasaraharja.co.id', NULL, '$2y$12$0INt/v6b.FVR8wkUmtLqJu7H1cllQvulD2rR0iYJPZAWwFabOiD2G', NULL, '2026-05-04 07:31:34', '2026-05-05 11:03:07', 'member', NULL, 'female', 1),
(20, 'Aris', 'sekretariat-perusahaan.aris@jasaraharja.co.id', NULL, '$2y$12$NTkXGaX3ShNo8SYLn2av4epJm4EIlP3/ikFYK20zNhwtZp9f5NGKa', NULL, '2026-05-04 07:31:34', '2026-05-04 07:31:34', 'member', NULL, NULL, 1),
(21, 'Christin', 'sekretariat-perusahaan.christin@jasaraharja.co.id', NULL, '$2y$12$kfXBTq7kWRa0o/.Cl9Xtbe1BAMo7PWo2gPisjOd2osuqraqkAaP86', NULL, '2026-05-04 07:31:34', '2026-05-07 10:57:17', 'member', NULL, 'female', 1),
(22, 'Hadi', 'teknologi-informasi-dan-komunikasi.hadi@jasaraharja.co.id', NULL, '$2y$12$10G0dOQtKuV8d/xAcmN/7evFiBdGlKAGXJC.x4cmoz37RSOfZ7xja', NULL, '2026-05-04 07:31:34', '2026-05-04 07:31:34', 'member', NULL, 'male', 1),
(23, 'Wayan', 'teknologi-informasi-dan-komunikasi.wayan@jasaraharja.co.id', NULL, '$2y$12$DSD2P6VKbIysGLnObdjtV.cgNrpaG/s.5gg3ult3rJhiU464gYGL.', NULL, '2026-05-04 07:31:35', '2026-05-04 07:31:35', 'member', NULL, 'male', 1),
(24, 'Barma', 'teknologi-informasi-dan-komunikasi.barma@jasaraharja.co.id', NULL, '$2y$12$6Nxpj8YX.oC2cU1yOBaNnOkqi1thCy5d9cdGfLLDD55G6obeimAqW', NULL, '2026-05-04 07:31:35', '2026-05-04 07:32:21', 'member', NULL, NULL, 1),
(25, 'Annis', 'teknologi-informasi-dan-komunikasi.annis@jasaraharja.co.id', NULL, '$2y$12$24WJBSe0o8GwXmItSKSNiev.c4pmA7VQ9gQK1Zr8MGp/7O/hy95HG', NULL, '2026-05-04 07:31:35', '2026-05-04 07:31:35', 'member', NULL, 'female', 1),
(26, 'Mela', 'teknologi-informasi-dan-komunikasi.mela@jasaraharja.co.id', NULL, '$2y$12$eB.ha8ZiTro3ZEPJLPfra.D9t/sFsfgTu4/U6gS024zoby9n/2mpS', NULL, '2026-05-04 07:31:36', '2026-05-04 07:31:36', 'member', NULL, 'female', 1),
(27, 'Pak Saldhy', 'teknologi-informasi-dan-komunikasi.pak-saldhy@jasaraharja.co.id', NULL, '$2y$12$YmuAz6iYVc2XNIEajnvy5uTmwqXjcSZwtGM1dX5kgkubEBm4vohhq', NULL, '2026-05-04 07:31:36', '2026-05-05 11:10:17', 'member', NULL, 'male', 1),
(28, 'Dwinta', 'teknologi-informasi-dan-komunikasi.dwinta@jasaraharja.co.id', NULL, '$2y$12$7//mZrR2B7enqdI8MC7AU.O1Cb9lQgySE.z0BHjO22e6EvpoK4ZH6', NULL, '2026-05-04 07:31:36', '2026-05-05 11:10:26', 'member', NULL, 'female', 1),
(29, 'Maulana', 'keuangan.maulana@jasaraharja.co.id', NULL, '$2y$12$9WacVApf8olshVHwA0Ogx.LKT9847hnoNn9FOQ0AL5hsnGBgxAjlm', NULL, '2026-05-04 07:31:37', '2026-05-04 07:31:37', 'member', NULL, 'male', 1),
(30, 'Andyka', 'keuangan.andyka@jasaraharja.co.id', NULL, '$2y$12$tdodJELQcluOCq.Wtb/vPOjd6yHCN7nKpElmq6NzqjBeeUavEh07q', NULL, '2026-05-04 07:31:37', '2026-05-04 07:31:37', 'member', NULL, 'male', 1),
(31, 'Dillan', 'keuangan.dillan@jasaraharja.co.id', NULL, '$2y$12$dar7NQgvNZqdl3CjbDh6Eu3Q0G.qyPPs9QittTEzwC44an3o0H3ie', NULL, '2026-05-04 07:31:37', '2026-05-04 07:32:15', 'member', NULL, NULL, 1),
(32, 'Dewi RS', 'keuangan.dewi-rs@jasaraharja.co.id', NULL, '$2y$12$w6/euIxUB17Qv2AkT/3c4unnAejRM83LGbEww5NvxAIP.D4bP6xxS', NULL, '2026-05-04 07:31:37', '2026-05-04 07:31:37', 'member', NULL, 'female', 1),
(33, 'Puput', 'keuangan.puput@jasaraharja.co.id', NULL, '$2y$12$v70/dLWteJg98TQGxP31aeq0kizo.goxuUxzR./ejLwMcFiD8N2q2', NULL, '2026-05-04 07:31:38', '2026-05-04 07:31:38', 'member', NULL, 'female', 1),
(34, 'Atika', 'keuangan.atika@jasaraharja.co.id', NULL, '$2y$12$J7UCrAXWVlZKdFdPWI/IceJ3WY3MMhjjp0FI64BHjpJZL8geCq.dm', NULL, '2026-05-04 07:31:38', '2026-05-04 07:31:38', 'member', NULL, 'female', 1),
(35, 'Ficko', 'keuangan.ficko@jasaraharja.co.id', NULL, '$2y$12$v32F24CBAcIQ7qbQfoMvyOZupc9tMDki6cAz4IXqt1E2U9Uqx09ZO', NULL, '2026-05-04 07:31:38', '2026-05-05 10:42:06', 'member', NULL, 'male', 1),
(36, 'Sindi', 'keuangan.sindi@jasaraharja.co.id', NULL, '$2y$12$U1KGfujTEaj8ZBzNC3.JkOfzCIg6W3I9CJo412t58ULk.PewG3KR6', NULL, '2026-05-04 07:31:39', '2026-05-05 10:42:17', 'member', NULL, 'female', 1),
(37, 'Wina', 'keuangan.wina@jasaraharja.co.id', NULL, '$2y$12$/A9TFBwPky7nU6FKaqC2heAEU10pYsR7bYHsuLNZ00rlZaRetiuBO', NULL, '2026-05-04 07:31:39', '2026-05-04 07:31:39', 'member', NULL, NULL, 1),
(38, 'Aqsa', 'asuransi.aqsa@jasaraharja.co.id', NULL, '$2y$12$qNZy7.kTy2R/MiJrZ71DQuXbAlsNr56foEOMuSS7yk2uF/MDhrfz6', NULL, '2026-05-04 07:31:39', '2026-05-05 09:53:47', 'member', NULL, 'male', 1),
(39, 'Agha', 'asuransi.agha@jasaraharja.co.id', NULL, '$2y$12$JtRWS.mISZnzaQBOzv2uKeuIdpmsQH/ETxwl6qSzs4i95rY9YVp/.', NULL, '2026-05-04 07:31:40', '2026-05-05 09:53:58', 'member', NULL, 'male', 1),
(40, 'Nofrizal', 'asuransi.nofrizal@jasaraharja.co.id', NULL, '$2y$12$3JTSfV0gw25hGMb5Nwy4PuhVQo5Ri8Vv4c/3ald51hMI0nr2zlGAC', NULL, '2026-05-04 07:31:40', '2026-05-04 07:32:20', 'member', NULL, NULL, 1),
(41, 'Gia', 'asuransi.gia@jasaraharja.co.id', NULL, '$2y$12$GlQ3tsomjxTquomq1vngt.L8zXTMeO5EQpVzlWDEl1zXn1Gz2bKuS', NULL, '2026-05-04 07:31:40', '2026-05-04 07:31:40', 'member', NULL, 'female', 1),
(42, 'Ratih', 'asuransi.ratih@jasaraharja.co.id', NULL, '$2y$12$ZsFq5jgTPCpzUCKg266PCu1Tsy1Mn28OHnLzXBJFEwMFdjJ5THNri', NULL, '2026-05-04 07:31:41', '2026-05-04 07:31:41', 'member', NULL, 'female', 1),
(43, 'Tiwi', 'asuransi.tiwi@jasaraharja.co.id', NULL, '$2y$12$UO0huHqOeJEoGB4C6Ssspu1CRMgV87.PKudc7et8LEaXhkIgICqu2', NULL, '2026-05-04 07:31:41', '2026-05-04 07:31:41', 'member', NULL, 'female', 1),
(44, 'Bayu', 'asuransi.bayu@jasaraharja.co.id', NULL, '$2y$12$gzGNe6Bg5kz.SYLsY5RhreL79WhUxfj.0a74WX8KU98D5keQr73tO', NULL, '2026-05-04 07:31:41', '2026-05-05 10:18:42', 'member', NULL, 'male', 1),
(45, 'Nofri', 'asuransi.nofri@jasaraharja.co.id', NULL, '$2y$12$aVNvcLE.v1Oo231Jil/po.F9KpmggiCTwo7KGUFprfkhivhiWdjRW', NULL, '2026-05-04 07:31:41', '2026-05-06 15:55:40', 'member', NULL, 'male', 1),
(46, 'Aldi', 'strategi-transformasi-dan-korporasi.aldi@jasaraharja.co.id', NULL, '$2y$12$5jF.vsnmLoufToCc9WI14uiPvEhxkzaWXrbIXpez9KxP8xdZnWLaW', NULL, '2026-05-04 07:31:42', '2026-05-05 10:10:24', 'member', NULL, 'male', 1),
(47, 'Rizky', 'strategi-transformasi-dan-korporasi.rizky@jasaraharja.co.id', NULL, '$2y$12$81rfTAOldFMeD/E.ZyKXCeoybFENglD9cAExzWNaxbhUjsxVzy0l2', NULL, '2026-05-04 07:31:42', '2026-05-04 07:31:42', 'member', NULL, 'male', 1),
(48, 'Arief', 'strategi-transformasi-dan-korporasi.arif@jasaraharja.co.id', NULL, '$2y$12$17Tqcozf08nkjy/Qj4NeuO42ywpcZZl8swdp6tU3mp20YswtXnGTG', NULL, '2026-05-04 07:31:42', '2026-05-05 10:11:37', 'member', NULL, 'male', 1),
(49, 'Uzi', 'strategi-transformasi-dan-korporasi.uzi@jasaraharja.co.id', NULL, '$2y$12$IcBi74jkjH6mnl8Wi9N0i.dieTCHcwlmOyprrfxZsSIHfbBy.kFIK', NULL, '2026-05-04 07:31:43', '2026-05-04 07:31:43', 'member', NULL, 'female', 1),
(50, 'Hastuti', 'strategi-transformasi-dan-korporasi.hastuti@jasaraharja.co.id', NULL, '$2y$12$Q7m8PvaBdkS6qsz2v4xt5OSZqdllUFt7cMRjbM7P9NjgkOOCh7qNe', NULL, '2026-05-04 07:31:43', '2026-05-04 07:31:43', 'member', NULL, 'female', 1),
(51, 'Savi', 'strategi-transformasi-dan-korporasi.savi@jasaraharja.co.id', NULL, '$2y$12$viD3DLdya51qZrg5O3H07O9FxMmxV5m4ZRnLsEhdspRDZ0fT5UdSC', NULL, '2026-05-04 07:31:43', '2026-05-04 07:31:43', 'member', NULL, 'female', 1),
(52, 'Reno V', 'strategi-transformasi-dan-korporasi.reno@jasaraharja.co.id', NULL, '$2y$12$eKHNKLNi4M0tHkm1pCXph.HKzoO9eIIho08c6BvtTXIMGtR1lZ9j2', NULL, '2026-05-04 07:31:44', '2026-05-05 11:08:04', 'member', NULL, 'male', 1),
(53, 'Seylla', 'strategi-transformasi-dan-korporasi.seylla@jasaraharja.co.id', NULL, '$2y$12$w3iRKCEQV5FxGiABL45KkOB4MNqTE0hWjGz0/d6ZojN9W5dw4/ouC', NULL, '2026-05-04 07:31:44', '2026-05-05 11:05:41', 'member', NULL, 'female', 1),
(54, 'Edsa', 'strategi-transformasi-dan-korporasi.edsa@jasaraharja.co.id', NULL, '$2y$12$BrxvzEnnvra1o/X1jLeZTOAWJ7zsLFyffKyELhZlYGg1/3n7odOHe', NULL, '2026-05-04 07:31:44', '2026-05-04 07:31:44', 'member', NULL, NULL, 1),
(55, 'Dana', 'satuan-pengawasan-intern.dana@jasaraharja.co.id', NULL, '$2y$12$yR/91bMIxJHvMUQAfsHxq.YxfYPH6Nc7gyiplYq.vup1VYsiob3Ne', NULL, '2026-05-04 07:31:45', '2026-05-05 10:04:17', 'member', NULL, 'male', 1),
(56, 'Widi', 'satuan-pengawasan-intern.widi@jasaraharja.co.id', NULL, '$2y$12$PdRG6loTR7zSWKl7G6HDFuXYugCMFrhAPGEaRrVyqDr9PjjuuSpHK', NULL, '2026-05-04 07:31:45', '2026-05-04 07:31:45', 'member', NULL, 'male', 1),
(57, 'Aji', 'satuan-pengawasan-intern.aji@jasaraharja.co.id', NULL, '$2y$12$LM1ZcRa02eAmfqACAOrq7uwoSDsETC4dMRHfsSJNhz/k8aprFi.8O', NULL, '2026-05-04 07:31:45', '2026-05-04 07:31:45', 'member', NULL, 'male', 1),
(58, 'Eni Maya', 'satuan-pengawasan-intern.eni-maya@jasaraharja.co.id', NULL, '$2y$12$Nz2trfuaPPycaSVJ4YDq4unOTb/vpfp2IHcO3G3HzK19D3Ltg6MBm', NULL, '2026-05-04 07:31:45', '2026-05-04 07:31:45', 'member', NULL, 'female', 1),
(59, 'Syintia', 'satuan-pengawasan-intern.syintia@jasaraharja.co.id', NULL, '$2y$12$.6uBzVzFfBv./4YScTo/P.iRSSNhOM2zSc9VCYUmEzk7wf0FERNqS', NULL, '2026-05-04 07:31:46', '2026-05-04 07:31:46', 'member', NULL, 'female', 1),
(60, 'Gita', 'satuan-pengawasan-intern.gita@jasaraharja.co.id', NULL, '$2y$12$SEdrfEJo2SgqaCJh0nyXS.SyG2bvzS2lYpOdVsl09dtfeI45NdiBG', NULL, '2026-05-04 07:31:46', '2026-05-04 07:31:46', 'member', NULL, 'female', 1),
(61, 'Riris', 'satuan-pengawasan-intern.riris@jasaraharja.co.id', NULL, '$2y$12$ffUDzCKCeY6ILmo4dC0oIuYAultqnIgciy6XTSkowLMKI7lckpYWa', NULL, '2026-05-04 07:31:46', '2026-05-05 11:00:57', 'member', NULL, 'female', 1),
(62, 'Bagus', 'satuan-pengawasan-intern.bagus@jasaraharja.co.id', NULL, '$2y$12$cf9xqzaMrxLsIUPeQj08Ye5QRpSsYEWMAQruB70YEv6Q1nb0kB8BC', NULL, '2026-05-04 07:31:46', '2026-05-07 14:27:43', 'member', NULL, 'male', 1),
(63, 'Affif', 'umum.affif@jasaraharja.co.id', NULL, '$2y$12$X7oryGjg3xWuABxKs92YQOl3k7Fb4IBrGVQwQ1bILxNa8w7cia.tq', NULL, '2026-05-04 07:31:47', '2026-05-05 09:34:18', 'member', NULL, 'male', 1),
(64, 'Apri', 'umum.apri@jasaraharja.co.id', NULL, '$2y$12$SdFyI8GJ/6ky0nuLn.fCBOcPamUA.whd3sjA.uEtiOHu8NXP7nQpy', NULL, '2026-05-04 07:31:47', '2026-05-04 07:31:47', 'member', NULL, 'male', 1),
(65, 'Reza', 'umum.reza@jasaraharja.co.id', NULL, '$2y$12$38F2uOioreFhiY1pLwI//uOpP7JmhJvRKYJDEC96fPiYEHMhGu.ju', NULL, '2026-05-04 07:31:47', '2026-05-04 07:32:09', 'member', NULL, NULL, 1),
(66, 'Sita', 'umum.sita@jasaraharja.co.id', NULL, '$2y$12$OWLhH6Z2Kzu6xHVjieu18.w0RxjTqSvfAQ35HiUubrUzNweWDzFeu', NULL, '2026-05-04 07:31:48', '2026-05-04 07:31:48', 'member', NULL, 'female', 1),
(67, 'Dita', 'umum.dita@jasaraharja.co.id', NULL, '$2y$12$JmYd2HBJtsLZkpSga8xsze2c7.Gn6IfNPxZVdt/hdTiFQlNh3IkHq', NULL, '2026-05-04 07:31:48', '2026-05-04 07:31:48', 'member', NULL, 'female', 1),
(68, 'Patra', 'umum.patra@jasaraharja.co.id', NULL, '$2y$12$fWGbRmPd9T/5b49KtZ5XEeGhiShMDaJA05gwCw3ssZ0Ra/X2tLAne', NULL, '2026-05-04 07:31:48', '2026-05-05 11:11:38', 'member', NULL, 'male', 1),
(69, 'Santy', 'umum.santy@jasaraharja.co.id', NULL, '$2y$12$q25r3ADkRmWEakuoLMROzec9gsKeTUbShXbGpIFihLwoDVs54.YNS', NULL, '2026-05-04 07:31:48', '2026-05-05 11:11:45', 'member', NULL, 'female', 1),
(70, 'Alpha', 'umum.alpha@jasaraharja.co.id', NULL, '$2y$12$eLfwlSIGOwvDAf4/tZ.ywekZr4Qsvhay2G5OulM2lNWBMEIJwczDG', NULL, '2026-05-04 07:31:49', '2026-05-04 07:31:49', 'member', NULL, NULL, 1),
(71, 'Dany Aryanto', 'aktuaria-perusahaan.dany-aryanto@jasaraharja.co.id', NULL, '$2y$12$K12Y2GL5w0F7edf.5ma6.edoLlllnPrww/J2PAhDVLJ1MlACk4kMm', NULL, '2026-05-04 07:31:49', '2026-05-05 08:51:10', 'member', NULL, 'male', 1),
(72, 'Indra Fauzan', 'aktuaria-perusahaan.indra-fauzan@jasaraharja.co.id', NULL, '$2y$12$OXjGiNEwx5DqvSa6UWE4IOkDYAjaOmivKyXYg1OoQ85FB13X7HGea', NULL, '2026-05-04 07:31:49', '2026-05-05 08:51:25', 'member', NULL, 'male', 1),
(73, 'Gayuh Kresnawati', 'aktuaria-perusahaan.gayuh-kresnawati@jasaraharja.co.id', NULL, '$2y$12$hDACJbxOV4dBGPUxYdY0p./s4d/qSbzZ89BByZAqG4OLP5GJxrooe', NULL, '2026-05-04 07:31:49', '2026-05-04 07:31:49', 'member', NULL, 'female', 1),
(74, 'Lina Irawati', 'aktuaria-perusahaan.lina-irawati@jasaraharja.co.id', NULL, '$2y$12$l1AvwzVFPVe.5GWiLhDrl.HORSYpfRj0jY0C5ElDtUkZiBGUV2asS', NULL, '2026-05-04 07:31:50', '2026-05-04 07:31:50', 'member', NULL, 'female', 1),
(75, 'Yuniar', 'investasi.yuniar@jasaraharja.co.id', NULL, '$2y$12$FEtKyHJfiG.HQGnRF0ZWj.cBTpRSVfc7IXAHEmj7ENgmTzSgVnyNG', NULL, '2026-05-04 07:31:50', '2026-05-04 07:31:50', 'member', NULL, 'male', 1),
(76, 'Budi', 'investasi.budi@jasaraharja.co.id', NULL, '$2y$12$Tr0sMRBSl1hQZsYVl41q0.F36UEzBgZnMhPBH5RN/Z3T1Wra7M.ZC', NULL, '2026-05-04 07:31:50', '2026-05-04 07:31:50', 'member', NULL, 'male', 1),
(77, 'Fatkhur', 'investasi.fatkhur@jasaraharja.co.id', NULL, '$2y$12$FTw8DDH6D4GYmiwFu5ZhXuMDT8zTJoD.RgOuKoy5qWPGt3Au.Rxxi', NULL, '2026-05-04 07:31:51', '2026-05-04 07:31:51', 'member', NULL, 'male', 1),
(78, 'Mouammari', 'investasi.mouammari@jasaraharja.co.id', NULL, '$2y$12$V3kyH6Wv8xkYP7sKL6iHhOxLRLo4rT38qZqaGGnWJpWV7Z3WZTiy6', NULL, '2026-05-04 07:31:51', '2026-05-04 07:31:51', 'member', NULL, 'female', 1),
(79, 'Munawaroh', 'investasi.munawaroh@jasaraharja.co.id', NULL, '$2y$12$OTRT2UUqAmMLFW9kpKfPxu6./CiZz7icxcX8LIkm2T8JKeSUIDU0a', NULL, '2026-05-04 07:31:51', '2026-05-04 07:31:51', 'member', NULL, 'female', 1),
(80, 'Gita', 'investasi.gita@jasaraharja.co.id', NULL, '$2y$12$t5YWUBAPVrQeYPCY.rbpXeIRUwyJ1XAT/S3HPgHL8/KTBDt.uFG1G', NULL, '2026-05-04 07:31:51', '2026-05-04 07:31:51', 'member', NULL, 'female', 1),
(81, 'Agung', 'investasi.agung@jasaraharja.co.id', NULL, '$2y$12$Ru1YWdXrEknstt70yi5IAeZb0bYCC0OvUr3ZPSBPb3pGAZ0p4xXyi', NULL, '2026-05-04 07:31:52', '2026-05-05 10:35:38', 'member', NULL, 'male', 1),
(82, 'Atika', 'investasi.atika@jasaraharja.co.id', NULL, '$2y$12$Qa5PiScs6R1.jVz1SOHzE.1x.VPDb1HamQyImJHP1SP9XoFGQjfJa', NULL, '2026-05-04 07:31:52', '2026-05-05 10:35:49', 'member', NULL, 'female', 1),
(83, 'Ela', 'investasi.ela@jasaraharja.co.id', NULL, '$2y$12$8Nha5ORH6BdlNHIrswfAbebAHxRSa4/hoj80997MKHiAc0K4YAqDu', NULL, '2026-05-04 07:31:52', '2026-05-04 07:31:52', 'member', NULL, NULL, 1),
(84, 'Hilman Setyadi', 'akuntansi.hilman-setyadi@jasaraharja.co.id', NULL, '$2y$12$NZdwIPDEGx.dInEMP6bEVe/ywJwoeW1T7fOblCadm8Q1W32WI3WqK', NULL, '2026-05-04 07:31:52', '2026-05-04 07:31:52', 'member', NULL, 'male', 1),
(85, 'Ahmad Dzauqy AR', 'akuntansi.ahmad-dzauqy-ar@jasaraharja.co.id', NULL, '$2y$12$sq0D3AAbG0bdDR5x42mMROBfyKRdLMG1xDpye/IhJ6Et4zgqO0Oyu', NULL, '2026-05-04 07:31:53', '2026-05-04 07:31:53', 'member', NULL, 'male', 1),
(86, 'Sahal Safri Nisfan', 'akuntansi.sahal-safri-nisfan@jasaraharja.co.id', NULL, '$2y$12$MlvX0dVyLb4pTPDul.cu2uWP/cJzamp0kQXwAUk10dnKF41o2sy1S', NULL, '2026-05-04 07:31:53', '2026-05-04 07:31:53', 'member', NULL, 'male', 1),
(87, 'Hesti Juliningsih', 'akuntansi.hesti-juliningsih@jasaraharja.co.id', NULL, '$2y$12$.ABRy1ot2mrWIbxdMQEq0etnSRdVU2MVzagPajQkx2L6tjaarwCOu', NULL, '2026-05-04 07:31:53', '2026-05-04 07:31:53', 'member', NULL, 'female', 1),
(88, 'Destri Nur Hasanah', 'akuntansi.destri-nur-hasanah@jasaraharja.co.id', NULL, '$2y$12$l4jAYgXw9X7qnkqAYnH/ZOzUEei3h1KT.oXjj/BPT1xG88hcO9VgK', NULL, '2026-05-04 07:31:53', '2026-05-04 07:31:53', 'member', NULL, 'female', 1),
(89, 'Rizki Anggraeni', 'akuntansi.rizki-anggraeni@jasaraharja.co.id', NULL, '$2y$12$jvjAKc/ET.zD23e.v0umS.0q5z.LeAckguLZ.p83c2ntYTprzw2HC', NULL, '2026-05-04 07:31:54', '2026-05-04 07:31:54', 'member', NULL, 'female', 1),
(90, 'Khalil Gibran', 'akuntansi.khalil-gibran@jasaraharja.co.id', NULL, '$2y$12$ebXeNKmtidqfvAoUAj7dcOIjqXfSLLHgDX3kp0lUXj/TkFAwt58qO', NULL, '2026-05-04 07:31:54', '2026-05-04 07:31:54', 'member', NULL, NULL, 1),
(91, 'Robinson A', 'manajemen-risiko.robinson-a@jasaraharja.co.id', NULL, '$2y$12$tfR01OxW5laICko5nFvn0.MvhUEt.F7rogwN6peIOsIKmvhhsYhb.', NULL, '2026-05-04 07:31:54', '2026-05-04 07:31:54', 'member', NULL, 'male', 1),
(92, 'Deny', 'manajemen-risiko.deny@jasaraharja.co.id', NULL, '$2y$12$x..e4pzK1WCO1utNLFUluObwhXf60r5p0zebW.pIIsWsz1h.33xnC', NULL, '2026-05-04 07:31:55', '2026-05-05 09:44:49', 'member', NULL, 'male', 1),
(93, 'Agung P', 'manajemen-risiko.agung-p@jasaraharja.co.id', NULL, '$2y$12$lJcl59vSmB4e2G2nRkTyQ.B1Fii2Qx.Hxy9dUf2L6e0gdCw5EaIEW', NULL, '2026-05-04 07:31:55', '2026-05-04 07:31:55', 'member', NULL, 'male', 1),
(94, 'Anis', 'manajemen-risiko.anis@jasaraharja.co.id', NULL, '$2y$12$VFtipJuYKChLr6oEBIRIF.MCt3idmccTF1bQ9ZiCFcNsEGjIVcid6', NULL, '2026-05-04 07:31:55', '2026-05-04 07:31:55', 'member', NULL, 'female', 1),
(95, 'Dina', 'manajemen-risiko.dina@jasaraharja.co.id', NULL, '$2y$12$eIy98SoMJ6.iy/9mJtwlz.pOw74AsgLedhAqJQfhDXw454XslFiEi', NULL, '2026-05-04 07:31:55', '2026-05-04 07:31:55', 'member', NULL, 'female', 1),
(96, 'Nares', 'manajemen-risiko.nares@jasaraharja.co.id', NULL, '$2y$12$cTpLV3mZfB7Ci6Ops5MaYuYf7J6iG/4KFstKnXGYYyn//T5NOe9xu', NULL, '2026-05-04 07:31:56', '2026-05-04 07:31:56', 'member', NULL, 'female', 1),
(97, 'Agung', 'manajemen-risiko.agung@jasaraharja.co.id', NULL, '$2y$12$//l0KZV.kJpYLHT.J/DFBeKLUS4eKVkOvxCBwM6IiXFnJGLnDebcu', NULL, '2026-05-04 07:31:56', '2026-05-05 10:48:17', 'member', NULL, 'male', 1),
(98, 'Yoko', 'pelayanan-dan-tjsl.yoko@jasaraharja.co.id', NULL, '$2y$12$uLoH.uEW0utzm5cFpSWUs.6poMRGQIP7Es8/z.eIXMo0tFdW1PGme', NULL, '2026-05-04 07:31:56', '2026-05-05 09:47:21', 'member', NULL, 'male', 1),
(99, 'Rinaldi', 'pelayanan-dan-tjsl.rinaldi@jasaraharja.co.id', NULL, '$2y$12$m35uDcr8d.kNVH6j35gfG.OdFfsgyX.RKw39EkiaOW9sci4AoCHby', NULL, '2026-05-04 07:31:56', '2026-05-04 07:31:56', 'member', NULL, 'male', 1),
(100, 'Barkah', 'pelayanan-dan-tjsl.barkah@jasaraharja.co.id', NULL, '$2y$12$rwWwCiZS1uWD/lvQeO1Hl.ZcgPCjvQVE8HoxZcd9u9RCrLXjYuXE6', NULL, '2026-05-04 07:31:57', '2026-05-04 07:32:12', 'member', NULL, NULL, 1),
(101, 'Elsa', 'pelayanan-dan-tjsl.elsa@jasaraharja.co.id', NULL, '$2y$12$C3QamPIq6I2PJwfhBrlXD.lr3/PYjjp9B7TA6afYAbKlg3wZOC/WK', NULL, '2026-05-04 07:31:57', '2026-05-04 07:31:57', 'member', NULL, 'female', 1),
(102, 'Riska', 'pelayanan-dan-tjsl.riska@jasaraharja.co.id', NULL, '$2y$12$errwQHV52AQ/hFfbb6cbOeOoTf0Ny3/vUXtgatMNXkELg97/SDP/i', NULL, '2026-05-04 07:31:57', '2026-05-04 07:31:57', 'member', NULL, 'female', 1),
(103, 'Shinta', 'pelayanan-dan-tjsl.shinta@jasaraharja.co.id', NULL, '$2y$12$jYraGYPZI54YGSjrQKYSJuPm4XkGdnIdmKMoyfac5YTavZ2SuTbx2', NULL, '2026-05-04 07:31:58', '2026-05-04 07:31:58', 'member', NULL, 'female', 1),
(104, 'Augy', 'pelayanan-dan-tjsl.augy@jasaraharja.co.id', NULL, '$2y$12$nWZ/BomNKPr60Zpitl/OWOBUFYPPfpLAn3pKANLSSvb6vBl2UGq.6', NULL, '2026-05-04 07:31:58', '2026-05-05 10:52:14', 'member', NULL, 'male', 1),
(105, 'Gloria', 'pelayanan-dan-tjsl.gloria@jasaraharja.co.id', NULL, '$2y$12$nJL3AxBtBUoH18AjPHw1ZedtXfXKZ1UkHk5EhDsoqyOuZM51jpAXm', NULL, '2026-05-04 07:31:58', '2026-05-05 10:52:20', 'member', NULL, 'female', 1),
(106, 'Arkan', 'hubungan-antar-lembaga-dan-ubs.arkan@jasaraharja.co.id', NULL, '$2y$12$jAKXJZSHGnbJRjAmErGMTeiGqb53AW4dkGAXMFQHKTVeUXkmMEjpC', NULL, '2026-05-04 07:31:58', '2026-05-05 15:43:50', 'member', NULL, 'male', 1),
(107, 'Rio', 'hubungan-antar-lembaga-dan-ubs.rio@jasaraharja.co.id', NULL, '$2y$12$TIzck9tJllNog9zoXUj47eHiaBm121qDqAHoKZuWEX7FpBslz45Yq', NULL, '2026-05-04 07:31:59', '2026-05-04 07:31:59', 'member', NULL, 'male', 1),
(108, 'Ilham', 'hubungan-antar-lembaga-dan-ubs.ilham@jasaraharja.co.id', NULL, '$2y$12$bAfwujBegEniqE8X6IpFbeB01lSe4mmqRBljVWS2qHh.UoRdkj.lS', NULL, '2026-05-04 07:31:59', '2026-05-04 07:31:59', 'member', NULL, 'male', 1),
(109, 'Dayat', 'kepatuhan-dan-hukum.dayat@jasaraharja.co.id', NULL, '$2y$12$JS7tFQp4DbKlPNvUPoJaiut7/bBZjTj3XOPUPrJm9is3wTAis252O', NULL, '2026-05-04 07:31:59', '2026-05-05 09:56:17', 'member', NULL, 'male', 1),
(110, 'Fikri', 'kepatuhan-dan-hukum.fikri@jasaraharja.co.id', NULL, '$2y$12$i9dV7zuyfNeqnjTXG5ue/.5cwZlzMfMXVPJwKfo59te1HVBfeAE4G', NULL, '2026-05-04 07:31:59', '2026-05-05 09:56:33', 'member', NULL, 'male', 1),
(111, 'Tomo', 'kepatuhan-dan-hukum.tomo@jasaraharja.co.id', NULL, '$2y$12$6ErrQEEHJJPCTBx1EC4MIu.T5l0HvE4qctoii/bhQ4fgyI.025XkC', NULL, '2026-05-04 07:32:00', '2026-05-05 10:40:20', 'member', NULL, 'male', 1),
(112, 'Esta', 'kepatuhan-dan-hukum.esta@jasaraharja.co.id', NULL, '$2y$12$CRLL0e19UBeUyQoxzkEuIujwXq8JwcNXn2jZdj6ndt6s2Oq9v4rWe', NULL, '2026-05-04 07:32:00', '2026-05-04 07:32:00', 'member', NULL, 'female', 1),
(113, 'Nadira', 'kepatuhan-dan-hukum.nadira@jasaraharja.co.id', NULL, '$2y$12$95dA9wLs3M9vs/MT8gYZveneCzqjkb9TPyD4UU.1t4UxBXcDAJp.2', NULL, '2026-05-04 07:32:00', '2026-05-04 07:32:00', 'member', NULL, 'female', 1),
(114, 'Firginia', 'kepatuhan-dan-hukum.firginia@jasaraharja.co.id', NULL, '$2y$12$dPnJbFMghFCNRcBldq8TDOPGwrmAsMP/JQnVfYYgb6HFWajz246eG', NULL, '2026-05-04 07:32:01', '2026-05-04 07:32:01', 'member', NULL, 'female', 1),
(115, 'Riska', 'kepatuhan-dan-hukum.riska@jasaraharja.co.id', NULL, '$2y$12$ZCY4V/BbJsSzlGTI5.AP/eNEezZEkU6r6tQY/g8NqKOjgQmX3mefW', NULL, '2026-05-04 07:32:01', '2026-05-04 07:32:01', 'member', NULL, NULL, 1),
(116, 'Adirwan', 'kepatuhan-dan-hukum.adirwan@jasaraharja.co.id', NULL, '$2y$12$TdFSCzdKaod1d0bSveC70OOcAeguDCC855BTCtpZPXk47EBw3TStG', NULL, '2026-05-04 07:32:01', '2026-05-05 09:55:12', 'member', NULL, 'male', 1),
(117, 'Asmoro', 'kanwil-dki-jakarta.asmoro@jasaraharja.co.id', NULL, '$2y$12$lWQHoGJtMxxLlu5eXxpGxuaGrpnL/w2iXw4NH.8jTZClXHvZrpv9G', NULL, '2026-05-04 07:32:01', '2026-05-04 07:32:01', 'member', NULL, 'male', 1),
(118, 'Iril', 'kanwil-dki-jakarta.iril@jasaraharja.co.id', NULL, '$2y$12$/3QvrQ/w4s.Yo3CX8zRkCubTvCmbnv8JolY7WZKOZDg7SXEP8iV4G', NULL, '2026-05-04 07:32:02', '2026-05-04 07:32:02', 'member', NULL, 'male', 1),
(119, 'Arif', 'kanwil-dki-jakarta.arif@jasaraharja.co.id', NULL, '$2y$12$kStJkYrIoDVE/wWMR8MTku8wBLF0PS4iICIWBPHwQ2unEVrqIYPPi', NULL, '2026-05-04 07:32:02', '2026-05-04 07:32:02', 'member', NULL, 'male', 1),
(120, 'Melati', 'kanwil-dki-jakarta.melati@jasaraharja.co.id', NULL, '$2y$12$jBMowl5j6qvTuzmFqQLCPeMekVsgUaewTdn4IAvygor4Ghgc06nsi', NULL, '2026-05-04 07:32:02', '2026-05-04 07:32:02', 'member', NULL, 'female', 1),
(121, 'Riene', 'kanwil-dki-jakarta.riene@jasaraharja.co.id', NULL, '$2y$12$g9fKd.VpZN24LSTwSkb05evMVN4JFWF12fEez1LsYPRMhLSzYGpF2', NULL, '2026-05-04 07:32:03', '2026-05-04 07:32:03', 'member', NULL, 'female', 1),
(122, 'Ruth', 'kanwil-dki-jakarta.ruth@jasaraharja.co.id', NULL, '$2y$12$Sh8TKYvPSiIlzh6pf/Y/Qu6VWwE3FPK7BYidOdIeNzgRJc2hN70.K', NULL, '2026-05-04 07:32:03', '2026-05-04 07:32:03', 'member', NULL, 'female', 1),
(123, 'Fauzi', 'kanwil-dki-jakarta.fauzi@jasaraharja.co.id', NULL, '$2y$12$HHCW9KsC3/ePLyGvDQx50eUinXoSnHUqojz0vkzpbyE3e4zrnQtUi', NULL, '2026-05-04 07:32:03', '2026-05-05 10:38:01', 'member', NULL, 'male', 1),
(124, 'Ramadhani', 'human-capital.ramadhani@jasaraharja.co.id', NULL, '$2y$12$mkj55II6GnJO0xBf4tq7..vEiRg6Ofh06s4qVxgVUWopAxz7T37AS', NULL, '2026-05-04 07:32:06', '2026-05-04 07:32:06', 'member', NULL, NULL, 1),
(125, 'Dimas Hadi', 'human-capital.dimas-hadi@jasaraharja.co.id', NULL, '$2y$12$hw4z4z8AXiTI.QzBl1ysSegp0g/BcsRHU9/LtFLrP94DSYYxicSzO', NULL, '2026-05-04 07:32:07', '2026-05-04 07:32:07', 'member', NULL, NULL, 1),
(126, 'Dodo', 'human-capital.dodo@jasaraharja.co.id', NULL, '$2y$12$AFRLBdw97Sb5DvgmsnFiKuYHuXKZUmzLW.AHcx4RnBiD8OPmIlxl2', NULL, '2026-05-04 07:32:07', '2026-05-04 07:32:07', 'member', NULL, NULL, 1),
(127, 'Adit', 'human-capital.adit@jasaraharja.co.id', NULL, '$2y$12$uqqlPIk2EEz8pWMf3HhxUeZNThNPnmp.xjcAYkwR4vhQ4mO2PZ4Ba', NULL, '2026-05-04 07:32:07', '2026-05-04 07:32:07', 'member', NULL, NULL, 1),
(128, 'Aryo', 'satuan-pengawasan-intern.aryo@jasaraharja.co.id', NULL, '$2y$12$lTTjxaBO0ure7Rmgcc3kWOGGQGMxsq09o7tkggLi5URkdSG6LrWKO', NULL, '2026-05-04 07:32:08', '2026-05-04 07:32:08', 'member', NULL, NULL, 1),
(129, 'Heri', 'satuan-pengawasan-intern.heri@jasaraharja.co.id', NULL, '$2y$12$XTKc6fYDn5G4kX8ACHpK9uFwPCtUjgKvojvjRt85lEEx6SEysWbMy', NULL, '2026-05-04 07:32:09', '2026-05-04 07:32:09', 'member', NULL, NULL, 1),
(130, 'Yoga', 'umum.yoga@jasaraharja.co.id', NULL, '$2y$12$jZ/1pvUwS2rmOWp04WEfMePXQT3kjpzrvI9Y6jhS.9Cq7XJrN1q.q', NULL, '2026-05-04 07:32:09', '2026-05-04 07:32:09', 'member', NULL, NULL, 1),
(131, 'Rahman', 'umum.rahman@jasaraharja.co.id', NULL, '$2y$12$4hGqEmvr72535JxNJbQYcuVVDjOZvF6rCzlUlHeRlCUW.gd4Lo4mS', NULL, '2026-05-04 07:32:10', '2026-05-04 07:32:10', 'member', NULL, NULL, 1),
(132, 'Komang', 'sekretariat-perusahaan.komang@jasaraharja.co.id', NULL, '$2y$12$xSWZS602a3dFqCcjZ3yH4usm.ns7xOItz49hjYUGc02yrRcecF8Ja', NULL, '2026-05-04 07:32:11', '2026-05-04 07:32:11', 'member', NULL, NULL, 1),
(133, 'Ananda', 'sekretariat-perusahaan.ananda@jasaraharja.co.id', NULL, '$2y$12$8DnA8eizt0kY1d4l26acI.ndVMsyi.Fa1Jc8fM34n5b58Sms.VuPq', NULL, '2026-05-04 07:32:11', '2026-05-04 07:32:11', 'member', NULL, NULL, 1),
(134, 'Subhi', 'pelayanan-dan-tjsl.subhi@jasaraharja.co.id', NULL, '$2y$12$TaGyEkTe3TuHzbZH2w4A5.xvujpOOT.OBSMWfyV7mqhifzrhd7Sme', NULL, '2026-05-04 07:32:12', '2026-05-04 07:32:12', 'member', NULL, NULL, 1),
(135, 'Miqdad', 'pelayanan-dan-tjsl.miqdad@jasaraharja.co.id', NULL, '$2y$12$x8dlELTJB9GMvTgZeHNJc.xAjiboFg7qGE.ohrQJ9l0eekhlo8f06', NULL, '2026-05-04 07:32:13', '2026-05-04 07:32:13', 'member', NULL, NULL, 1),
(136, 'Gibran', 'akuntansi.gibran@jasaraharja.co.id', NULL, '$2y$12$MeFggPQ1LaNVbKa.t14dQe2PqUULao1UIAJCRUXloFlKDEX/mo1km', NULL, '2026-05-04 07:32:13', '2026-05-04 07:32:13', 'member', NULL, NULL, 1),
(137, 'Yogie', 'akuntansi.yogie@jasaraharja.co.id', NULL, '$2y$12$RGckrqLHBtZC12NlLDAKPelHNtl52cRqlsL5NDqh1zabQuLvYHpUe', NULL, '2026-05-04 07:32:13', '2026-05-04 07:32:13', 'member', NULL, NULL, 1),
(138, 'Dzauqy', 'akuntansi.dzauqy@jasaraharja.co.id', NULL, '$2y$12$5QLdRGUY/gcFRPM4YVQzX.vsGO1qvZLoxQ/WMu0Uys998hTa1oTK2', NULL, '2026-05-04 07:32:14', '2026-05-04 07:32:14', 'member', NULL, NULL, 1),
(139, 'Hanafi', 'akuntansi.hanafi@jasaraharja.co.id', NULL, '$2y$12$kLVz3AyYx.I.0xBk1yuyBuaOUQHeTmvPNkcAod.LRiA/oUVMmjp3O', NULL, '2026-05-04 07:32:14', '2026-05-04 07:32:14', 'member', NULL, NULL, 1),
(140, 'Hilman', 'akuntansi.hilman@jasaraharja.co.id', NULL, '$2y$12$otdwUMgpJO2gWe8MGv.un.azf5JtMM/urmaIHHeWKNjIF0y0njIU2', NULL, '2026-05-04 07:32:14', '2026-05-05 08:50:03', 'member', NULL, 'male', 1),
(141, 'Bisma', 'keuangan.bisma@jasaraharja.co.id', NULL, '$2y$12$UzGG.sPXYI5TeGiyjKFGb.cqMQXZrGvii.q0QZ3qT8tTN7VLhKglO', NULL, '2026-05-04 07:32:14', '2026-05-04 07:32:14', 'member', NULL, NULL, 1),
(142, 'Rizki', 'keuangan.rizki@jasaraharja.co.id', NULL, '$2y$12$DJxCfFynQKjckwDjvA84Ru5wEtU2UkXAYHeeGFRdeLgphmcbre5V2', NULL, '2026-05-04 07:32:15', '2026-05-04 07:32:15', 'member', NULL, NULL, 1),
(143, 'Fahmie', 'keuangan.fahmie@jasaraharja.co.id', NULL, '$2y$12$eE6F/Bi5Y0DLEFZwauODz.XCxcb5563Wvz8fptA.GDHktBbLCgO8K', NULL, '2026-05-04 07:32:16', '2026-05-04 07:32:16', 'member', NULL, NULL, 1),
(144, 'Radito', 'strategi-transformasi-dan-korporasi.radito@jasaraharja.co.id', NULL, '$2y$12$Bk6vRbq6c5e//JOIaBVCGe.0kOZBMrED4mkjuI8Ga/X0f0CGROT4a', NULL, '2026-05-04 07:32:16', '2026-05-04 07:32:16', 'member', NULL, NULL, 1),
(145, 'Prima', 'strategi-transformasi-dan-korporasi.prima@jasaraharja.co.id', NULL, '$2y$12$wTd9dtRnY34cPaOsz.GMTuko3h0dJZJS/RRjrXBtgIj0ii0SwR0sG', NULL, '2026-05-04 07:32:16', '2026-05-04 07:32:16', 'member', NULL, NULL, 1),
(146, 'Vierdy', 'strategi-transformasi-dan-korporasi.vierdy@jasaraharja.co.id', NULL, '$2y$12$5GEv4DCkB8W8.V/7aX88iubxLiENYQBwRuSU2CWH2j0sqE8.mtKKm', NULL, '2026-05-04 07:32:17', '2026-05-04 07:32:17', 'member', NULL, NULL, 1),
(147, 'Harwan', 'kepatuhan-dan-hukum.harwan@jasaraharja.co.id', NULL, '$2y$12$2MJ3DtfrpHx5qPOh8uhcWOUmbHsbHrwSBMooM8hkERRGi7OY1v3p.', NULL, '2026-05-04 07:32:17', '2026-05-04 07:32:17', 'member', NULL, NULL, 1),
(148, 'Aldino', 'kepatuhan-dan-hukum.aldino@jasaraharja.co.id', NULL, '$2y$12$xzIr0x0Rkl9j7JbdTU7fH.fopPtsxCW4ZL/i/fRY/LORzx39cOJIC', NULL, '2026-05-04 07:32:18', '2026-05-04 07:32:18', 'member', NULL, NULL, 1),
(149, 'Ujang', 'manajemen-risiko.ujang@jasaraharja.co.id', NULL, '$2y$12$sb8oxVNz1HZKBsw3g7oJYetS7zsR.dOSRUL5szOyg3uczt8IKEh4S', NULL, '2026-05-04 07:32:19', '2026-05-04 07:32:19', 'member', NULL, NULL, 1),
(150, 'Guntur', 'manajemen-risiko.guntur@jasaraharja.co.id', NULL, '$2y$12$OrPlq9EA77q70uA1Bm3ehOlxs0zkNjJDCU.mH40QlaZsP/KW8EZrG', NULL, '2026-05-04 07:32:19', '2026-05-04 07:32:19', 'member', NULL, NULL, 1),
(151, 'Reza', 'asuransi.reza@jasaraharja.co.id', NULL, '$2y$12$Ke0Lc/IzzG3la1Ta3q0KsutO91UYKchqjLCg0C/GdOxcwm3ri9Mpu', NULL, '2026-05-04 07:32:21', '2026-05-04 07:32:21', 'member', NULL, NULL, 1),
(152, 'Arnold', 'teknologi-informasi-dan-komunikasi.arnold@jasaraharja.co.id', NULL, '$2y$12$/o/NjaU9o7RvzHkIPYzyIu0OCsORVdOsPVUDHiU/BW84IL3/hfXHG', NULL, '2026-05-04 07:32:22', '2026-05-04 07:32:22', 'member', NULL, NULL, 1),
(153, 'Aby', 'teknologi-informasi-dan-komunikasi.aby@jasaraharja.co.id', NULL, '$2y$12$ronpENTOO/GEaFYA1EPpu.BtH9zdPuK1u0UZkQVIFUDCTbIjfWMBq', NULL, '2026-05-04 07:32:22', '2026-05-04 07:32:22', 'member', NULL, NULL, 1),
(154, 'Fadjrin', 'teknologi-informasi-dan-komunikasi.fadjrin@jasaraharja.co.id', NULL, '$2y$12$r74KJwWzWr0K0sfXSV6iAOKhArdn3GboaWrWhFJewWcVDyATBoYWy', NULL, '2026-05-04 07:32:22', '2026-05-04 07:32:22', 'member', NULL, NULL, 1),
(155, 'Yuniar Ahmadani', 'investasi.yuniar-ahmadani@jasaraharja.co.id', NULL, '$2y$12$ZekIezVBxitk2u2WW8avaeMeOBlGOHBoho7Wz6efK0y6vcVc6u2TO', NULL, '2026-05-04 07:32:22', '2026-05-04 07:32:22', 'member', NULL, NULL, 1),
(156, 'IGN Budi Kuncara', 'investasi.ign-budi-kuncara@jasaraharja.co.id', NULL, '$2y$12$ec9fV1CPYjVFJSBduzQ9pONNO2YpDCTklttL.P5dUXuZXow2Vw7Bi', NULL, '2026-05-04 07:32:23', '2026-05-04 07:32:23', 'member', NULL, NULL, 1),
(157, 'Agung Rizka R', 'investasi.agung-rizka-r@jasaraharja.co.id', NULL, '$2y$12$V44u1nuEpGRP1JxHL3D.E.dJijcAz14xMfyMJrIDv6iIFLBCbjfKa', NULL, '2026-05-04 07:32:23', '2026-05-04 07:32:23', 'member', NULL, NULL, 1),
(158, 'Ferhat Husein', 'investasi.ferhat-husein@jasaraharja.co.id', NULL, '$2y$12$XXMPf18hoYuL06SAeK0j/u1ThVMgxEiPpXoMqgLJZq/TEaPHCuK8K', NULL, '2026-05-04 07:32:23', '2026-05-04 07:32:23', 'member', NULL, NULL, 1),
(159, 'Fatkhur Haris', 'investasi.fatkhur-haris@jasaraharja.co.id', NULL, '$2y$12$4Izcw3pm4SZGWdu7zGc0wuuX3rHkd2IO5QycilQJp0VBn4BPlRd7G', NULL, '2026-05-04 07:32:24', '2026-05-04 07:32:24', 'member', NULL, NULL, 1),
(160, 'Michael', 'aktuaria-perusahaan.michael@jasaraharja.co.id', NULL, '$2y$12$9yCBC8C5XUi2STO0L0cuUOW1j6uxQqUXkZP07e3hFpo60AhTE723m', NULL, '2026-05-04 07:32:24', '2026-05-04 07:32:24', 'member', NULL, NULL, 1),
(161, 'Arif K', 'aktuaria-perusahaan.arif-k@jasaraharja.co.id', NULL, '$2y$12$2RSIkhVhzy0FP8ThBfntveJbOM7JUHdgcwYccmP7TDko1QCMppDGW', NULL, '2026-05-04 07:32:24', '2026-05-04 07:32:24', 'member', NULL, NULL, 1),
(162, 'Hublem 1', 'hublem1@jasaraharja.co.id', NULL, '$2y$12$QCpfuiwPWyfT4AS.Koz8Xujz7tR5rMmGvTQXoK.QDUGrPMshYxER.', NULL, '2026-05-04 23:25:49', '2026-05-04 23:29:59', 'member', NULL, 'female', 1),
(163, 'Hublem 2', 'hublem2@jasaraharja.co.id', NULL, '$2y$12$d0ICc4eidCZAZL3dsVXABOiE00VHd1zVpoBZsBjWo3ZqCXRdkuDm6', NULL, '2026-05-04 23:26:41', '2026-05-04 23:30:16', 'member', NULL, 'female', 1),
(164, 'pegawai', 'pegawai@jasaraharja.co.id', NULL, '$2y$12$dX0D/kpaE6ZVclVshBflXeRvGCev7DBO5X1SVh7bO6Y9fwBMlH7mi', NULL, '2026-05-04 23:27:33', '2026-05-04 23:27:33', 'member', NULL, NULL, 1),
(165, 'Hublem3', 'hublem3@jasaraharja.co.id', NULL, '$2y$12$QLE0UrDbhFUf6641pClqT.13ZicbRWtvBZUJYFysYch0r4b5GTzyC', NULL, '2026-05-05 10:55:35', '2026-05-05 10:55:35', 'member', NULL, 'female', 1),
(166, 'Reno H', 'renoh@jasaraharja.co.id', NULL, '$2y$12$u8px5Ze5Hvrpt0GRYQ.4Q.oKyw7gn7RJDthZO9X6EzClCaSqgzpQa', NULL, '2026-05-05 11:09:00', '2026-05-05 11:09:00', 'member', NULL, 'male', 1),
(167, 'Cut Ayu', 'cutayu@jasaraharja.co.id', NULL, '$2y$12$58tnzyXUKTnIP4I8r3u/SeoK4LmIAL4zXELQOQ1z0K/V7Vt.DMMBC', NULL, '2026-05-06 08:33:28', '2026-05-06 08:33:28', 'member', NULL, 'female', 1),
(168, 'Ari Prasojo', 'ojo@jasaraharja.co.id', NULL, '$2y$12$ovEb3J0EmFq4ZEGvDIQ6h.pVkxXN6lzz4NDxRKaUM5mP82fAaeqLm', NULL, '2026-05-06 08:33:55', '2026-05-06 08:33:55', 'member', NULL, 'male', 1),
(169, 'Nurul', 'nurul@jasaraharja.co.id', NULL, '$2y$12$ODlN8hRM5Klk4vskXLzbFOBF6GIi0n7W58vUcwCdafE.Q7H4QhuV.', NULL, '2026-05-06 15:51:59', '2026-05-06 15:51:59', 'member', NULL, 'female', 1),
(170, 'Christin', 'christin@jasaraharja.co.id', NULL, '$2y$12$x.vuq6b/Pso9mwM7As835OvtvmLaFpVeoqvOYOikb44W1iL8aOukO', NULL, '2026-05-07 10:56:50', '2026-05-07 10:56:50', 'member', NULL, 'female', 1),
(171, 'Apriansyah', 'apriansyah@jasaraharja.co.id', NULL, '$2y$12$igCW7BivKdgpChiM7HFk6.mebCLgHc8RzkERv.biR7Em1FQD41Tdu', NULL, '2026-05-07 14:25:43', '2026-05-07 14:25:43', 'member', NULL, 'male', 1),
(172, 'JR Club Admin DKI', 'admin.dki@jasaraharja.co.id', NULL, '$2y$12$VH/QfciWzn0bS3SMs4/toe6T5umwMarzhNFL.pwQ6ZCIXtK8dEq3y', NULL, '2026-05-29 04:27:07', '2026-05-29 04:27:07', 'admin', NULL, 'male', 2),
(173, 'JR Club Admin Jateng', 'admin.jateng@jasaraharja.co.id', NULL, '$2y$12$GjMKHff1wbCbucTC2eeRGeCx1z0mjQxSBprRmjS/Vv6G7CapeTbJ6', NULL, '2026-05-29 04:27:07', '2026-05-29 04:27:07', 'admin', NULL, 'male', 3),
(174, 'JR Club Admin Lampung', 'admin.lampung@jasaraharja.co.id', NULL, '$2y$12$mw/CAWrm7k8FDiTyU9lK8OpZBaTE6ZKT9BkwAdyIUdXfoV6yjRno.', NULL, '2026-05-29 04:27:07', '2026-05-29 04:27:07', 'admin', NULL, 'male', 4);

INSERT INTO "public"."sessions" ("id", "user_id", "ip_address", "user_agent", "payload", "last_activity") VALUES
('0JdLT4wWQwmj9GHNEe8pRXGHJQMeTaX07HG2NGB2', NULL, '162.243.59.115', 'Python/3.12 aiohttp/3.13.5', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ3BORVJhbG1Sc2xWTWpKTGNaQXJ2ZFdIVEhPTlppbVAwYW9POE1sQSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly8xMzkuNTkuMTA3LjY5OjgwODAiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1780042925),
('18dzzDcpUxIGOJ3yVvQJYSH0o49rP5TvbKVBKFvf', NULL, '185.226.93.242', 'Go-http-client/1.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZW5BWHljdFBwYWhQdk05bVZXVHBiZUo3Tm9YeG1BOGtWMzFGTnNMYiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzE6Imh0dHA6Ly8xMzkuNTkuMTA3LjY5OjgwODAvbG9naW4iO3M6NToicm91dGUiO3M6NToibG9naW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1780039928),
('2kdyuIcKxRjvuMnI4KHIhlwa3aT9HNTRNmhcipnJ', NULL, '182.253.48.21', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiTmdpeGtqUVZSRm8yT1NHSGNDVnJDaDlEQnVQWHhMUVJsRDFQdWNPTyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1780022569),
('2ubFT7OxhDOyFQVLjk0gyodhQu379guaYQ2w8C6b', NULL, '104.248.47.99', '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoic1dZTnNwVUxrVW9ObzRnVTZqZjdTSDhaVTVxREd2bGF3TzVMamh6MSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6ODoiaHR0cDovL18iO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1780039829),
('3VE2p61F0JoqwxU01CLZ4R1qURFcWl0gyGBNPhTl', NULL, '18.220.79.30', 'visionheight.com/scan Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSFdRbDVaZkl4N0pwOUIxWjRBNk5kUzU5M2p5bmZJWkN6WkMzWEZtVyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly8xMzkuNTkuMTA3LjY5OjgwODAiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1780024497),
('46wgn8apr621NoEI0TXl5rTvbfP3ZUN83lyudzSN', NULL, '18.220.79.30', 'visionheight.com/scan Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidmZtQVhLV1lWN0p0cHZpbEttNHBwb2lHRFV1ZW9GTXNXNGlnVWV1RiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly8xMzkuNTkuMTA3LjY5OjgwODAiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1780024536),
('70zWHAthhRjVt7ZzNGsRClJAhjeaFj5OeKxxUJmo', NULL, '180.252.82.233', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRDNYZ21FOTQwQ1NIWDZncjR2ODc4N21iRXlTMGFmcUxyZW5qdjVtYyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzY6Imh0dHBzOi8vanJjbHViLmRlZGVzZnIubXkuaWQvbGVhZ3VlcyI7czo1OiJyb3V0ZSI7czoxMzoibGVhZ3Vlcy5pbmRleCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1780022815),
('Av3ziDG9TO7BZwR9KKo126hJpz23QwJcpirwkZZb', NULL, '207.241.173.115', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:150.0) Gecko/20100101 Firefox/150.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMW5od3JJVHBoSzhQYVBpbVpFMm4zeXYwSUcxMW4yWG5tYWNqMkhkSCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly8xMzkuNTkuMTA3LjY5OjgwODAiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1780040567),
('Dkvxy9A4uZdscl2sEu47QiLK1bKNe1nejQCT1bCU', NULL, '167.99.142.36', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQkw0UXlBMldKQTdBejk2QU1NUUIwTzdmV0JWNHlOQW1rSmx3cmROaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjA6Imh0dHA6Ly8xMzkuNTkuMTA3LjY5IjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1780028787),
('Ezy5vEKVjGSpm6iSfb1jLwesPaIT8jFX7QekQczm', NULL, '180.252.82.233', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/601.2.4 (KHTML, like Gecko) Version/9.0.1 Safari/601.2.4 facebookexternalhit/1.1 Facebot Twitterbot/1.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMk1GZjI0Z2hCZ2ZjeFd3ZE1oNDdQV004bFBjc1Vyekh3WVZpbkpSdiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzY6Imh0dHBzOi8vanJjbHViLmRlZGVzZnIubXkuaWQvbGVhZ3VlcyI7czo1OiJyb3V0ZSI7czoxMzoibGVhZ3Vlcy5pbmRleCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1780022816),
('I7KB1cTsAhOP96OMXsRbQtz5voVtKQYs3V9aDmA1', NULL, '140.213.21.117', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidkZUTjFyRVZqSEI4NWZWVVZ0RjBZQkc0eHNXRkRvbkhIWW9BcWtiNyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzY6Imh0dHBzOi8vanJjbHViLmRlZGVzZnIubXkuaWQvbGVhZ3VlcyI7czo1OiJyb3V0ZSI7czoxMzoibGVhZ3Vlcy5pbmRleCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1780022247),
('JIS2lbhLQpjJ4WP2rGgnOY8cFLRpFv5qBxcKoFCo', NULL, '3.238.51.214', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZDVKdnp2anRjQkNPT0dPeUw4T051aWhGWElYN2dwOVZ3UU1GUnJIViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly8xMzkuNTkuMTA3LjY5OjgwODAiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1780022033),
('PzfmkwFGjvzjitYRQ2OQmBtZRMmOoENgWl65SrKW', NULL, '54.211.104.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSlBtcGhIbFY2d2JnVVpqYVNvQnJiSnNCSEYzZE5aQWV6ZWFBQ0tsSyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly8xMzkuNTkuMTA3LjY5OjgwODAiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1780021090),
('WRnSJnExGAjcSahu5oflZ5GnjQ3QA7xB5MUes3zd', NULL, '90.151.171.108', 'Mozilla/5.0 (Windows NT 6.1; rv:16.0) Gecko/20100101 Firefox/16.0 (+https://best-proxies.ru/faq/#from)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT3pIa0RQWXBKUTlrME5LY29xQVJqOERlNVRtbkx1UWV6MkxrYzlLUSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly9hcGkuaXBpZnkub3JnLz9aNzkwMTcyOTUzMzJRMT0iO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1780035035),
('XmNJoTVMPQtcNovn4C30Tdl2fpnB4qLIntLTh3z1', NULL, '176.65.139.204', 'Go-http-client/1.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQTJ1bndwN2hzaVpYUTcxTGpYTUZaYzM0NzJwTFJaOFNGbGhFZFJLSyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzE6Imh0dHA6Ly8xMzkuNTkuMTA3LjY5OjgwODAvbG9naW4iO3M6NToicm91dGUiO3M6NToibG9naW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1780023862),
('XpGOwgseVStW5AmebTDUNXyCzgSTTV1hNv9FltKQ', NULL, '18.220.79.30', 'visionheight.com/scan Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibnc2OGFDY1ZjekUzSHVVWWlEemJCSTdPZEl6RHVDaEtRclczNzh5ZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly8xMzkuNTkuMTA3LjY5OjgwODAvbGVhZ3VlcyI7czo1OiJyb3V0ZSI7czoxMzoibGVhZ3Vlcy5pbmRleCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1780024499),
('g5Got6xPLVqiwnH34TG80ZifudO85BQRxfQZa1Lx', NULL, '66.132.172.129', 'Mozilla/5.0 (compatible; CensysInspect/1.1; +https://about.censys.io/)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibnRid3U4TklnVkpScVRXTlc1dGJ4dnVZb3I3dGQ4YkpRd2NFb29XMyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzE6Imh0dHA6Ly8xMzkuNTkuMTA3LjY5OjgwODAvbG9naW4iO3M6NToicm91dGUiO3M6NToibG9naW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1780019352),
('iGovZR6Hg1z54xPMlItljqBiv9Zlgj9OukTGipZQ', NULL, '66.132.172.129', 'Mozilla/5.0 (compatible; CensysInspect/1.1; +https://about.censys.io/)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMEFtdDA4cGF4SXE3UDRMakp4cWdKVGNFWEhJNHRqWGU4RFAzUktkMCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly8xMzkuNTkuMTA3LjY5OjgwODAvbGVhZ3VlcyI7czo1OiJyb3V0ZSI7czoxMzoibGVhZ3Vlcy5pbmRleCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1780019313),
('nxqijWCEqRNo82CMjQf5DJlqzhz435KMjflX5fAM', NULL, '147.185.132.21', 'Hello from Palo Alto Networks, find out more about our scans in https://docs-cortex.paloaltonetworks.com/r/1/Cortex-Xpanse/Scanning-activity', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ252SXN0NjR1TVhhNERsUENvQ0phVXhOa1N0eGVKOVN2cmQwUU5QNSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6ODoiaHR0cDovL18iO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1780018399),
('p5RiAsVztHAeXozu6gpsnuRkFiNdFulXQ0SDrvqD', NULL, '66.132.172.129', 'Mozilla/5.0 (compatible; CensysInspect/1.1; +https://about.censys.io/)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVHRhRm5iZzhCbk5uUmJzVm1rVzY3ZFRYakcybUI1MXFNZkd1T2RMTiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly8xMzkuNTkuMTA3LjY5OjgwODAiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1780019307),
('t4wQHKOfk6FU1CXrKR5foa3GzXFD6isp5MCEelEH', NULL, '45.198.224.5', 'Go-http-client/1.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSXdLeVFncklMNmc4dFBsQlVyYnc3NzJ0Z2QxSTFXbmI1U0NuUUhwdyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzE6Imh0dHA6Ly8xMzkuNTkuMTA3LjY5OjgwODAvbG9naW4iO3M6NToicm91dGUiO3M6NToibG9naW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1780033049);

INSERT INTO "public"."activities" ("id", "sport_id", "created_by", "title", "description", "location", "scheduled_at", "max_participants", "status", "created_at", "updated_at", "branch_id") VALUES
(1, 4, 1, 'After Work Smash', 'Weekly badminton session every Thursday from 17.00 to 20.00 at Grand Sport Centre, Kuningan.', 'Grand Sport Centre, Kuningan', '2026-05-07 17:00:00', 12, 'open', '2026-05-04 07:32:03', '2026-05-04 07:32:03', NULL),
(2, 1, 1, 'Padel Midweek Mood Booster', 'Weekly padel session every Wednesday from 18.00 to 20.00 at Castle Padel Court.', 'Castle Padel Court', '2026-05-06 18:00:00', 6, 'open', '2026-05-04 07:32:03', '2026-05-04 07:32:03', NULL);

INSERT INTO "public"."teams" ("id", "name", "sport_id", "created_by", "created_at", "updated_at", "logo_path", "branch_id") VALUES
(1, 'Human Capital', 4, 1, '2026-05-04 07:31:28', '2026-05-04 07:31:28', '/images/team-logo/Human Capital.png', NULL),
(2, 'Sekretariat Perusahaan', 4, 1, '2026-05-04 07:31:31', '2026-05-04 07:31:31', '/images/team-logo/Sekretariat Perusahaan.jpeg', NULL),
(3, 'Teknologi Informasi dan Komunikasi', 4, 1, '2026-05-04 07:31:34', '2026-05-04 07:31:34', '/images/team-logo/Teknologi Informasi dan Komunikasi.jpeg', NULL),
(4, 'Keuangan', 4, 1, '2026-05-04 07:31:36', '2026-05-04 07:31:36', '/images/team-logo/Keuangan.jpeg', NULL),
(5, 'Asuransi', 4, 1, '2026-05-04 07:31:39', '2026-05-04 07:31:39', '/images/team-logo/Asuransi.jpeg', NULL),
(6, 'Strategi Transformasi dan Korporasi', 4, 1, '2026-05-04 07:31:42', '2026-05-04 07:31:42', '/images/team-logo/Strategi Transformasi dan Korporasi.jpeg', NULL),
(7, 'Satuan Pengawasan Intern', 4, 1, '2026-05-04 07:31:44', '2026-05-04 07:31:44', '/images/team-logo/Satuan Pengawasan Intern.jpeg', NULL),
(8, 'Umum', 4, 1, '2026-05-04 07:31:46', '2026-05-04 07:31:46', '/images/team-logo/Umum.png', NULL),
(9, 'Aktuaria Perusahaan', 4, 1, '2026-05-04 07:31:49', '2026-05-04 07:31:49', '/images/team-logo/Aktuaria Perusahaan.jpeg', NULL),
(10, 'Investasi', 4, 1, '2026-05-04 07:31:50', '2026-05-04 07:31:50', '/images/team-logo/Investasi.png', NULL),
(11, 'Akuntansi', 4, 1, '2026-05-04 07:31:52', '2026-05-04 07:31:52', '/images/team-logo/Akuntansi.jpeg', NULL),
(12, 'Manajemen Risiko', 4, 1, '2026-05-04 07:31:54', '2026-05-04 07:31:54', '/images/team-logo/Manajemen Risiko.jpeg', NULL),
(13, 'Pelayanan dan TJSL', 4, 1, '2026-05-04 07:31:56', '2026-05-04 07:31:56', '/images/team-logo/Pelayanan dan TJSL.jpeg', NULL),
(14, 'Hubungan Antar Lembaga dan UBS', 4, 1, '2026-05-04 07:31:58', '2026-05-04 07:31:58', '/images/team-logo/Hubungan Antar Lembaga dan UBS.jpeg', NULL),
(15, 'Kepatuhan dan Hukum', 4, 1, '2026-05-04 07:31:59', '2026-05-04 07:31:59', '/images/team-logo/Kepatuhan dan Hukum.jpeg', NULL),
(16, 'Kanwil DKI Jakarta', 4, 1, '2026-05-04 07:32:01', '2026-05-04 07:32:01', '/images/team-logo/Kanwil DKI Jakarta.jpeg', NULL),
(17, 'Human Capital', 2, 1, '2026-05-04 07:32:06', '2026-05-04 07:32:06', '/images/team-logo/Human Capital.png', NULL),
(18, 'Satuan Pengawasan Intern', 2, 1, '2026-05-04 07:32:07', '2026-05-04 07:32:07', '/images/team-logo/Satuan Pengawasan Intern.jpeg', NULL),
(19, 'Umum', 2, 1, '2026-05-04 07:32:09', '2026-05-04 07:32:09', '/images/team-logo/Umum.png', NULL),
(20, 'Sekretariat Perusahaan', 2, 1, '2026-05-04 07:32:10', '2026-05-04 07:32:10', '/images/team-logo/Sekretariat Perusahaan.jpeg', NULL),
(21, 'Pelayanan dan TJSL', 2, 1, '2026-05-04 07:32:11', '2026-05-04 07:32:11', '/images/team-logo/Pelayanan dan TJSL.jpeg', NULL),
(22, 'Akuntansi', 2, 1, '2026-05-04 07:32:13', '2026-05-04 07:32:13', '/images/team-logo/Akuntansi.jpeg', NULL),
(23, 'Keuangan', 2, 1, '2026-05-04 07:32:14', '2026-05-04 07:32:14', '/images/team-logo/Keuangan.jpeg', NULL),
(24, 'Strategi Transformasi dan Korporasi', 2, 1, '2026-05-04 07:32:16', '2026-05-04 07:32:16', '/images/team-logo/Strategi Transformasi dan Korporasi.jpeg', NULL),
(25, 'Kepatuhan dan Hukum', 2, 1, '2026-05-04 07:32:17', '2026-05-04 07:32:17', '/images/team-logo/Kepatuhan dan Hukum.jpeg', NULL),
(26, 'Manajemen Risiko', 2, 1, '2026-05-04 07:32:18', '2026-05-04 07:32:18', '/images/team-logo/Manajemen Risiko.jpeg', NULL),
(27, 'Asuransi', 2, 1, '2026-05-04 07:32:20', '2026-05-04 07:32:20', '/images/team-logo/Asuransi.jpeg', NULL),
(28, 'Teknologi Informasi dan Komunikasi', 2, 1, '2026-05-04 07:32:21', '2026-05-04 07:32:21', '/images/team-logo/Teknologi Informasi dan Komunikasi.jpeg', NULL),
(29, 'Investasi', 2, 1, '2026-05-04 07:32:22', '2026-05-04 07:32:22', '/images/team-logo/Investasi.png', NULL),
(30, 'Aktuaria Perusahaan', 2, 1, '2026-05-04 07:32:24', '2026-05-04 07:32:24', '/images/team-logo/Aktuaria Perusahaan.jpeg', NULL);

INSERT INTO "public"."sports" ("id", "name", "icon", "max_players_per_team", "description", "created_at", "updated_at") VALUES
(1, 'Padel', 'sports_tennis', 2, 'Fast doubles sessions after work.', '2026-05-04 07:31:28', '2026-05-04 07:31:28'),
(2, 'Basketball', 'sports_basketball', 5, 'Indoor half-court and tournament games.', '2026-05-04 07:31:28', '2026-05-04 07:31:28'),
(3, 'Mini Soccer', 'sports_soccer', 5, 'High-energy five-a-side matches.', '2026-05-04 07:31:28', '2026-05-04 07:31:28'),
(4, 'Badminton', 'sports_tennis', 2, 'Singles and doubles court sessions.', '2026-05-04 07:31:28', '2026-05-04 07:31:28'),
(5, 'Other', 'sports_other', 6, 'Branch team other.', '2026-05-04 07:31:28', '2026-05-04 07:31:28');

INSERT INTO "public"."activity_participants" ("id", "activity_id", "user_id", "joined_at", "created_at", "updated_at") VALUES
(1, 1, 2, '2026-05-04 07:32:03', '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(2, 1, 3, '2026-05-04 07:32:03', '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(3, 1, 4, '2026-05-04 07:32:03', '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(4, 1, 5, '2026-05-04 07:32:03', '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(5, 1, 6, '2026-05-04 07:32:03', '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(6, 1, 7, '2026-05-04 07:32:03', '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(7, 1, 8, '2026-05-04 07:32:03', '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(8, 1, 9, '2026-05-04 07:32:03', '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(9, 1, 10, '2026-05-04 07:32:03', '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(10, 1, 11, '2026-05-04 07:32:03', '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(11, 1, 12, '2026-05-04 07:32:03', '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(12, 1, 13, '2026-05-04 07:32:03', '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(13, 2, 2, '2026-05-04 07:32:03', '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(14, 2, 3, '2026-05-04 07:32:03', '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(15, 2, 4, '2026-05-04 07:32:03', '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(16, 2, 5, '2026-05-04 07:32:03', '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(17, 2, 6, '2026-05-04 07:32:03', '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(18, 2, 7, '2026-05-04 07:32:03', '2026-05-04 07:32:03', '2026-05-04 07:32:03');

INSERT INTO "public"."team_members" ("id", "team_id", "user_id", "role", "joined_at", "created_at", "updated_at") VALUES
(1, 1, 2, 'captain', '2026-05-04 07:31:29', '2026-05-04 07:31:31', '2026-05-04 07:31:31'),
(2, 1, 3, 'member', '2026-05-04 07:31:29', '2026-05-04 07:31:31', '2026-05-04 07:31:31'),
(3, 1, 4, 'substitute', '2026-05-04 07:31:29', '2026-05-04 07:31:31', '2026-05-04 07:31:31'),
(4, 1, 5, 'member', '2026-05-04 07:31:30', '2026-05-04 07:31:31', '2026-05-04 07:31:31'),
(5, 1, 6, 'member', '2026-05-04 07:31:30', '2026-05-04 07:31:31', '2026-05-04 07:31:31'),
(6, 1, 7, 'substitute', '2026-05-04 07:31:30', '2026-05-04 07:31:31', '2026-05-04 07:31:31'),
(7, 1, 8, 'member', '2026-05-04 07:31:30', '2026-05-04 07:31:31', '2026-05-04 07:31:31'),
(8, 1, 9, 'member', '2026-05-04 07:31:31', '2026-05-04 07:31:31', '2026-05-04 07:31:31'),
(9, 1, 10, 'substitute', '2026-05-04 07:31:31', '2026-05-04 07:31:31', '2026-05-04 07:31:31'),
(10, 1, 11, 'substitute', '2026-05-04 07:31:31', '2026-05-04 07:31:31', '2026-05-04 07:31:31'),
(11, 2, 12, 'captain', '2026-05-04 07:31:32', '2026-05-04 07:31:34', '2026-05-04 07:31:34'),
(12, 2, 13, 'member', '2026-05-04 07:31:32', '2026-05-04 07:31:34', '2026-05-04 07:31:34'),
(13, 2, 14, 'substitute', '2026-05-04 07:31:32', '2026-05-04 07:31:34', '2026-05-04 07:31:34'),
(14, 2, 15, 'member', '2026-05-04 07:31:32', '2026-05-04 07:31:34', '2026-05-04 07:31:34'),
(15, 2, 16, 'member', '2026-05-04 07:31:33', '2026-05-04 07:31:34', '2026-05-04 07:31:34'),
(16, 2, 17, 'substitute', '2026-05-04 07:31:33', '2026-05-04 07:31:34', '2026-05-04 07:31:34'),
(17, 2, 18, 'member', '2026-05-04 07:31:33', '2026-05-04 07:31:34', '2026-05-04 07:31:34'),
(18, 2, 19, 'member', '2026-05-04 07:31:34', '2026-05-04 07:31:34', '2026-05-04 07:31:34'),
(19, 2, 20, 'substitute', '2026-05-04 07:31:34', '2026-05-04 07:31:34', '2026-05-04 07:31:34'),
(20, 2, 21, 'substitute', '2026-05-04 07:31:34', '2026-05-04 07:31:34', '2026-05-04 07:31:34'),
(21, 3, 22, 'captain', '2026-05-04 07:31:34', '2026-05-04 07:31:36', '2026-05-04 07:31:36'),
(22, 3, 23, 'member', '2026-05-04 07:31:35', '2026-05-04 07:31:36', '2026-05-04 07:31:36'),
(23, 3, 24, 'substitute', '2026-05-04 07:31:35', '2026-05-04 07:31:36', '2026-05-04 07:31:36'),
(24, 3, 25, 'member', '2026-05-04 07:31:35', '2026-05-04 07:31:36', '2026-05-04 07:31:36'),
(25, 3, 26, 'member', '2026-05-04 07:31:36', '2026-05-04 07:31:36', '2026-05-04 07:31:36'),
(26, 3, 27, 'member', '2026-05-04 07:31:36', '2026-05-04 07:31:36', '2026-05-04 07:31:36'),
(27, 3, 28, 'member', '2026-05-04 07:31:36', '2026-05-04 07:31:36', '2026-05-04 07:31:36'),
(28, 4, 29, 'captain', '2026-05-04 07:31:37', '2026-05-04 07:31:39', '2026-05-04 07:31:39'),
(29, 4, 30, 'member', '2026-05-04 07:31:37', '2026-05-04 07:31:39', '2026-05-04 07:31:39'),
(30, 4, 31, 'substitute', '2026-05-04 07:31:37', '2026-05-04 07:31:39', '2026-05-04 07:31:39'),
(31, 4, 32, 'member', '2026-05-04 07:31:37', '2026-05-04 07:31:39', '2026-05-04 07:31:39'),
(32, 4, 33, 'member', '2026-05-04 07:31:38', '2026-05-04 07:31:39', '2026-05-04 07:31:39'),
(33, 4, 34, 'substitute', '2026-05-04 07:31:38', '2026-05-04 07:31:39', '2026-05-04 07:31:39'),
(34, 4, 35, 'member', '2026-05-04 07:31:38', '2026-05-04 07:31:39', '2026-05-04 07:31:39'),
(35, 4, 36, 'member', '2026-05-04 07:31:39', '2026-05-04 07:31:39', '2026-05-04 07:31:39'),
(36, 4, 37, 'substitute', '2026-05-04 07:31:39', '2026-05-04 07:31:39', '2026-05-04 07:31:39'),
(37, 5, 38, 'captain', '2026-05-04 07:31:39', '2026-05-04 07:31:41', '2026-05-04 07:31:41'),
(38, 5, 39, 'member', '2026-05-04 07:31:40', '2026-05-04 07:31:41', '2026-05-04 07:31:41'),
(39, 5, 40, 'substitute', '2026-05-04 07:31:40', '2026-05-04 07:31:41', '2026-05-04 07:31:41'),
(40, 5, 41, 'member', '2026-05-04 07:31:40', '2026-05-04 07:31:42', '2026-05-04 07:31:42'),
(41, 5, 42, 'member', '2026-05-04 07:31:41', '2026-05-04 07:31:42', '2026-05-04 07:31:42'),
(42, 5, 43, 'member', '2026-05-04 07:31:41', '2026-05-04 07:31:42', '2026-05-04 07:31:42'),
(43, 5, 44, 'member', '2026-05-04 07:31:41', '2026-05-04 07:31:42', '2026-05-04 07:31:42'),
(45, 6, 46, 'captain', '2026-05-04 07:31:42', '2026-05-04 07:31:44', '2026-05-04 07:31:44'),
(46, 6, 47, 'member', '2026-05-04 07:31:42', '2026-05-04 07:31:44', '2026-05-04 07:31:44'),
(47, 6, 48, 'substitute', '2026-05-04 07:31:42', '2026-05-04 07:31:44', '2026-05-04 07:31:44'),
(48, 6, 49, 'member', '2026-05-04 07:31:43', '2026-05-04 07:31:44', '2026-05-04 07:31:44'),
(49, 6, 50, 'member', '2026-05-04 07:31:43', '2026-05-04 07:31:44', '2026-05-04 07:31:44'),
(50, 6, 51, 'substitute', '2026-05-04 07:31:43', '2026-05-04 07:31:44', '2026-05-04 07:31:44'),
(51, 6, 52, 'member', '2026-05-04 07:31:44', '2026-05-04 07:31:44', '2026-05-04 07:31:44'),
(52, 6, 53, 'member', '2026-05-04 07:31:44', '2026-05-04 07:31:44', '2026-05-04 07:31:44'),
(53, 6, 54, 'substitute', '2026-05-04 07:31:44', '2026-05-04 07:31:44', '2026-05-04 07:31:44'),
(54, 7, 55, 'captain', '2026-05-04 07:31:45', '2026-05-04 07:31:46', '2026-05-04 07:31:46'),
(55, 7, 56, 'member', '2026-05-04 07:31:45', '2026-05-04 07:31:46', '2026-05-04 07:31:46'),
(56, 7, 57, 'member', '2026-05-04 07:31:45', '2026-05-04 07:31:46', '2026-05-04 07:31:46'),
(57, 7, 58, 'member', '2026-05-04 07:31:45', '2026-05-04 07:31:46', '2026-05-04 07:31:46'),
(58, 7, 59, 'member', '2026-05-04 07:31:46', '2026-05-04 07:31:46', '2026-05-04 07:31:46'),
(59, 7, 60, 'substitute', '2026-05-04 07:31:46', '2026-05-04 07:31:46', '2026-05-04 07:31:46'),
(60, 7, 61, 'member', '2026-05-04 07:31:46', '2026-05-04 07:31:46', '2026-05-04 07:31:46'),
(61, 7, 62, 'substitute', '2026-05-04 07:31:46', '2026-05-04 07:31:46', '2026-05-04 07:31:46'),
(62, 8, 63, 'captain', '2026-05-04 07:31:47', '2026-05-04 07:31:49', '2026-05-04 07:31:49'),
(63, 8, 64, 'member', '2026-05-04 07:31:47', '2026-05-04 07:31:49', '2026-05-04 07:31:49'),
(64, 8, 65, 'substitute', '2026-05-04 07:31:47', '2026-05-04 07:31:49', '2026-05-04 07:31:49'),
(65, 8, 66, 'member', '2026-05-04 07:31:48', '2026-05-04 07:31:49', '2026-05-04 07:31:49'),
(66, 8, 67, 'member', '2026-05-04 07:31:48', '2026-05-04 07:31:49', '2026-05-04 07:31:49'),
(67, 8, 68, 'member', '2026-05-04 07:31:48', '2026-05-04 07:31:49', '2026-05-04 07:31:49'),
(68, 8, 69, 'member', '2026-05-04 07:31:48', '2026-05-04 07:31:49', '2026-05-04 07:31:49'),
(69, 8, 70, 'substitute', '2026-05-04 07:31:49', '2026-05-04 07:31:49', '2026-05-04 07:31:49'),
(70, 9, 71, 'captain', '2026-05-04 07:31:49', '2026-05-04 07:31:50', '2026-05-04 07:31:50'),
(71, 9, 72, 'member', '2026-05-04 07:31:49', '2026-05-04 07:31:50', '2026-05-04 07:31:50'),
(72, 9, 73, 'member', '2026-05-04 07:31:49', '2026-05-04 07:31:50', '2026-05-04 07:31:50'),
(73, 9, 74, 'member', '2026-05-04 07:31:50', '2026-05-04 07:31:50', '2026-05-04 07:31:50'),
(74, 10, 75, 'captain', '2026-05-04 07:31:50', '2026-05-04 07:31:52', '2026-05-04 07:31:52'),
(75, 10, 76, 'member', '2026-05-04 07:31:50', '2026-05-04 07:31:52', '2026-05-04 07:31:52'),
(76, 10, 77, 'substitute', '2026-05-04 07:31:51', '2026-05-04 07:31:52', '2026-05-04 07:31:52'),
(77, 10, 78, 'member', '2026-05-04 07:31:51', '2026-05-04 07:31:52', '2026-05-04 07:31:52'),
(78, 10, 79, 'member', '2026-05-04 07:31:51', '2026-05-04 07:31:52', '2026-05-04 07:31:52'),
(79, 10, 80, 'substitute', '2026-05-04 07:31:51', '2026-05-04 07:31:52', '2026-05-04 07:31:52'),
(80, 10, 81, 'member', '2026-05-04 07:31:52', '2026-05-04 07:31:52', '2026-05-04 07:31:52'),
(81, 10, 82, 'member', '2026-05-04 07:31:52', '2026-05-04 07:31:52', '2026-05-04 07:31:52'),
(82, 10, 83, 'substitute', '2026-05-04 07:31:52', '2026-05-04 07:31:52', '2026-05-04 07:31:52'),
(83, 11, 84, 'captain', '2026-05-04 07:31:52', '2026-05-04 07:31:54', '2026-05-04 07:31:54'),
(84, 11, 85, 'member', '2026-05-04 07:31:53', '2026-05-04 07:31:54', '2026-05-04 07:31:54'),
(85, 11, 86, 'member', '2026-05-04 07:31:53', '2026-05-04 07:31:54', '2026-05-04 07:31:54'),
(86, 11, 87, 'member', '2026-05-04 07:31:53', '2026-05-04 07:31:54', '2026-05-04 07:31:54'),
(87, 11, 88, 'member', '2026-05-04 07:31:53', '2026-05-04 07:31:54', '2026-05-04 07:31:54'),
(88, 11, 89, 'member', '2026-05-04 07:31:54', '2026-05-04 07:31:54', '2026-05-04 07:31:54'),
(89, 11, 90, 'substitute', '2026-05-04 07:31:54', '2026-05-04 07:31:54', '2026-05-04 07:31:54'),
(90, 12, 91, 'captain', '2026-05-04 07:31:54', '2026-05-04 07:31:56', '2026-05-04 07:31:56'),
(91, 12, 92, 'member', '2026-05-04 07:31:55', '2026-05-04 07:31:56', '2026-05-04 07:31:56'),
(92, 12, 93, 'substitute', '2026-05-04 07:31:55', '2026-05-04 07:31:56', '2026-05-04 07:31:56'),
(93, 12, 94, 'member', '2026-05-04 07:31:55', '2026-05-04 07:31:56', '2026-05-04 07:31:56'),
(94, 12, 95, 'member', '2026-05-04 07:31:55', '2026-05-04 07:31:56', '2026-05-04 07:31:56'),
(95, 12, 96, 'member', '2026-05-04 07:31:56', '2026-05-04 07:31:56', '2026-05-04 07:31:56'),
(96, 12, 97, 'member', '2026-05-04 07:31:56', '2026-05-04 07:31:56', '2026-05-04 07:31:56'),
(97, 13, 98, 'captain', '2026-05-04 07:31:56', '2026-05-04 07:31:58', '2026-05-04 07:31:58'),
(98, 13, 99, 'member', '2026-05-04 07:31:56', '2026-05-04 07:31:58', '2026-05-04 07:31:58'),
(99, 13, 100, 'substitute', '2026-05-04 07:31:57', '2026-05-04 07:31:58', '2026-05-04 07:31:58'),
(100, 13, 101, 'member', '2026-05-04 07:31:57', '2026-05-04 07:31:58', '2026-05-04 07:31:58'),
(101, 13, 102, 'member', '2026-05-04 07:31:57', '2026-05-04 07:31:58', '2026-05-04 07:31:58'),
(102, 13, 103, 'substitute', '2026-05-04 07:31:58', '2026-05-04 07:31:58', '2026-05-04 07:31:58'),
(103, 13, 104, 'member', '2026-05-04 07:31:58', '2026-05-04 07:31:58', '2026-05-04 07:31:58'),
(104, 13, 105, 'member', '2026-05-04 07:31:58', '2026-05-04 07:31:58', '2026-05-04 07:31:58'),
(105, 14, 106, 'captain', '2026-05-04 07:31:58', '2026-05-04 07:31:59', '2026-05-04 07:31:59'),
(106, 14, 107, 'member', '2026-05-04 07:31:59', '2026-05-04 07:31:59', '2026-05-04 07:31:59'),
(107, 14, 108, 'member', '2026-05-04 07:31:59', '2026-05-04 07:31:59', '2026-05-04 07:31:59'),
(108, 15, 109, 'captain', '2026-05-04 07:31:59', '2026-05-04 07:32:01', '2026-05-04 07:32:01'),
(109, 15, 110, 'member', '2026-05-04 07:31:59', '2026-05-04 07:32:01', '2026-05-04 07:32:01'),
(110, 15, 111, 'member', '2026-05-04 07:32:00', '2026-05-04 07:32:01', '2026-05-04 07:32:01'),
(111, 15, 112, 'member', '2026-05-04 07:32:00', '2026-05-04 07:32:01', '2026-05-04 07:32:01'),
(112, 15, 113, 'member', '2026-05-04 07:32:00', '2026-05-04 07:32:01', '2026-05-04 07:32:01'),
(113, 15, 114, 'member', '2026-05-04 07:32:01', '2026-05-04 07:32:01', '2026-05-04 07:32:01'),
(114, 15, 115, 'substitute', '2026-05-04 07:32:01', '2026-05-04 07:32:01', '2026-05-04 07:32:01'),
(115, 15, 116, 'substitute', '2026-05-04 07:32:01', '2026-05-04 07:32:01', '2026-05-04 07:32:01'),
(116, 16, 117, 'captain', '2026-05-04 07:32:01', '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(117, 16, 118, 'member', '2026-05-04 07:32:02', '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(118, 16, 119, 'substitute', '2026-05-04 07:32:02', '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(119, 16, 120, 'member', '2026-05-04 07:32:02', '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(120, 16, 121, 'member', '2026-05-04 07:32:03', '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(121, 16, 122, 'member', '2026-05-04 07:32:03', '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(122, 16, 123, 'member', '2026-05-04 07:32:03', '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(123, 17, 124, 'captain', '2026-05-04 07:32:06', '2026-05-04 07:32:07', '2026-05-04 07:32:07'),
(124, 17, 125, 'member', '2026-05-04 07:32:07', '2026-05-04 07:32:07', '2026-05-04 07:32:07'),
(125, 17, 126, 'member', '2026-05-04 07:32:07', '2026-05-04 07:32:07', '2026-05-04 07:32:07'),
(126, 17, 127, 'member', '2026-05-04 07:32:07', '2026-05-04 07:32:07', '2026-05-04 07:32:07'),
(127, 17, 8, 'member', '2026-05-04 07:32:07', '2026-05-04 07:32:07', '2026-05-04 07:32:07'),
(128, 18, 55, 'captain', '2026-05-04 07:32:08', '2026-05-04 07:32:09', '2026-05-04 07:32:09'),
(129, 18, 62, 'member', '2026-05-04 07:32:08', '2026-05-04 07:32:09', '2026-05-04 07:32:09'),
(130, 18, 128, 'member', '2026-05-04 07:32:08', '2026-05-04 07:32:09', '2026-05-04 07:32:09'),
(131, 18, 129, 'member', '2026-05-04 07:32:09', '2026-05-04 07:32:09', '2026-05-04 07:32:09'),
(132, 19, 65, 'captain', '2026-05-04 07:32:09', '2026-05-04 07:32:10', '2026-05-04 07:32:10'),
(133, 19, 130, 'member', '2026-05-04 07:32:09', '2026-05-04 07:32:10', '2026-05-04 07:32:10'),
(134, 19, 68, 'member', '2026-05-04 07:32:10', '2026-05-04 07:32:10', '2026-05-04 07:32:10'),
(135, 19, 131, 'member', '2026-05-04 07:32:10', '2026-05-04 07:32:10', '2026-05-04 07:32:10'),
(136, 19, 63, 'member', '2026-05-04 07:32:10', '2026-05-04 07:32:10', '2026-05-04 07:32:10'),
(137, 20, 13, 'captain', '2026-05-04 07:32:10', '2026-05-04 07:32:11', '2026-05-04 07:32:11'),
(138, 20, 132, 'member', '2026-05-04 07:32:11', '2026-05-04 07:32:11', '2026-05-04 07:32:11'),
(139, 20, 133, 'member', '2026-05-04 07:32:11', '2026-05-04 07:32:11', '2026-05-04 07:32:11'),
(140, 20, 12, 'member', '2026-05-04 07:32:11', '2026-05-04 07:32:11', '2026-05-04 07:32:11'),
(141, 21, 98, 'captain', '2026-05-04 07:32:11', '2026-05-04 07:32:13', '2026-05-04 07:32:13'),
(142, 21, 100, 'member', '2026-05-04 07:32:12', '2026-05-04 07:32:13', '2026-05-04 07:32:13'),
(143, 21, 104, 'member', '2026-05-04 07:32:12', '2026-05-04 07:32:13', '2026-05-04 07:32:13'),
(144, 21, 134, 'member', '2026-05-04 07:32:12', '2026-05-04 07:32:13', '2026-05-04 07:32:13'),
(145, 21, 135, 'member', '2026-05-04 07:32:13', '2026-05-04 07:32:13', '2026-05-04 07:32:13'),
(146, 22, 136, 'captain', '2026-05-04 07:32:13', '2026-05-04 07:32:14', '2026-05-04 07:32:14'),
(147, 22, 137, 'member', '2026-05-04 07:32:13', '2026-05-04 07:32:14', '2026-05-04 07:32:14'),
(148, 22, 138, 'member', '2026-05-04 07:32:14', '2026-05-04 07:32:14', '2026-05-04 07:32:14'),
(149, 22, 139, 'member', '2026-05-04 07:32:14', '2026-05-04 07:32:14', '2026-05-04 07:32:14'),
(150, 22, 140, 'member', '2026-05-04 07:32:14', '2026-05-04 07:32:14', '2026-05-04 07:32:14'),
(151, 23, 141, 'captain', '2026-05-04 07:32:14', '2026-05-04 07:32:16', '2026-05-04 07:32:16'),
(152, 23, 35, 'member', '2026-05-04 07:32:15', '2026-05-04 07:32:16', '2026-05-04 07:32:16'),
(153, 23, 31, 'member', '2026-05-04 07:32:15', '2026-05-04 07:32:16', '2026-05-04 07:32:16'),
(154, 23, 142, 'member', '2026-05-04 07:32:15', '2026-05-04 07:32:16', '2026-05-04 07:32:16'),
(155, 23, 143, 'member', '2026-05-04 07:32:16', '2026-05-04 07:32:16', '2026-05-04 07:32:16'),
(156, 24, 144, 'captain', '2026-05-04 07:32:16', '2026-05-04 07:32:17', '2026-05-04 07:32:17'),
(157, 24, 52, 'member', '2026-05-04 07:32:16', '2026-05-04 07:32:17', '2026-05-04 07:32:17'),
(158, 24, 145, 'member', '2026-05-04 07:32:16', '2026-05-04 07:32:17', '2026-05-04 07:32:17'),
(159, 24, 146, 'member', '2026-05-04 07:32:17', '2026-05-04 07:32:17', '2026-05-04 07:32:17'),
(160, 24, 46, 'member', '2026-05-04 07:32:17', '2026-05-04 07:32:17', '2026-05-04 07:32:17'),
(161, 25, 147, 'captain', '2026-05-04 07:32:17', '2026-05-04 07:32:18', '2026-05-04 07:32:18'),
(162, 25, 111, 'member', '2026-05-04 07:32:18', '2026-05-04 07:32:18', '2026-05-04 07:32:18'),
(163, 25, 110, 'member', '2026-05-04 07:32:18', '2026-05-04 07:32:18', '2026-05-04 07:32:18'),
(164, 25, 148, 'member', '2026-05-04 07:32:18', '2026-05-04 07:32:18', '2026-05-04 07:32:18'),
(165, 25, 109, 'member', '2026-05-04 07:32:18', '2026-05-04 07:32:18', '2026-05-04 07:32:18'),
(166, 26, 149, 'captain', '2026-05-04 07:32:19', '2026-05-04 07:32:20', '2026-05-04 07:32:20'),
(167, 26, 150, 'member', '2026-05-04 07:32:19', '2026-05-04 07:32:20', '2026-05-04 07:32:20'),
(168, 26, 92, 'member', '2026-05-04 07:32:19', '2026-05-04 07:32:20', '2026-05-04 07:32:20'),
(169, 26, 97, 'member', '2026-05-04 07:32:20', '2026-05-04 07:32:20', '2026-05-04 07:32:20'),
(170, 27, 44, 'captain', '2026-05-04 07:32:20', '2026-05-04 07:32:21', '2026-05-04 07:32:21'),
(171, 27, 38, 'member', '2026-05-04 07:32:20', '2026-05-04 07:32:21', '2026-05-04 07:32:21'),
(172, 27, 40, 'member', '2026-05-04 07:32:20', '2026-05-04 07:32:21', '2026-05-04 07:32:21'),
(173, 27, 151, 'member', '2026-05-04 07:32:21', '2026-05-04 07:32:21', '2026-05-04 07:32:21'),
(174, 27, 39, 'member', '2026-05-04 07:32:21', '2026-05-04 07:32:21', '2026-05-04 07:32:21'),
(175, 28, 24, 'captain', '2026-05-04 07:32:21', '2026-05-04 07:32:22', '2026-05-04 07:32:22'),
(176, 28, 152, 'member', '2026-05-04 07:32:22', '2026-05-04 07:32:22', '2026-05-04 07:32:22'),
(177, 28, 153, 'member', '2026-05-04 07:32:22', '2026-05-04 07:32:22', '2026-05-04 07:32:22'),
(178, 28, 154, 'member', '2026-05-04 07:32:22', '2026-05-04 07:32:22', '2026-05-04 07:32:22'),
(179, 29, 155, 'captain', '2026-05-04 07:32:22', '2026-05-04 07:32:24', '2026-05-04 07:32:24'),
(180, 29, 156, 'member', '2026-05-04 07:32:23', '2026-05-04 07:32:24', '2026-05-04 07:32:24'),
(181, 29, 157, 'member', '2026-05-04 07:32:23', '2026-05-04 07:32:24', '2026-05-04 07:32:24'),
(182, 29, 158, 'member', '2026-05-04 07:32:23', '2026-05-04 07:32:24', '2026-05-04 07:32:24'),
(183, 29, 159, 'member', '2026-05-04 07:32:24', '2026-05-04 07:32:24', '2026-05-04 07:32:24'),
(184, 30, 160, 'captain', '2026-05-04 07:32:24', '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(185, 30, 161, 'member', '2026-05-04 07:32:24', '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(186, 30, 72, 'member', '2026-05-04 07:32:24', '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(187, 30, 71, 'member', '2026-05-04 07:32:25', '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(188, 14, 162, 'member', '2026-05-04 23:28:13', '2026-05-04 23:28:13', '2026-05-04 23:28:13'),
(189, 14, 163, 'member', '2026-05-04 23:28:17', '2026-05-04 23:28:17', '2026-05-04 23:28:17'),
(190, 14, 165, 'member', '2026-05-05 10:56:09', '2026-05-05 10:56:09', '2026-05-05 10:56:09'),
(191, 14, 168, 'member', '2026-05-06 08:34:12', '2026-05-06 08:34:12', '2026-05-06 08:34:12'),
(192, 14, 167, 'member', '2026-05-06 08:34:19', '2026-05-06 08:34:19', '2026-05-06 08:34:19'),
(193, 5, 169, 'member', '2026-05-06 15:54:21', '2026-05-06 15:54:21', '2026-05-06 15:54:21'),
(194, 7, 171, 'member', '2026-05-07 14:26:32', '2026-05-07 14:26:32', '2026-05-07 14:26:32');

INSERT INTO "public"."league_teams" ("id", "league_id", "team_id", "registered_at", "created_at", "updated_at") VALUES
(1, 6, 17, '2026-05-04 07:32:25', '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(2, 6, 18, '2026-05-04 07:32:25', '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(3, 6, 19, '2026-05-04 07:32:25', '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(4, 6, 20, '2026-05-04 07:32:25', '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(5, 6, 21, '2026-05-04 07:32:25', '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(6, 6, 22, '2026-05-04 07:32:25', '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(7, 6, 23, '2026-05-04 07:32:25', '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(8, 6, 24, '2026-05-04 07:32:25', '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(9, 6, 25, '2026-05-04 07:32:25', '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(10, 6, 26, '2026-05-04 07:32:25', '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(11, 6, 27, '2026-05-04 07:32:25', '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(12, 6, 28, '2026-05-04 07:32:25', '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(13, 6, 29, '2026-05-04 07:32:25', '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(14, 6, 30, '2026-05-04 07:32:25', '2026-05-04 07:32:25', '2026-05-04 07:32:25');

INSERT INTO "public"."matches" ("id", "league_id", "home_team_id", "away_team_id", "scheduled_at", "status", "home_score", "away_score", "created_at", "updated_at", "home_entry_id", "away_entry_id", "league_group_id", "stage", "round", "bracket_slot", "next_match_id", "locked") VALUES
(1, 4, NULL, NULL, '2026-03-09 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:03', '2026-05-13 07:21:23', 4, 13, 1, 'group', 1, NULL, NULL, 't'),
(2, 4, NULL, NULL, '2026-03-09 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:03', '2026-05-13 07:21:23', 5, 12, 1, 'group', 1, NULL, NULL, 't'),
(3, 4, NULL, NULL, '2026-03-09 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:03', '2026-05-13 07:21:23', 8, 9, 1, 'group', 1, NULL, NULL, 't'),
(4, 4, NULL, NULL, '2026-03-10 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:03', '2026-05-13 07:21:23', 1, 13, 1, 'group', 2, NULL, NULL, 't'),
(5, 4, NULL, NULL, '2026-03-10 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:03', '2026-05-13 07:21:23', 16, 12, 1, 'group', 2, NULL, NULL, 't'),
(6, 4, NULL, NULL, '2026-03-10 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:03', '2026-05-13 07:21:23', 5, 8, 1, 'group', 2, NULL, NULL, 't'),
(7, 4, NULL, NULL, '2026-03-11 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:03', '2026-05-13 07:21:23', 1, 12, 1, 'group', 3, NULL, NULL, 't'),
(8, 4, NULL, NULL, '2026-03-11 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:03', '2026-05-13 07:21:23', 13, 9, 1, 'group', 3, NULL, NULL, 't'),
(9, 4, NULL, NULL, '2026-03-11 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:03', '2026-05-13 07:21:23', 16, 8, 1, 'group', 3, NULL, NULL, 't'),
(10, 4, NULL, NULL, '2026-03-11 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:03', '2026-05-13 07:21:23', 4, 5, 1, 'group', 3, NULL, NULL, 't'),
(11, 4, NULL, NULL, '2026-03-12 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:03', '2026-05-13 07:21:23', 1, 9, 1, 'group', 4, NULL, NULL, 't'),
(12, 4, NULL, NULL, '2026-03-12 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:03', '2026-05-13 07:21:23', 13, 5, 1, 'group', 4, NULL, NULL, 't'),
(13, 4, NULL, NULL, '2026-03-12 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 16, 4, 1, 'group', 4, NULL, NULL, 't'),
(14, 4, NULL, NULL, '2026-03-13 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 1, 8, 1, 'group', 5, NULL, NULL, 't'),
(15, 4, NULL, NULL, '2026-03-13 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 9, 5, 1, 'group', 5, NULL, NULL, 't'),
(16, 4, NULL, NULL, '2026-03-13 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 12, 4, 1, 'group', 5, NULL, NULL, 't'),
(17, 4, NULL, NULL, '2026-03-13 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 13, 16, 1, 'group', 5, NULL, NULL, 't'),
(18, 4, NULL, NULL, '2026-03-14 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 1, 5, 1, 'group', 6, NULL, NULL, 't'),
(19, 4, NULL, NULL, '2026-03-14 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 8, 4, 1, 'group', 6, NULL, NULL, 't'),
(20, 4, NULL, NULL, '2026-03-14 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 9, 16, 1, 'group', 6, NULL, NULL, 't'),
(21, 4, NULL, NULL, '2026-03-14 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 12, 13, 1, 'group', 6, NULL, NULL, 't'),
(22, 4, NULL, NULL, '2026-03-15 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 1, 4, 1, 'group', 7, NULL, NULL, 't'),
(23, 4, NULL, NULL, '2026-03-15 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 5, 16, 1, 'group', 7, NULL, NULL, 't'),
(24, 4, NULL, NULL, '2026-03-15 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 8, 13, 1, 'group', 7, NULL, NULL, 't'),
(25, 4, NULL, NULL, '2026-03-15 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 9, 12, 1, 'group', 7, NULL, NULL, 't'),
(26, 4, NULL, NULL, '2026-03-16 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 1, 16, 1, 'group', 8, NULL, NULL, 't'),
(27, 4, NULL, NULL, '2026-03-16 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 4, 9, 1, 'group', 8, NULL, NULL, 't'),
(28, 4, NULL, NULL, '2026-03-16 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 12, 8, 1, 'group', 8, NULL, NULL, 't'),
(29, 4, NULL, NULL, '2026-03-09 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 2, 11, 2, 'group', 1, NULL, NULL, 't'),
(30, 4, NULL, NULL, '2026-03-09 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 14, 10, 2, 'group', 1, NULL, NULL, 't'),
(31, 4, NULL, NULL, '2026-03-09 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 15, 7, 2, 'group', 1, NULL, NULL, 't'),
(32, 4, NULL, NULL, '2026-03-09 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 3, 6, 2, 'group', 1, NULL, NULL, 't'),
(33, 4, NULL, NULL, '2026-03-10 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 2, 7, 2, 'group', 2, NULL, NULL, 't'),
(34, 4, NULL, NULL, '2026-03-10 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 10, 6, 2, 'group', 2, NULL, NULL, 't'),
(35, 4, NULL, NULL, '2026-03-10 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 11, 3, 2, 'group', 2, NULL, NULL, 't'),
(36, 4, NULL, NULL, '2026-03-10 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 14, 15, 2, 'group', 2, NULL, NULL, 't'),
(37, 4, NULL, NULL, '2026-03-11 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 3, 14, 2, 'group', 3, NULL, NULL, 't'),
(38, 4, NULL, NULL, '2026-03-11 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 6, 11, 2, 'group', 3, NULL, NULL, 't'),
(39, 4, NULL, NULL, '2026-03-11 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 7, 10, 2, 'group', 3, NULL, NULL, 't'),
(40, 4, NULL, NULL, '2026-03-12 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 2, 6, 2, 'group', 4, NULL, NULL, 't'),
(41, 4, NULL, NULL, '2026-03-12 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 7, 3, 2, 'group', 4, NULL, NULL, 't'),
(42, 4, NULL, NULL, '2026-03-12 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 10, 15, 2, 'group', 4, NULL, NULL, 't'),
(43, 4, NULL, NULL, '2026-03-12 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 11, 14, 2, 'group', 4, NULL, NULL, 't'),
(44, 4, NULL, NULL, '2026-03-13 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 2, 14, 2, 'group', 5, NULL, NULL, 't'),
(45, 4, NULL, NULL, '2026-03-13 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 15, 11, 2, 'group', 5, NULL, NULL, 't'),
(46, 4, NULL, NULL, '2026-03-13 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 6, 7, 2, 'group', 5, NULL, NULL, 't'),
(47, 4, NULL, NULL, '2026-03-14 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 2, 10, 2, 'group', 6, NULL, NULL, 't'),
(48, 4, NULL, NULL, '2026-03-14 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 14, 6, 2, 'group', 6, NULL, NULL, 't'),
(49, 4, NULL, NULL, '2026-03-14 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 15, 3, 2, 'group', 6, NULL, NULL, 't'),
(50, 4, NULL, NULL, '2026-03-15 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 2, 15, 2, 'group', 7, NULL, NULL, 't'),
(51, 4, NULL, NULL, '2026-03-15 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 3, 10, 2, 'group', 7, NULL, NULL, 't'),
(52, 4, NULL, NULL, '2026-03-15 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 11, 7, 2, 'group', 7, NULL, NULL, 't'),
(53, 4, NULL, NULL, '2026-03-16 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 2, 3, 2, 'group', 8, NULL, NULL, 't'),
(54, 4, NULL, NULL, '2026-03-16 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 6, 15, 2, 'group', 8, NULL, NULL, 't'),
(55, 4, NULL, NULL, '2026-03-16 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 7, 14, 2, 'group', 8, NULL, NULL, 't'),
(56, 4, NULL, NULL, '2026-03-16 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:04', '2026-05-13 07:21:23', 10, 11, 2, 'group', 8, NULL, NULL, 't'),
(57, 4, NULL, NULL, '2026-03-11 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 1, 2, NULL, 'upper', 3, NULL, NULL, 't'),
(58, 4, NULL, NULL, '2026-03-10 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 1, 5, NULL, 'upper', 2, 'home', 57, 't'),
(59, 4, NULL, NULL, '2026-03-10 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 2, 6, NULL, 'upper', 2, 'away', 57, 't'),
(60, 4, NULL, NULL, '2026-03-09 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 1, 4, NULL, 'upper', 1, 'home', 58, 't'),
(61, 4, NULL, NULL, '2026-03-09 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 5, 8, NULL, 'upper', 1, 'away', 58, 't'),
(62, 4, NULL, NULL, '2026-03-09 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 2, 3, NULL, 'upper', 1, 'home', 59, 't'),
(63, 4, NULL, NULL, '2026-03-09 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 6, 7, NULL, 'upper', 1, 'away', 59, 't'),
(64, 4, NULL, NULL, '2026-03-11 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 9, 10, NULL, 'lower', 3, NULL, NULL, 't'),
(65, 4, NULL, NULL, '2026-03-10 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 9, 13, NULL, 'lower', 2, 'home', 64, 't'),
(66, 4, NULL, NULL, '2026-03-10 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 10, 14, NULL, 'lower', 2, 'away', 64, 't'),
(67, 4, NULL, NULL, '2026-03-09 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 9, 12, NULL, 'lower', 1, 'home', 65, 't'),
(68, 4, NULL, NULL, '2026-03-09 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 13, 16, NULL, 'lower', 1, 'away', 65, 't'),
(69, 4, NULL, NULL, '2026-03-09 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 10, 11, NULL, 'lower', 1, 'home', 66, 't'),
(70, 4, NULL, NULL, '2026-03-09 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 14, 15, NULL, 'lower', 1, 'away', 66, 't'),
(71, 4, NULL, NULL, '2026-05-07 07:32:05', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 5, 6, NULL, 'third_place', 4, NULL, NULL, 't'),
(72, 4, NULL, NULL, '2026-05-07 07:32:05', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 13, 14, NULL, 'lower_third_place', 4, NULL, NULL, 't'),
(73, 5, NULL, NULL, '2026-03-09 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 20, 29, 3, 'group', 1, NULL, NULL, 't'),
(74, 5, NULL, NULL, '2026-03-09 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 21, 28, 3, 'group', 1, NULL, NULL, 't'),
(75, 5, NULL, NULL, '2026-03-09 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 24, 25, 3, 'group', 1, NULL, NULL, 't'),
(76, 5, NULL, NULL, '2026-03-10 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 17, 29, 3, 'group', 2, NULL, NULL, 't'),
(77, 5, NULL, NULL, '2026-03-10 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 32, 28, 3, 'group', 2, NULL, NULL, 't'),
(78, 5, NULL, NULL, '2026-03-10 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 21, 24, 3, 'group', 2, NULL, NULL, 't'),
(79, 5, NULL, NULL, '2026-03-11 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 17, 28, 3, 'group', 3, NULL, NULL, 't'),
(80, 5, NULL, NULL, '2026-03-11 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 29, 25, 3, 'group', 3, NULL, NULL, 't'),
(81, 5, NULL, NULL, '2026-03-11 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 32, 24, 3, 'group', 3, NULL, NULL, 't'),
(82, 5, NULL, NULL, '2026-03-11 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 20, 21, 3, 'group', 3, NULL, NULL, 't'),
(83, 5, NULL, NULL, '2026-03-12 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 17, 25, 3, 'group', 4, NULL, NULL, 't'),
(84, 5, NULL, NULL, '2026-03-12 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 29, 21, 3, 'group', 4, NULL, NULL, 't'),
(85, 5, NULL, NULL, '2026-03-12 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 32, 20, 3, 'group', 4, NULL, NULL, 't'),
(86, 5, NULL, NULL, '2026-03-13 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 17, 24, 3, 'group', 5, NULL, NULL, 't'),
(87, 5, NULL, NULL, '2026-03-13 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 25, 21, 3, 'group', 5, NULL, NULL, 't'),
(88, 5, NULL, NULL, '2026-03-13 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 28, 20, 3, 'group', 5, NULL, NULL, 't'),
(89, 5, NULL, NULL, '2026-03-13 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 29, 32, 3, 'group', 5, NULL, NULL, 't'),
(90, 5, NULL, NULL, '2026-03-14 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 17, 21, 3, 'group', 6, NULL, NULL, 't'),
(91, 5, NULL, NULL, '2026-03-14 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 24, 20, 3, 'group', 6, NULL, NULL, 't'),
(92, 5, NULL, NULL, '2026-03-14 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 25, 32, 3, 'group', 6, NULL, NULL, 't'),
(93, 5, NULL, NULL, '2026-03-14 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 28, 29, 3, 'group', 6, NULL, NULL, 't'),
(94, 5, NULL, NULL, '2026-03-15 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 17, 20, 3, 'group', 7, NULL, NULL, 't'),
(95, 5, NULL, NULL, '2026-03-15 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 21, 32, 3, 'group', 7, NULL, NULL, 't'),
(96, 5, NULL, NULL, '2026-03-15 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 24, 29, 3, 'group', 7, NULL, NULL, 't'),
(97, 5, NULL, NULL, '2026-03-15 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 25, 28, 3, 'group', 7, NULL, NULL, 't'),
(98, 5, NULL, NULL, '2026-03-16 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 17, 32, 3, 'group', 8, NULL, NULL, 't'),
(99, 5, NULL, NULL, '2026-03-16 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 20, 25, 3, 'group', 8, NULL, NULL, 't'),
(100, 5, NULL, NULL, '2026-03-16 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 28, 24, 3, 'group', 8, NULL, NULL, 't'),
(101, 5, NULL, NULL, '2026-03-09 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 18, 27, 4, 'group', 1, NULL, NULL, 't'),
(102, 5, NULL, NULL, '2026-03-09 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 30, 26, 4, 'group', 1, NULL, NULL, 't'),
(103, 5, NULL, NULL, '2026-03-09 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 31, 23, 4, 'group', 1, NULL, NULL, 't'),
(104, 5, NULL, NULL, '2026-03-09 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 19, 22, 4, 'group', 1, NULL, NULL, 't'),
(105, 5, NULL, NULL, '2026-03-10 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 18, 23, 4, 'group', 2, NULL, NULL, 't'),
(106, 5, NULL, NULL, '2026-03-10 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 26, 22, 4, 'group', 2, NULL, NULL, 't'),
(107, 5, NULL, NULL, '2026-03-10 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 27, 19, 4, 'group', 2, NULL, NULL, 't'),
(108, 5, NULL, NULL, '2026-03-10 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 30, 31, 4, 'group', 2, NULL, NULL, 't'),
(109, 5, NULL, NULL, '2026-03-11 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 19, 30, 4, 'group', 3, NULL, NULL, 't'),
(110, 5, NULL, NULL, '2026-03-11 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 22, 27, 4, 'group', 3, NULL, NULL, 't'),
(111, 5, NULL, NULL, '2026-03-11 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 23, 26, 4, 'group', 3, NULL, NULL, 't'),
(112, 5, NULL, NULL, '2026-03-12 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 18, 22, 4, 'group', 4, NULL, NULL, 't'),
(113, 5, NULL, NULL, '2026-03-12 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 23, 19, 4, 'group', 4, NULL, NULL, 't'),
(114, 5, NULL, NULL, '2026-03-12 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 26, 31, 4, 'group', 4, NULL, NULL, 't'),
(115, 5, NULL, NULL, '2026-03-12 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 27, 30, 4, 'group', 4, NULL, NULL, 't'),
(116, 5, NULL, NULL, '2026-03-13 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 18, 30, 4, 'group', 5, NULL, NULL, 't'),
(117, 5, NULL, NULL, '2026-03-13 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 31, 27, 4, 'group', 5, NULL, NULL, 't'),
(118, 5, NULL, NULL, '2026-03-13 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 22, 23, 4, 'group', 5, NULL, NULL, 't'),
(119, 5, NULL, NULL, '2026-03-14 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 18, 26, 4, 'group', 6, NULL, NULL, 't'),
(120, 5, NULL, NULL, '2026-03-14 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 30, 22, 4, 'group', 6, NULL, NULL, 't'),
(121, 5, NULL, NULL, '2026-03-14 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 31, 19, 4, 'group', 6, NULL, NULL, 't'),
(122, 5, NULL, NULL, '2026-03-15 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 18, 31, 4, 'group', 7, NULL, NULL, 't'),
(123, 5, NULL, NULL, '2026-03-15 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 19, 26, 4, 'group', 7, NULL, NULL, 't'),
(124, 5, NULL, NULL, '2026-03-15 00:00:00', 'completed', 0, 2, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 27, 23, 4, 'group', 7, NULL, NULL, 't'),
(125, 5, NULL, NULL, '2026-03-16 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 18, 19, 4, 'group', 8, NULL, NULL, 't'),
(126, 5, NULL, NULL, '2026-03-16 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 22, 31, 4, 'group', 8, NULL, NULL, 't'),
(127, 5, NULL, NULL, '2026-03-16 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 23, 30, 4, 'group', 8, NULL, NULL, 't'),
(128, 5, NULL, NULL, '2026-03-16 00:00:00', 'completed', 2, 0, '2026-05-04 07:32:05', '2026-05-13 07:21:23', 26, 27, 4, 'group', 8, NULL, NULL, 't'),
(129, 6, 26, 28, '2026-03-23 07:32:25', 'completed', 1, 3, '2026-05-04 07:32:25', '2026-05-13 07:21:23', 42, 44, NULL, 'upper', 1, NULL, NULL, 't'),
(130, 6, 22, NULL, '2026-03-23 07:32:25', 'completed', 1, 0, '2026-05-04 07:32:25', '2026-05-13 07:21:23', 38, NULL, NULL, 'upper', 1, NULL, NULL, 't'),
(131, 6, 19, 21, '2026-03-23 07:32:25', 'completed', 1, 6, '2026-05-04 07:32:25', '2026-05-13 07:21:23', 35, 37, NULL, 'upper', 1, NULL, NULL, 't'),
(132, 6, 30, 18, '2026-03-23 07:32:25', 'completed', 0, 21, '2026-05-04 07:32:25', '2026-05-13 07:21:23', 46, 34, NULL, 'upper', 1, NULL, NULL, 't'),
(133, 6, 17, 24, '2026-03-23 07:32:25', 'completed', 3, 4, '2026-05-04 07:32:25', '2026-05-13 07:21:23', 33, 40, NULL, 'upper', 1, NULL, NULL, 't'),
(134, 6, 23, NULL, '2026-03-23 07:32:25', 'completed', 1, 0, '2026-05-04 07:32:25', '2026-05-13 07:21:23', 39, NULL, NULL, 'upper', 1, NULL, NULL, 't'),
(135, 6, 20, 27, '2026-03-23 07:32:25', 'completed', 21, 0, '2026-05-04 07:32:25', '2026-05-13 07:21:23', 36, 43, NULL, 'upper', 1, NULL, NULL, 't'),
(136, 6, 25, 29, '2026-03-23 07:32:25', 'completed', 21, 0, '2026-05-04 07:32:25', '2026-05-13 07:21:23', 41, 45, NULL, 'upper', 1, NULL, NULL, 't'),
(137, 6, 22, 28, '2026-03-24 07:32:25', 'completed', 0, 21, '2026-05-04 07:32:25', '2026-05-13 07:21:23', 38, 44, NULL, 'upper', 2, NULL, NULL, 't'),
(138, 6, 21, 18, '2026-03-24 07:32:25', 'completed', 6, 3, '2026-05-04 07:32:25', '2026-05-13 07:21:23', 37, 34, NULL, 'upper', 2, NULL, NULL, 't'),
(139, 6, 25, 24, '2026-03-24 07:32:25', 'completed', 3, 6, '2026-05-04 07:32:25', '2026-05-13 07:21:23', 41, 40, NULL, 'upper', 2, NULL, NULL, 't'),
(140, 6, 20, 23, '2026-03-24 07:32:25', 'completed', 2, 1, '2026-05-04 07:32:25', '2026-05-13 07:21:23', 36, 39, NULL, 'upper', 2, NULL, NULL, 't'),
(141, 6, 28, 21, '2026-03-25 07:32:25', 'completed', 4, 6, '2026-05-04 07:32:25', '2026-05-13 07:21:23', 44, 37, NULL, 'upper', 3, NULL, NULL, 't'),
(142, 6, 24, 20, '2026-03-25 07:32:25', 'completed', 5, 2, '2026-05-04 07:32:25', '2026-05-13 07:21:23', 40, 36, NULL, 'upper', 3, NULL, NULL, 't'),
(143, 6, 21, 24, '2026-03-26 07:32:25', 'completed', 3, 1, '2026-05-04 07:32:25', '2026-05-13 07:21:23', 37, 40, NULL, 'upper', 4, NULL, NULL, 't'),
(144, 6, 28, 20, '2026-03-26 07:32:25', 'completed', 5, 4, '2026-05-04 07:32:25', '2026-05-13 07:21:23', 44, 36, NULL, 'third_place', 4, NULL, NULL, 't'),
(1041, 2, NULL, NULL, '2026-05-07 17:00:00', 'completed', 1, 0, '2026-05-05 14:50:47', '2026-05-13 07:21:23', 52, 60, 37, 'group', 1, NULL, NULL, 't'),
(1042, 2, NULL, NULL, '2026-05-07 17:15:00', 'completed', 1, 0, '2026-05-05 14:50:47', '2026-05-13 07:21:23', 48, 57, 37, 'group', 1, NULL, NULL, 't'),
(1043, 2, NULL, NULL, '2026-05-07 17:30:00', 'completed', 0, 1, '2026-05-05 14:50:47', '2026-05-13 07:21:23', 49, 56, 37, 'group', 1, NULL, NULL, 't'),
(1044, 2, NULL, NULL, '2026-05-21 17:00:00', 'completed', 0, 1, '2026-05-05 14:50:47', '2026-05-21 17:13:38', 47, 60, 37, 'group', 2, NULL, NULL, 't'),
(1045, 2, NULL, NULL, '2026-05-21 17:15:00', 'completed', 1, 0, '2026-05-05 14:50:47', '2026-05-21 17:39:18', 61, 57, 37, 'group', 2, NULL, NULL, 't'),
(1046, 2, NULL, NULL, '2026-05-21 17:30:00', 'completed', 1, 0, '2026-05-05 14:50:47', '2026-05-21 18:11:20', 48, 49, 37, 'group', 2, NULL, NULL, 't'),
(1047, 2, NULL, NULL, '2026-06-04 17:00:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 47, 57, 37, 'group', 3, NULL, NULL, 'f'),
(1048, 2, NULL, NULL, '2026-06-04 17:15:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 60, 56, 37, 'group', 3, NULL, NULL, 'f'),
(1049, 2, NULL, NULL, '2026-06-04 17:30:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 61, 49, 37, 'group', 3, NULL, NULL, 'f'),
(1050, 2, NULL, NULL, '2026-06-04 17:45:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 52, 48, 37, 'group', 3, NULL, NULL, 'f'),
(1051, 2, NULL, NULL, '2026-06-11 17:00:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 47, 56, 37, 'group', 4, NULL, NULL, 'f'),
(1052, 2, NULL, NULL, '2026-06-11 17:15:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 60, 48, 37, 'group', 4, NULL, NULL, 'f'),
(1053, 2, NULL, NULL, '2026-06-11 17:30:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 61, 52, 37, 'group', 4, NULL, NULL, 'f'),
(1054, 2, NULL, NULL, '2026-06-18 17:00:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 47, 49, 37, 'group', 5, NULL, NULL, 'f'),
(1055, 2, NULL, NULL, '2026-06-18 17:15:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 56, 48, 37, 'group', 5, NULL, NULL, 'f'),
(1056, 2, NULL, NULL, '2026-06-18 17:30:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 57, 52, 37, 'group', 5, NULL, NULL, 'f'),
(1057, 2, NULL, NULL, '2026-06-18 17:45:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 60, 61, 37, 'group', 5, NULL, NULL, 'f'),
(1058, 2, NULL, NULL, '2026-06-25 17:00:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 47, 48, 37, 'group', 6, NULL, NULL, 'f'),
(1059, 2, NULL, NULL, '2026-06-25 17:15:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 49, 52, 37, 'group', 6, NULL, NULL, 'f'),
(1060, 2, NULL, NULL, '2026-06-25 17:30:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 56, 61, 37, 'group', 6, NULL, NULL, 'f'),
(1061, 2, NULL, NULL, '2026-06-25 17:45:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 57, 60, 37, 'group', 6, NULL, NULL, 'f'),
(1062, 2, NULL, NULL, '2026-07-02 17:00:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:25', 47, 52, 37, 'group', 7, NULL, NULL, 'f'),
(1063, 2, NULL, NULL, '2026-07-02 17:15:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:25', 48, 61, 37, 'group', 7, NULL, NULL, 'f'),
(1064, 2, NULL, NULL, '2026-07-02 17:30:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:25', 49, 60, 37, 'group', 7, NULL, NULL, 'f'),
(1065, 2, NULL, NULL, '2026-07-02 17:45:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:25', 56, 57, 37, 'group', 7, NULL, NULL, 'f'),
(1066, 2, NULL, NULL, '2026-07-09 17:00:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:25', 47, 61, 37, 'group', 8, NULL, NULL, 'f'),
(1067, 2, NULL, NULL, '2026-07-09 17:15:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:25', 52, 56, 37, 'group', 8, NULL, NULL, 'f'),
(1068, 2, NULL, NULL, '2026-07-09 17:30:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:25', 57, 49, 37, 'group', 8, NULL, NULL, 'f'),
(1069, 2, NULL, NULL, '2026-05-07 17:45:00', 'completed', 1, 0, '2026-05-05 14:50:47', '2026-05-13 08:28:01', 55, 62, 38, 'group', 1, NULL, NULL, 't'),
(1070, 2, NULL, NULL, '2026-05-07 18:00:00', 'completed', 1, 0, '2026-05-05 14:50:47', '2026-05-13 07:21:23', 51, 53, 38, 'group', 1, NULL, NULL, 't'),
(1071, 2, NULL, NULL, '2026-05-07 18:15:00', 'completed', 0, 1, '2026-05-05 14:50:47', '2026-05-13 07:21:23', 59, 54, 38, 'group', 1, NULL, NULL, 't'),
(1072, 2, NULL, NULL, '2026-05-07 18:30:00', 'completed', 1, 0, '2026-05-05 14:50:47', '2026-05-13 07:21:23', 50, 58, 38, 'group', 1, NULL, NULL, 't'),
(1073, 2, NULL, NULL, '2026-05-21 17:45:00', 'completed', 0, 1, '2026-05-05 14:50:47', '2026-05-21 18:48:06', 55, 54, 38, 'group', 2, NULL, NULL, 't'),
(1074, 2, NULL, NULL, '2026-05-21 18:00:00', 'completed', 1, 0, '2026-05-05 14:50:47', '2026-05-21 19:06:15', 53, 58, 38, 'group', 2, NULL, NULL, 't'),
(1075, 2, NULL, NULL, '2026-05-21 18:15:00', 'completed', 0, 1, '2026-05-05 14:50:47', '2026-05-21 18:48:38', 62, 50, 38, 'group', 2, NULL, NULL, 't'),
(1076, 2, NULL, NULL, '2026-05-21 18:30:00', 'completed', 1, 0, '2026-05-05 14:50:47', '2026-05-21 18:32:57', 51, 59, 38, 'group', 2, NULL, NULL, 't'),
(1077, 2, NULL, NULL, '2026-06-04 18:00:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 50, 51, 38, 'group', 3, NULL, NULL, 'f'),
(1078, 2, NULL, NULL, '2026-06-04 18:15:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 58, 62, 38, 'group', 3, NULL, NULL, 'f'),
(1079, 2, NULL, NULL, '2026-06-04 18:30:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 54, 53, 38, 'group', 3, NULL, NULL, 'f'),
(1080, 2, NULL, NULL, '2026-06-11 17:45:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 55, 58, 38, 'group', 4, NULL, NULL, 'f'),
(1081, 2, NULL, NULL, '2026-06-11 18:00:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 54, 50, 38, 'group', 4, NULL, NULL, 'f'),
(1082, 2, NULL, NULL, '2026-06-11 18:15:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 53, 59, 38, 'group', 4, NULL, NULL, 'f'),
(1083, 2, NULL, NULL, '2026-06-11 18:30:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 62, 51, 38, 'group', 4, NULL, NULL, 'f'),
(1084, 2, NULL, NULL, '2026-06-18 18:00:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 55, 51, 38, 'group', 5, NULL, NULL, 'f'),
(1085, 2, NULL, NULL, '2026-06-18 18:15:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 59, 62, 38, 'group', 5, NULL, NULL, 'f'),
(1086, 2, NULL, NULL, '2026-06-18 18:30:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 58, 54, 38, 'group', 5, NULL, NULL, 'f'),
(1087, 2, NULL, NULL, '2026-06-25 18:00:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 55, 53, 38, 'group', 6, NULL, NULL, 'f'),
(1088, 2, NULL, NULL, '2026-06-25 18:15:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:24', 51, 58, 38, 'group', 6, NULL, NULL, 'f'),
(1089, 2, NULL, NULL, '2026-06-25 18:30:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:25', 59, 50, 38, 'group', 6, NULL, NULL, 'f'),
(1090, 2, NULL, NULL, '2026-07-02 18:00:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:25', 55, 59, 38, 'group', 7, NULL, NULL, 'f'),
(1091, 2, NULL, NULL, '2026-07-02 18:15:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:25', 50, 53, 38, 'group', 7, NULL, NULL, 'f'),
(1092, 2, NULL, NULL, '2026-07-02 18:30:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:25', 62, 54, 38, 'group', 7, NULL, NULL, 'f'),
(1093, 2, NULL, NULL, '2026-07-09 17:45:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:25', 55, 50, 38, 'group', 8, NULL, NULL, 'f'),
(1094, 2, NULL, NULL, '2026-07-09 18:00:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:25', 58, 59, 38, 'group', 8, NULL, NULL, 'f'),
(1095, 2, NULL, NULL, '2026-07-09 18:15:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:25', 54, 51, 38, 'group', 8, NULL, NULL, 'f'),
(1096, 2, NULL, NULL, '2026-07-09 18:30:00', 'scheduled', 0, 0, '2026-05-05 14:50:47', '2026-05-06 08:09:25', 53, 62, 38, 'group', 8, NULL, NULL, 'f'),
(1377, 1, NULL, NULL, '2026-05-07 17:00:00', 'completed', 0, 1, '2026-05-05 14:53:58', '2026-05-13 07:21:23', 79, 67, 49, 'group', 1, NULL, NULL, 't'),
(1378, 1, NULL, NULL, '2026-05-07 17:15:00', 'completed', 0, 1, '2026-05-05 14:53:58', '2026-05-13 07:21:23', 80, 73, 49, 'group', 1, NULL, NULL, 't'),
(1379, 1, NULL, NULL, '2026-05-07 17:30:00', 'completed', 0, 1, '2026-05-05 14:53:58', '2026-05-13 07:21:23', 81, 74, 49, 'group', 1, NULL, NULL, 't'),
(1380, 1, NULL, NULL, '2026-05-21 17:00:00', 'completed', 1, 0, '2026-05-05 14:53:58', '2026-05-21 17:25:53', 66, 67, 49, 'group', 2, NULL, NULL, 't'),
(1381, 1, NULL, NULL, '2026-05-21 17:15:00', 'completed', 0, 1, '2026-05-05 14:53:58', '2026-05-21 17:29:11', 63, 73, 49, 'group', 2, NULL, NULL, 't'),
(1382, 1, NULL, NULL, '2026-05-21 17:30:00', 'completed', 1, 0, '2026-05-05 14:53:58', '2026-05-21 17:43:46', 80, 81, 49, 'group', 2, NULL, NULL, 't'),
(1383, 1, NULL, NULL, '2026-06-04 17:00:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 66, 73, 49, 'group', 3, NULL, NULL, 'f'),
(1384, 1, NULL, NULL, '2026-06-04 17:15:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 67, 74, 49, 'group', 3, NULL, NULL, 'f'),
(1385, 1, NULL, NULL, '2026-06-04 17:30:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 63, 81, 49, 'group', 3, NULL, NULL, 'f'),
(1386, 1, NULL, NULL, '2026-06-04 17:45:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 79, 80, 49, 'group', 3, NULL, NULL, 'f'),
(1387, 1, NULL, NULL, '2026-06-11 17:00:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 66, 74, 49, 'group', 4, NULL, NULL, 'f'),
(1388, 1, NULL, NULL, '2026-06-11 17:15:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 67, 80, 49, 'group', 4, NULL, NULL, 'f'),
(1389, 1, NULL, NULL, '2026-06-11 17:30:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 63, 79, 49, 'group', 4, NULL, NULL, 'f'),
(1390, 1, NULL, NULL, '2026-06-18 17:00:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 66, 81, 49, 'group', 5, NULL, NULL, 'f'),
(1391, 1, NULL, NULL, '2026-06-18 17:15:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 74, 80, 49, 'group', 5, NULL, NULL, 'f'),
(1392, 1, NULL, NULL, '2026-06-18 17:30:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 73, 79, 49, 'group', 5, NULL, NULL, 'f'),
(1393, 1, NULL, NULL, '2026-06-18 17:45:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 67, 63, 49, 'group', 5, NULL, NULL, 'f'),
(1394, 1, NULL, NULL, '2026-06-25 17:00:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 66, 80, 49, 'group', 6, NULL, NULL, 'f'),
(1395, 1, NULL, NULL, '2026-06-25 17:15:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 81, 79, 49, 'group', 6, NULL, NULL, 'f'),
(1396, 1, NULL, NULL, '2026-06-25 17:30:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 74, 63, 49, 'group', 6, NULL, NULL, 'f'),
(1397, 1, NULL, NULL, '2026-06-25 17:45:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 73, 67, 49, 'group', 6, NULL, NULL, 'f'),
(1398, 1, NULL, NULL, '2026-07-02 17:00:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 66, 79, 49, 'group', 7, NULL, NULL, 'f'),
(1399, 1, NULL, NULL, '2026-07-02 17:15:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 80, 63, 49, 'group', 7, NULL, NULL, 'f'),
(1400, 1, NULL, NULL, '2026-07-02 17:30:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 81, 67, 49, 'group', 7, NULL, NULL, 'f'),
(1401, 1, NULL, NULL, '2026-07-02 17:45:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 74, 73, 49, 'group', 7, NULL, NULL, 'f'),
(1402, 1, NULL, NULL, '2026-07-09 17:00:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 66, 63, 49, 'group', 8, NULL, NULL, 'f'),
(1403, 1, NULL, NULL, '2026-07-09 17:15:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 79, 74, 49, 'group', 8, NULL, NULL, 'f'),
(1404, 1, NULL, NULL, '2026-07-09 17:30:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 73, 81, 49, 'group', 8, NULL, NULL, 'f'),
(1405, 1, NULL, NULL, '2026-05-07 17:45:00', 'completed', 0, 1, '2026-05-05 14:53:58', '2026-05-13 07:21:23', 65, 76, 50, 'group', 1, NULL, NULL, 't'),
(1406, 1, NULL, NULL, '2026-05-07 18:00:00', 'completed', 0, 1, '2026-05-05 14:53:58', '2026-05-13 07:21:23', 71, 77, 50, 'group', 1, NULL, NULL, 't'),
(1407, 1, NULL, NULL, '2026-05-07 18:15:00', 'completed', 1, 0, '2026-05-05 14:53:58', '2026-05-13 07:21:23', 68, 78, 50, 'group', 1, NULL, NULL, 't'),
(1408, 1, NULL, NULL, '2026-05-07 18:30:00', 'completed', 0, 1, '2026-05-05 14:53:58', '2026-05-13 07:21:23', 75, 82, 50, 'group', 1, NULL, NULL, 't'),
(1409, 1, NULL, NULL, '2026-05-21 17:45:00', 'completed', 1, 0, '2026-05-05 14:53:58', '2026-05-21 18:20:35', 65, 78, 50, 'group', 2, NULL, NULL, 't'),
(1410, 1, NULL, NULL, '2026-05-21 18:00:00', 'completed', 1, 0, '2026-05-05 14:53:58', '2026-05-21 18:40:07', 77, 82, 50, 'group', 2, NULL, NULL, 't'),
(1411, 1, NULL, NULL, '2026-05-21 18:15:00', 'completed', 1, 0, '2026-05-05 14:53:58', '2026-05-21 19:00:14', 76, 75, 50, 'group', 2, NULL, NULL, 't'),
(1412, 1, NULL, NULL, '2026-05-21 18:30:00', 'completed', 0, 1, '2026-05-05 14:53:58', '2026-05-21 18:50:06', 71, 68, 50, 'group', 2, NULL, NULL, 't'),
(1413, 1, NULL, NULL, '2026-06-04 18:00:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 75, 71, 50, 'group', 3, NULL, NULL, 'f'),
(1414, 1, NULL, NULL, '2026-06-04 18:15:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 82, 76, 50, 'group', 3, NULL, NULL, 'f'),
(1415, 1, NULL, NULL, '2026-06-04 18:30:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 78, 77, 50, 'group', 3, NULL, NULL, 'f'),
(1416, 1, NULL, NULL, '2026-06-11 17:45:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 65, 82, 50, 'group', 4, NULL, NULL, 'f'),
(1417, 1, NULL, NULL, '2026-06-11 18:00:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 78, 75, 50, 'group', 4, NULL, NULL, 'f'),
(1418, 1, NULL, NULL, '2026-06-11 18:15:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 77, 68, 50, 'group', 4, NULL, NULL, 'f'),
(1419, 1, NULL, NULL, '2026-06-11 18:30:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 76, 71, 50, 'group', 4, NULL, NULL, 'f'),
(1420, 1, NULL, NULL, '2026-06-18 18:00:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 65, 71, 50, 'group', 5, NULL, NULL, 'f'),
(1421, 1, NULL, NULL, '2026-06-18 18:15:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 68, 76, 50, 'group', 5, NULL, NULL, 'f'),
(1422, 1, NULL, NULL, '2026-06-18 18:30:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 82, 78, 50, 'group', 5, NULL, NULL, 'f'),
(1423, 1, NULL, NULL, '2026-06-25 18:00:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 65, 77, 50, 'group', 6, NULL, NULL, 'f'),
(1424, 1, NULL, NULL, '2026-06-25 18:15:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 71, 82, 50, 'group', 6, NULL, NULL, 'f'),
(1425, 1, NULL, NULL, '2026-06-25 18:30:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 68, 75, 50, 'group', 6, NULL, NULL, 'f'),
(1426, 1, NULL, NULL, '2026-07-02 18:00:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 65, 68, 50, 'group', 7, NULL, NULL, 'f'),
(1427, 1, NULL, NULL, '2026-07-02 18:15:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 75, 77, 50, 'group', 7, NULL, NULL, 'f'),
(1428, 1, NULL, NULL, '2026-07-02 18:30:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 76, 78, 50, 'group', 7, NULL, NULL, 'f'),
(1429, 1, NULL, NULL, '2026-07-09 17:45:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 65, 75, 50, 'group', 8, NULL, NULL, 'f'),
(1430, 1, NULL, NULL, '2026-07-09 18:00:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 82, 68, 50, 'group', 8, NULL, NULL, 'f'),
(1431, 1, NULL, NULL, '2026-07-09 18:15:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 78, 71, 50, 'group', 8, NULL, NULL, 'f'),
(1432, 1, NULL, NULL, '2026-07-09 18:30:00', 'scheduled', 0, 0, '2026-05-05 14:53:58', '2026-05-06 08:10:21', 77, 76, 50, 'group', 8, NULL, NULL, 'f'),
(1713, 3, NULL, NULL, '2026-05-07 17:00:00', 'completed', 0, 1, '2026-05-05 15:03:06', '2026-05-13 07:21:23', 92, 83, 61, 'group', 1, NULL, NULL, 't'),
(1714, 3, NULL, NULL, '2026-05-07 17:15:00', 'completed', 0, 1, '2026-05-05 15:03:06', '2026-05-13 07:21:23', 91, 87, 61, 'group', 1, NULL, NULL, 't'),
(1715, 3, NULL, NULL, '2026-05-07 17:30:00', 'completed', 0, 1, '2026-05-05 15:03:06', '2026-05-13 07:21:23', 97, 94, 61, 'group', 1, NULL, NULL, 't'),
(1716, 3, NULL, NULL, '2026-05-21 17:00:00', 'completed', 1, 0, '2026-05-05 15:03:06', '2026-05-21 17:34:09', 95, 83, 61, 'group', 2, NULL, NULL, 't'),
(1717, 3, NULL, NULL, '2026-05-21 17:15:00', 'completed', 0, 1, '2026-05-05 15:03:06', '2026-05-22 13:59:52', 69, 87, 61, 'group', 2, NULL, NULL, 't'),
(1718, 3, NULL, NULL, '2026-05-21 17:30:00', 'completed', 0, 1, '2026-05-05 15:03:06', '2026-05-21 18:19:52', 91, 97, 61, 'group', 2, NULL, NULL, 't'),
(1719, 3, NULL, NULL, '2026-06-04 17:00:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 95, 87, 61, 'group', 3, NULL, NULL, 'f'),
(1720, 3, NULL, NULL, '2026-06-04 17:15:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 83, 94, 61, 'group', 3, NULL, NULL, 'f'),
(1721, 3, NULL, NULL, '2026-06-04 17:30:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 69, 97, 61, 'group', 3, NULL, NULL, 'f'),
(1722, 3, NULL, NULL, '2026-06-04 17:45:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 92, 91, 61, 'group', 3, NULL, NULL, 'f'),
(1723, 3, NULL, NULL, '2026-06-11 17:00:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 95, 94, 61, 'group', 4, NULL, NULL, 'f'),
(1724, 3, NULL, NULL, '2026-06-11 17:15:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 83, 91, 61, 'group', 4, NULL, NULL, 'f'),
(1725, 3, NULL, NULL, '2026-06-11 17:30:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 69, 92, 61, 'group', 4, NULL, NULL, 'f'),
(1726, 3, NULL, NULL, '2026-06-18 17:00:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 95, 97, 61, 'group', 5, NULL, NULL, 'f'),
(1727, 3, NULL, NULL, '2026-06-18 17:15:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 94, 91, 61, 'group', 5, NULL, NULL, 'f'),
(1728, 3, NULL, NULL, '2026-06-18 17:30:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 87, 92, 61, 'group', 5, NULL, NULL, 'f'),
(1729, 3, NULL, NULL, '2026-06-18 17:45:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 83, 69, 61, 'group', 5, NULL, NULL, 'f'),
(1730, 3, NULL, NULL, '2026-06-25 17:00:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 95, 91, 61, 'group', 6, NULL, NULL, 'f'),
(1731, 3, NULL, NULL, '2026-06-25 17:15:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 97, 92, 61, 'group', 6, NULL, NULL, 'f'),
(1732, 3, NULL, NULL, '2026-06-25 17:30:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 94, 69, 61, 'group', 6, NULL, NULL, 'f'),
(1733, 3, NULL, NULL, '2026-06-25 17:45:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 87, 83, 61, 'group', 6, NULL, NULL, 'f'),
(1734, 3, NULL, NULL, '2026-07-02 17:00:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 95, 92, 61, 'group', 7, NULL, NULL, 'f'),
(1735, 3, NULL, NULL, '2026-07-02 17:15:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 91, 69, 61, 'group', 7, NULL, NULL, 'f'),
(1736, 3, NULL, NULL, '2026-07-02 17:30:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 97, 83, 61, 'group', 7, NULL, NULL, 'f'),
(1737, 3, NULL, NULL, '2026-07-02 17:45:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 94, 87, 61, 'group', 7, NULL, NULL, 'f'),
(1738, 3, NULL, NULL, '2026-07-09 17:00:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 95, 69, 61, 'group', 8, NULL, NULL, 'f'),
(1739, 3, NULL, NULL, '2026-07-09 17:15:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 92, 94, 61, 'group', 8, NULL, NULL, 'f'),
(1740, 3, NULL, NULL, '2026-07-09 17:30:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 87, 97, 61, 'group', 8, NULL, NULL, 'f'),
(1741, 3, NULL, NULL, '2026-05-07 17:45:00', 'completed', 1, 0, '2026-05-05 15:03:06', '2026-05-13 07:21:23', 88, 90, 62, 'group', 1, NULL, NULL, 't'),
(1742, 3, NULL, NULL, '2026-05-07 18:00:00', 'completed', 1, 0, '2026-05-05 15:03:06', '2026-05-13 07:21:23', 89, 93, 62, 'group', 1, NULL, NULL, 't'),
(1743, 3, NULL, NULL, '2026-05-07 18:15:00', 'completed', 0, 1, '2026-05-05 15:03:06', '2026-05-13 07:21:23', 84, 96, 62, 'group', 1, NULL, NULL, 't'),
(1744, 3, NULL, NULL, '2026-05-07 18:30:00', 'completed', 0, 1, '2026-05-05 15:03:06', '2026-05-13 08:14:24', 85, 86, 62, 'group', 1, NULL, NULL, 't'),
(1745, 3, NULL, NULL, '2026-05-21 17:45:00', 'completed', 1, 0, '2026-05-05 15:03:06', '2026-05-21 17:59:25', 88, 96, 62, 'group', 2, NULL, NULL, 't'),
(1746, 3, NULL, NULL, '2026-05-21 18:00:00', 'completed', 0, 1, '2026-05-05 15:03:06', '2026-05-21 18:36:50', 93, 86, 62, 'group', 2, NULL, NULL, 't'),
(1747, 3, NULL, NULL, '2026-05-21 18:15:00', 'completed', 1, 0, '2026-05-05 15:03:06', '2026-05-21 19:08:46', 90, 85, 62, 'group', 2, NULL, NULL, 't'),
(1748, 3, NULL, NULL, '2026-05-21 18:30:00', 'completed', 0, 1, '2026-05-05 15:03:06', '2026-05-21 19:21:58', 89, 84, 62, 'group', 2, NULL, NULL, 't'),
(1749, 3, NULL, NULL, '2026-06-04 18:00:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 85, 89, 62, 'group', 3, NULL, NULL, 'f'),
(1750, 3, NULL, NULL, '2026-06-04 18:15:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 86, 90, 62, 'group', 3, NULL, NULL, 'f'),
(1751, 3, NULL, NULL, '2026-06-04 18:30:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 96, 93, 62, 'group', 3, NULL, NULL, 'f'),
(1752, 3, NULL, NULL, '2026-06-11 17:45:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 88, 86, 62, 'group', 4, NULL, NULL, 'f'),
(1753, 3, NULL, NULL, '2026-06-11 18:00:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 96, 85, 62, 'group', 4, NULL, NULL, 'f'),
(1754, 3, NULL, NULL, '2026-06-11 18:15:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 93, 84, 62, 'group', 4, NULL, NULL, 'f'),
(1755, 3, NULL, NULL, '2026-06-11 18:30:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 90, 89, 62, 'group', 4, NULL, NULL, 'f'),
(1756, 3, NULL, NULL, '2026-06-18 18:00:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 88, 89, 62, 'group', 5, NULL, NULL, 'f'),
(1757, 3, NULL, NULL, '2026-06-18 18:15:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 84, 90, 62, 'group', 5, NULL, NULL, 'f'),
(1758, 3, NULL, NULL, '2026-06-18 18:30:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 86, 96, 62, 'group', 5, NULL, NULL, 'f'),
(1759, 3, NULL, NULL, '2026-06-25 18:00:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 88, 93, 62, 'group', 6, NULL, NULL, 'f'),
(1760, 3, NULL, NULL, '2026-06-25 18:15:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 89, 86, 62, 'group', 6, NULL, NULL, 'f'),
(1761, 3, NULL, NULL, '2026-06-25 18:30:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 84, 85, 62, 'group', 6, NULL, NULL, 'f'),
(1762, 3, NULL, NULL, '2026-07-02 18:00:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 88, 84, 62, 'group', 7, NULL, NULL, 'f'),
(1763, 3, NULL, NULL, '2026-07-02 18:15:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 85, 93, 62, 'group', 7, NULL, NULL, 'f'),
(1764, 3, NULL, NULL, '2026-07-02 18:30:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 90, 96, 62, 'group', 7, NULL, NULL, 'f'),
(1765, 3, NULL, NULL, '2026-07-09 17:45:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 88, 85, 62, 'group', 8, NULL, NULL, 'f'),
(1766, 3, NULL, NULL, '2026-07-09 18:00:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 86, 84, 62, 'group', 8, NULL, NULL, 'f'),
(1767, 3, NULL, NULL, '2026-07-09 18:15:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 96, 89, 62, 'group', 8, NULL, NULL, 'f'),
(1768, 3, NULL, NULL, '2026-07-09 18:30:00', 'scheduled', 0, 0, '2026-05-05 15:03:06', '2026-05-06 08:11:39', 93, 90, 62, 'group', 8, NULL, NULL, 'f');

INSERT INTO "public"."league_groups" ("id", "league_id", "name", "position", "created_at", "updated_at") VALUES
(1, 4, 'Group A', 1, '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(2, 4, 'Group B', 2, '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(3, 5, 'Group A', 1, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(4, 5, 'Group B', 2, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(37, 2, 'Group A', 1, '2026-05-05 14:50:47', '2026-05-05 14:50:47'),
(38, 2, 'Group B', 2, '2026-05-05 14:50:47', '2026-05-05 14:50:47'),
(49, 1, 'Group A', 1, '2026-05-05 14:53:58', '2026-05-05 14:53:58'),
(50, 1, 'Group B', 2, '2026-05-05 14:53:58', '2026-05-05 14:53:58'),
(61, 3, 'Group A', 1, '2026-05-05 15:03:06', '2026-05-05 15:03:06'),
(62, 3, 'Group B', 2, '2026-05-05 15:03:06', '2026-05-05 15:03:06');

INSERT INTO "public"."league_group_entries" ("id", "league_group_id", "league_entry_id", "seed", "points", "manual_advance_rank", "created_at", "updated_at") VALUES
(1, 1, 1, 1, 7, 1, '2026-05-04 07:32:03', '2026-05-04 07:32:04'),
(2, 2, 2, 2, 7, 1, '2026-05-04 07:32:03', '2026-05-04 07:32:04'),
(3, 2, 3, 3, 6, 2, '2026-05-04 07:32:03', '2026-05-04 07:32:04'),
(4, 1, 4, 4, 6, 2, '2026-05-04 07:32:03', '2026-05-04 07:32:04'),
(5, 1, 5, 5, 5, 3, '2026-05-04 07:32:03', '2026-05-04 07:32:04'),
(6, 2, 6, 6, 5, 3, '2026-05-04 07:32:03', '2026-05-04 07:32:04'),
(7, 2, 7, 7, 4, 4, '2026-05-04 07:32:03', '2026-05-04 07:32:04'),
(8, 1, 8, 8, 4, 4, '2026-05-04 07:32:03', '2026-05-04 07:32:04'),
(9, 1, 9, 9, 3, 5, '2026-05-04 07:32:03', '2026-05-04 07:32:04'),
(10, 2, 10, 10, 3, 5, '2026-05-04 07:32:03', '2026-05-04 07:32:04'),
(11, 2, 11, 11, 2, 6, '2026-05-04 07:32:03', '2026-05-04 07:32:04'),
(12, 1, 12, 12, 2, 6, '2026-05-04 07:32:03', '2026-05-04 07:32:04'),
(13, 1, 13, 13, 1, 7, '2026-05-04 07:32:03', '2026-05-04 07:32:04'),
(14, 2, 14, 14, 1, 7, '2026-05-04 07:32:03', '2026-05-04 07:32:04'),
(15, 2, 15, 15, 0, 8, '2026-05-04 07:32:03', '2026-05-04 07:32:04'),
(16, 1, 16, 16, 0, 8, '2026-05-04 07:32:03', '2026-05-04 07:32:04'),
(17, 3, 17, 1, 7, 1, '2026-05-04 07:32:05', '2026-05-04 07:32:06'),
(18, 4, 18, 2, 7, 1, '2026-05-04 07:32:05', '2026-05-04 07:32:06'),
(19, 4, 19, 3, 6, 2, '2026-05-04 07:32:05', '2026-05-04 07:32:06'),
(20, 3, 20, 4, 6, 2, '2026-05-04 07:32:05', '2026-05-04 07:32:06'),
(21, 3, 21, 5, 5, 3, '2026-05-04 07:32:05', '2026-05-04 07:32:06'),
(22, 4, 22, 6, 5, 3, '2026-05-04 07:32:05', '2026-05-04 07:32:06'),
(23, 4, 23, 7, 4, 4, '2026-05-04 07:32:05', '2026-05-04 07:32:06'),
(24, 3, 24, 8, 4, 4, '2026-05-04 07:32:05', '2026-05-04 07:32:06'),
(25, 3, 25, 9, 3, 5, '2026-05-04 07:32:05', '2026-05-04 07:32:06'),
(26, 4, 26, 10, 3, 5, '2026-05-04 07:32:05', '2026-05-04 07:32:06'),
(27, 4, 27, 11, 2, 6, '2026-05-04 07:32:05', '2026-05-04 07:32:06'),
(28, 3, 28, 12, 2, 6, '2026-05-04 07:32:05', '2026-05-04 07:32:06'),
(29, 3, 29, 13, 1, 7, '2026-05-04 07:32:05', '2026-05-04 07:32:06'),
(30, 4, 30, 14, 1, 7, '2026-05-04 07:32:05', '2026-05-04 07:32:06'),
(31, 4, 31, 15, 0, 8, '2026-05-04 07:32:05', '2026-05-04 07:32:06'),
(32, 3, 32, 16, 0, 8, '2026-05-04 07:32:05', '2026-05-04 07:32:06'),
(289, 37, 61, 1, 1, NULL, '2026-05-05 14:50:47', '2026-05-21 17:39:18'),
(290, 38, 50, 2, 2, NULL, '2026-05-05 14:50:47', '2026-05-21 18:48:38'),
(291, 38, 58, 3, 0, NULL, '2026-05-05 14:50:47', '2026-05-05 14:50:47'),
(292, 37, 57, 4, 0, NULL, '2026-05-05 14:50:47', '2026-05-05 14:50:47'),
(293, 37, 47, 5, 0, NULL, '2026-05-05 14:50:47', '2026-05-05 14:50:47'),
(294, 38, 62, 6, 0, NULL, '2026-05-05 14:50:47', '2026-05-05 14:50:47'),
(295, 38, 59, 7, 0, NULL, '2026-05-05 14:50:47', '2026-05-05 14:50:47'),
(296, 37, 56, 8, 1, NULL, '2026-05-05 14:50:47', '2026-05-07 17:55:35'),
(297, 37, 48, 9, 2, NULL, '2026-05-05 14:50:47', '2026-05-21 18:11:20'),
(298, 38, 55, 10, 1, NULL, '2026-05-05 14:50:47', '2026-05-13 08:28:01'),
(299, 38, 53, 11, 1, NULL, '2026-05-05 14:50:47', '2026-05-21 19:06:16'),
(300, 37, 52, 12, 1, NULL, '2026-05-05 14:50:47', '2026-05-07 17:36:08'),
(301, 37, 60, 13, 1, NULL, '2026-05-05 14:50:47', '2026-05-21 17:13:38'),
(302, 38, 51, 14, 2, NULL, '2026-05-05 14:50:47', '2026-05-21 18:32:57'),
(303, 38, 54, 15, 2, NULL, '2026-05-05 14:50:47', '2026-05-21 18:48:06'),
(304, 37, 49, 16, 0, NULL, '2026-05-05 14:50:47', '2026-05-05 14:50:47'),
(385, 49, 79, 1, 0, NULL, '2026-05-05 14:53:58', '2026-05-05 14:53:58'),
(386, 50, 76, 2, 2, NULL, '2026-05-05 14:53:58', '2026-05-21 19:00:14'),
(387, 50, 78, 3, 0, NULL, '2026-05-05 14:53:58', '2026-05-05 14:53:58'),
(388, 49, 73, 4, 2, NULL, '2026-05-05 14:53:58', '2026-05-21 17:29:11'),
(389, 49, 80, 5, 1, NULL, '2026-05-05 14:53:58', '2026-05-21 17:43:46'),
(390, 50, 71, 6, 0, NULL, '2026-05-05 14:53:58', '2026-05-05 14:53:58'),
(391, 50, 77, 7, 2, NULL, '2026-05-05 14:53:58', '2026-05-21 18:40:07'),
(392, 49, 67, 8, 1, NULL, '2026-05-05 14:53:58', '2026-05-07 17:35:13'),
(393, 49, 63, 9, 0, NULL, '2026-05-05 14:53:58', '2026-05-05 14:53:58'),
(394, 50, 75, 10, 0, NULL, '2026-05-05 14:53:58', '2026-05-05 14:53:58'),
(395, 50, 82, 11, 1, NULL, '2026-05-05 14:53:58', '2026-05-07 19:10:42'),
(396, 49, 81, 12, 0, NULL, '2026-05-05 14:53:58', '2026-05-05 14:53:58'),
(397, 49, 66, 13, 1, NULL, '2026-05-05 14:53:58', '2026-05-21 17:25:53'),
(398, 50, 68, 14, 2, NULL, '2026-05-05 14:53:58', '2026-05-21 18:50:06'),
(399, 50, 65, 15, 1, NULL, '2026-05-05 14:53:58', '2026-05-21 18:20:35'),
(400, 49, 74, 16, 1, NULL, '2026-05-05 14:53:58', '2026-05-07 18:12:38'),
(481, 61, 97, 1, 1, NULL, '2026-05-05 15:03:06', '2026-05-21 18:19:52'),
(482, 62, 85, 2, 0, NULL, '2026-05-05 15:03:06', '2026-05-05 15:03:06'),
(483, 62, 89, 3, 1, NULL, '2026-05-05 15:03:06', '2026-05-07 19:09:06'),
(484, 61, 83, 4, 1, NULL, '2026-05-05 15:03:06', '2026-05-07 17:29:31'),
(485, 61, 94, 5, 1, NULL, '2026-05-05 15:03:06', '2026-05-07 18:05:29'),
(486, 62, 96, 6, 1, NULL, '2026-05-05 15:03:06', '2026-05-07 19:06:19'),
(487, 62, 88, 7, 2, NULL, '2026-05-05 15:03:06', '2026-05-21 17:59:25'),
(488, 61, 87, 8, 2, NULL, '2026-05-05 15:03:06', '2026-05-22 13:59:52'),
(489, 61, 92, 9, 0, NULL, '2026-05-05 15:03:06', '2026-05-05 15:03:06'),
(490, 62, 90, 10, 1, NULL, '2026-05-05 15:03:06', '2026-05-21 19:08:47'),
(491, 62, 86, 11, 2, NULL, '2026-05-05 15:03:06', '2026-05-21 18:36:50'),
(492, 61, 95, 12, 1, NULL, '2026-05-05 15:03:06', '2026-05-21 17:34:09'),
(493, 61, 91, 13, 0, NULL, '2026-05-05 15:03:06', '2026-05-05 15:03:06'),
(494, 62, 84, 14, 1, NULL, '2026-05-05 15:03:06', '2026-05-21 19:21:58'),
(495, 62, 93, 15, 0, NULL, '2026-05-05 15:03:06', '2026-05-05 15:03:06'),
(496, 61, 69, 16, 0, NULL, '2026-05-05 15:03:06', '2026-05-05 15:03:06');

INSERT INTO "public"."match_sets" ("id", "match_id", "set_number", "home_points", "away_points", "created_at", "updated_at") VALUES
(1, 1, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(2, 1, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(3, 2, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(4, 2, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(5, 3, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(6, 3, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(7, 4, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(8, 4, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(9, 5, 1, 12, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(10, 5, 2, 13, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(11, 6, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(12, 6, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(13, 7, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(14, 7, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(15, 8, 1, 12, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(16, 8, 2, 13, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(17, 9, 1, 12, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(18, 9, 2, 13, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(19, 10, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(20, 10, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(21, 11, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(22, 11, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(23, 12, 1, 12, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(24, 12, 2, 13, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(25, 13, 1, 12, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(26, 13, 2, 13, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(27, 14, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(28, 14, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(29, 15, 1, 12, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(30, 15, 2, 13, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(31, 16, 1, 12, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(32, 16, 2, 13, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(33, 17, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(34, 17, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(35, 18, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(36, 18, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(37, 19, 1, 12, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(38, 19, 2, 13, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(39, 20, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(40, 20, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(41, 21, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(42, 21, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(43, 22, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(44, 22, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(45, 23, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(46, 23, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(47, 24, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(48, 24, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(49, 25, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(50, 25, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(51, 26, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(52, 26, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(53, 27, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(54, 27, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(55, 28, 1, 12, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(56, 28, 2, 13, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(57, 29, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(58, 29, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(59, 30, 1, 12, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(60, 30, 2, 13, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(61, 31, 1, 12, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(62, 31, 2, 13, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(63, 32, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(64, 32, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(65, 33, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(66, 33, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(67, 34, 1, 12, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(68, 34, 2, 13, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(69, 35, 1, 12, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(70, 35, 2, 13, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(71, 36, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(72, 36, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(73, 37, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(74, 37, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(75, 38, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(76, 38, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(77, 39, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(78, 39, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(79, 40, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(80, 40, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(81, 41, 1, 12, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(82, 41, 2, 13, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(83, 42, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(84, 42, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(85, 43, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(86, 43, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(87, 44, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(88, 44, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(89, 45, 1, 12, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(90, 45, 2, 13, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(91, 46, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(92, 46, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(93, 47, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(94, 47, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(95, 48, 1, 12, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(96, 48, 2, 13, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(97, 49, 1, 12, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(98, 49, 2, 13, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(99, 50, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(100, 50, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(101, 51, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(102, 51, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(103, 52, 1, 12, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(104, 52, 2, 13, 15, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(105, 53, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(106, 53, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(107, 54, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(108, 54, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(109, 55, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(110, 55, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(111, 56, 1, 15, 12, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(112, 56, 2, 15, 13, '2026-05-04 07:32:04', '2026-05-04 07:32:04'),
(113, 60, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(114, 60, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(115, 61, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(116, 61, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(117, 62, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(118, 62, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(119, 63, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(120, 63, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(121, 58, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(122, 58, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(123, 59, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(124, 59, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(125, 57, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(126, 57, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(127, 67, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(128, 67, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(129, 68, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(130, 68, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(131, 69, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(132, 69, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(133, 70, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(134, 70, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(135, 65, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(136, 65, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(137, 66, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(138, 66, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(139, 64, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(140, 64, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(141, 71, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(142, 71, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(143, 72, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(144, 72, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(145, 73, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(146, 73, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(147, 74, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(148, 74, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(149, 75, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(150, 75, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(151, 76, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(152, 76, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(153, 77, 1, 12, 15, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(154, 77, 2, 13, 15, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(155, 78, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(156, 78, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(157, 79, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(158, 79, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(159, 80, 1, 12, 15, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(160, 80, 2, 13, 15, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(161, 81, 1, 12, 15, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(162, 81, 2, 13, 15, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(163, 82, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(164, 82, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(165, 83, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(166, 83, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(167, 84, 1, 12, 15, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(168, 84, 2, 13, 15, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(169, 85, 1, 12, 15, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(170, 85, 2, 13, 15, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(171, 86, 1, 15, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(172, 86, 2, 15, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(173, 87, 1, 12, 15, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(174, 87, 2, 13, 15, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(175, 88, 1, 12, 15, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(176, 88, 2, 13, 15, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(177, 89, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(178, 89, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(179, 90, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(180, 90, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(181, 91, 1, 12, 15, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(182, 91, 2, 13, 15, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(183, 92, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(184, 92, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(185, 93, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(186, 93, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(187, 94, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(188, 94, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(189, 95, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(190, 95, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(191, 96, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(192, 96, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(193, 97, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(194, 97, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(195, 98, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(196, 98, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(197, 99, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(198, 99, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(199, 100, 1, 12, 15, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(200, 100, 2, 13, 15, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(201, 101, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(202, 101, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(203, 102, 1, 12, 15, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(204, 102, 2, 13, 15, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(205, 103, 1, 12, 15, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(206, 103, 2, 13, 15, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(207, 104, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(208, 104, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(209, 105, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(210, 105, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(211, 106, 1, 12, 15, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(212, 106, 2, 13, 15, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(213, 107, 1, 12, 15, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(214, 107, 2, 13, 15, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(215, 108, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(216, 108, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(217, 109, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(218, 109, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(219, 110, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(220, 110, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(221, 111, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(222, 111, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(223, 112, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(224, 112, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(225, 113, 1, 12, 15, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(226, 113, 2, 13, 15, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(227, 114, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(228, 114, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(229, 115, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(230, 115, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(231, 116, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(232, 116, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(233, 117, 1, 12, 15, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(234, 117, 2, 13, 15, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(235, 118, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(236, 118, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(237, 119, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(238, 119, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(239, 120, 1, 12, 15, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(240, 120, 2, 13, 15, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(241, 121, 1, 12, 15, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(242, 121, 2, 13, 15, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(243, 122, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(244, 122, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(245, 123, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(246, 123, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(247, 124, 1, 12, 15, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(248, 124, 2, 13, 15, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(249, 125, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(250, 125, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(251, 126, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(252, 126, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(253, 127, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(254, 127, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(255, 128, 1, 15, 12, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(256, 128, 2, 15, 13, '2026-05-04 07:32:06', '2026-05-04 07:32:06'),
(257, 129, 1, 1, 3, '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(258, 130, 1, 1, 0, '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(259, 131, 1, 1, 6, '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(260, 132, 1, 0, 21, '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(261, 133, 1, 3, 4, '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(262, 134, 1, 1, 0, '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(263, 135, 1, 21, 0, '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(264, 136, 1, 21, 0, '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(265, 137, 1, 0, 21, '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(266, 138, 1, 6, 3, '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(267, 139, 1, 3, 6, '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(268, 140, 1, 2, 1, '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(269, 141, 1, 4, 6, '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(270, 142, 1, 5, 2, '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(271, 143, 1, 3, 1, '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(272, 144, 1, 5, 4, '2026-05-04 07:32:25', '2026-05-04 07:32:25'),
(273, 1713, 1, 17, 30, '2026-05-07 17:29:31', '2026-05-07 17:29:31'),
(274, 1377, 1, 27, 30, '2026-05-07 17:35:13', '2026-05-07 17:35:13'),
(275, 1041, 1, 30, 22, '2026-05-07 17:36:08', '2026-05-07 17:36:08'),
(276, 1042, 1, 15, 0, '2026-05-07 17:39:10', '2026-05-07 17:39:10'),
(277, 1714, 1, 26, 30, '2026-05-07 17:50:19', '2026-05-07 17:50:19'),
(278, 1378, 1, 15, 30, '2026-05-07 17:51:48', '2026-05-07 17:51:48'),
(279, 1043, 1, 14, 30, '2026-05-07 17:55:35', '2026-05-07 17:55:35'),
(280, 1715, 1, 10, 30, '2026-05-07 18:05:29', '2026-05-07 18:05:29'),
(281, 1379, 1, 22, 30, '2026-05-07 18:12:38', '2026-05-07 18:12:38'),
(282, 1741, 1, 30, 14, '2026-05-07 18:23:29', '2026-05-07 18:23:29'),
(283, 1070, 1, 30, 18, '2026-05-07 18:27:50', '2026-05-07 18:27:50'),
(284, 1405, 1, 24, 30, '2026-05-07 18:29:55', '2026-05-07 18:29:55'),
(287, 1072, 1, 30, 21, '2026-05-07 19:03:10', '2026-05-07 19:03:10'),
(288, 1743, 1, 19, 30, '2026-05-07 19:06:19', '2026-05-07 19:06:19'),
(289, 1406, 1, 24, 30, '2026-05-07 19:07:32', '2026-05-07 19:07:32'),
(290, 1407, 1, 30, 12, '2026-05-07 19:08:18', '2026-05-07 19:08:18'),
(291, 1742, 1, 30, 27, '2026-05-07 19:09:06', '2026-05-07 19:09:06'),
(292, 1408, 1, 0, 15, '2026-05-07 19:10:42', '2026-05-07 19:10:42'),
(296, 1071, 1, 14, 30, '2026-05-07 21:46:20', '2026-05-07 21:46:20'),
(297, 1744, 1, 22, 30, '2026-05-13 08:14:24', '2026-05-13 08:14:24'),
(298, 1069, 1, 1, 0, '2026-05-13 08:28:01', '2026-05-13 08:28:01'),
(299, 1044, 1, 0, 15, '2026-05-21 17:13:38', '2026-05-21 17:13:38'),
(300, 1380, 1, 30, 13, '2026-05-21 17:25:53', '2026-05-21 17:25:53'),
(302, 1381, 1, 0, 15, '2026-05-21 17:29:11', '2026-05-21 17:29:11'),
(303, 1716, 1, 30, 20, '2026-05-21 17:34:09', '2026-05-21 17:34:09'),
(304, 1045, 1, 30, 13, '2026-05-21 17:39:18', '2026-05-21 17:39:18'),
(305, 1382, 1, 30, 17, '2026-05-21 17:43:46', '2026-05-21 17:43:46'),
(306, 1745, 1, 30, 24, '2026-05-21 17:59:25', '2026-05-21 17:59:25'),
(307, 1046, 1, 30, 15, '2026-05-21 18:11:20', '2026-05-21 18:11:20'),
(308, 1718, 1, 25, 30, '2026-05-21 18:19:52', '2026-05-21 18:19:52'),
(309, 1409, 1, 30, 29, '2026-05-21 18:20:35', '2026-05-21 18:20:35'),
(310, 1076, 1, 30, 9, '2026-05-21 18:32:57', '2026-05-21 18:32:57'),
(311, 1746, 1, 7, 30, '2026-05-21 18:36:50', '2026-05-21 18:36:50'),
(312, 1410, 1, 30, 20, '2026-05-21 18:40:07', '2026-05-21 18:40:07'),
(313, 1073, 1, 7, 30, '2026-05-21 18:48:06', '2026-05-21 18:48:06'),
(314, 1075, 1, 0, 15, '2026-05-21 18:48:38', '2026-05-21 18:48:38'),
(315, 1412, 1, 0, 15, '2026-05-21 18:50:06', '2026-05-21 18:50:06'),
(316, 1411, 1, 30, 6, '2026-05-21 19:00:14', '2026-05-21 19:00:14'),
(317, 1074, 1, 30, 23, '2026-05-21 19:06:15', '2026-05-21 19:06:15'),
(318, 1747, 1, 30, 27, '2026-05-21 19:08:46', '2026-05-21 19:08:46'),
(319, 1748, 1, 12, 30, '2026-05-21 19:21:58', '2026-05-21 19:21:58'),
(320, 1717, 1, 0, 15, '2026-05-22 13:59:52', '2026-05-22 13:59:52');

INSERT INTO "public"."league_entry_substitutes" ("id", "league_entry_id", "user_id", "created_at", "updated_at") VALUES
(1, 1, 4, '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(2, 2, 14, '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(3, 3, 24, '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(4, 4, 31, '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(5, 5, 40, '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(6, 6, 48, '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(7, 8, 65, '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(8, 10, 77, '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(9, 12, 93, '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(10, 13, 100, '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(11, 16, 119, '2026-05-04 07:32:03', '2026-05-04 07:32:03'),
(12, 17, 4, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(13, 18, 14, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(14, 19, 24, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(15, 20, 31, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(16, 21, 40, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(17, 22, 48, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(18, 24, 65, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(19, 26, 77, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(20, 28, 93, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(21, 29, 100, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(22, 32, 119, '2026-05-04 07:32:05', '2026-05-04 07:32:05'),
(23, 48, 89, '2026-05-04 23:00:20', '2026-05-04 23:00:20'),
(25, 50, 7, '2026-05-04 23:02:41', '2026-05-04 23:02:41'),
(26, 51, 80, '2026-05-04 23:03:30', '2026-05-04 23:03:30'),
(27, 52, 122, '2026-05-04 23:04:05', '2026-05-04 23:04:05'),
(28, 53, 114, '2026-05-04 23:04:41', '2026-05-04 23:04:41'),
(29, 54, 34, '2026-05-04 23:05:07', '2026-05-04 23:05:07'),
(30, 55, 96, '2026-05-04 23:05:34', '2026-05-04 23:05:34'),
(31, 56, 103, '2026-05-04 23:06:15', '2026-05-04 23:06:15'),
(32, 57, 60, '2026-05-04 23:06:47', '2026-05-04 23:06:47'),
(33, 58, 17, '2026-05-04 23:07:26', '2026-05-04 23:07:26'),
(34, 59, 51, '2026-05-04 23:07:50', '2026-05-04 23:07:50'),
(36, 66, 119, '2026-05-05 09:00:09', '2026-05-05 09:00:09'),
(37, 67, 86, '2026-05-05 09:00:51', '2026-05-05 09:00:51'),
(38, 68, 4, '2026-05-05 09:01:02', '2026-05-05 09:01:02'),
(39, 69, 74, '2026-05-05 09:02:22', '2026-05-05 09:02:22'),
(40, 69, 72, '2026-05-05 09:02:22', '2026-05-05 09:02:22'),
(42, 81, 14, '2026-05-05 10:08:39', '2026-05-05 10:08:39'),
(43, 82, 48, '2026-05-05 10:12:15', '2026-05-05 10:12:15'),
(44, 86, 10, '2026-05-05 10:30:36', '2026-05-05 10:30:36'),
(45, 86, 11, '2026-05-05 10:30:36', '2026-05-05 10:30:36'),
(46, 87, 76, '2026-05-05 10:37:15', '2026-05-05 10:37:15'),
(47, 87, 83, '2026-05-05 10:37:15', '2026-05-05 10:37:15'),
(48, 88, 119, '2026-05-05 10:38:54', '2026-05-05 10:38:54'),
(49, 89, 115, '2026-05-05 10:41:09', '2026-05-05 10:41:09'),
(50, 89, 116, '2026-05-05 10:41:09', '2026-05-05 10:41:09'),
(51, 90, 37, '2026-05-05 10:43:15', '2026-05-05 10:43:15'),
(52, 90, 31, '2026-05-05 10:43:15', '2026-05-05 10:43:15'),
(53, 91, 91, '2026-05-05 10:49:42', '2026-05-05 10:49:42'),
(54, 91, 95, '2026-05-05 10:49:42', '2026-05-05 10:49:42'),
(55, 92, 101, '2026-05-05 10:54:09', '2026-05-05 10:54:09'),
(56, 92, 98, '2026-05-05 10:54:09', '2026-05-05 10:54:09'),
(57, 94, 20, '2026-05-05 11:04:08', '2026-05-05 11:04:08'),
(58, 94, 21, '2026-05-05 11:04:08', '2026-05-05 11:04:08'),
(59, 95, 54, '2026-05-05 11:06:36', '2026-05-05 11:06:36'),
(60, 97, 67, '2026-05-05 11:12:29', '2026-05-05 11:12:29'),
(61, 97, 70, '2026-05-05 11:12:29', '2026-05-05 11:12:29'),
(62, 65, 108, '2026-05-05 15:47:05', '2026-05-05 15:47:05'),
(64, 49, 169, '2026-05-06 15:52:41', '2026-05-06 15:52:41'),
(65, 84, 43, '2026-05-06 15:57:19', '2026-05-06 15:57:19'),
(66, 84, 44, '2026-05-06 15:57:19', '2026-05-06 15:57:19'),
(67, 77, 45, '2026-05-06 15:57:56', '2026-05-06 15:57:56');

INSERT INTO "public"."league_entries" ("id", "league_id", "player1_id", "player2_id", "substitute_id", "seed", "created_at", "updated_at", "group_name", "group_picture_path", "team_id") VALUES
(1, 4, 2, 3, 4, 1, '2026-05-04 07:32:03', '2026-05-04 07:32:03', 'Human Capital', NULL, 1),
(2, 4, 12, 13, 14, 2, '2026-05-04 07:32:03', '2026-05-04 07:32:03', 'Sekretariat Perusahaan', NULL, 2),
(3, 4, 22, 23, 24, 3, '2026-05-04 07:32:03', '2026-05-04 07:32:03', 'Teknologi Informasi dan Komunikasi', NULL, 3),
(4, 4, 29, 30, 31, 4, '2026-05-04 07:32:03', '2026-05-04 07:32:03', 'Keuangan', NULL, 4),
(5, 4, 38, 39, 40, 5, '2026-05-04 07:32:03', '2026-05-04 07:32:03', 'Asuransi', NULL, 5),
(6, 4, 46, 47, 48, 6, '2026-05-04 07:32:03', '2026-05-04 07:32:03', 'Strategi Transformasi dan Korporasi', NULL, 6),
(7, 4, 55, 56, NULL, 7, '2026-05-04 07:32:03', '2026-05-04 07:32:03', 'Satuan Pengawasan Intern', NULL, 7),
(8, 4, 63, 64, 65, 8, '2026-05-04 07:32:03', '2026-05-04 07:32:03', 'Umum', NULL, 8),
(9, 4, 71, 72, NULL, 9, '2026-05-04 07:32:03', '2026-05-04 07:32:03', 'Aktuaria Perusahaan', NULL, 9),
(10, 4, 75, 76, 77, 10, '2026-05-04 07:32:03', '2026-05-04 07:32:03', 'Investasi', NULL, 10),
(11, 4, 84, 85, NULL, 11, '2026-05-04 07:32:03', '2026-05-04 07:32:03', 'Akuntansi', NULL, 11),
(12, 4, 91, 92, 93, 12, '2026-05-04 07:32:03', '2026-05-04 07:32:03', 'Manajemen Risiko', NULL, 12),
(13, 4, 98, 99, 100, 13, '2026-05-04 07:32:03', '2026-05-04 07:32:03', 'Pelayanan dan TJSL', NULL, 13),
(14, 4, 106, 107, NULL, 14, '2026-05-04 07:32:03', '2026-05-04 07:32:03', 'Hubungan Antar Lembaga dan UBS', NULL, 14),
(15, 4, 109, 110, NULL, 15, '2026-05-04 07:32:03', '2026-05-04 07:32:03', 'Kepatuhan dan Hukum', NULL, 15),
(16, 4, 117, 118, 119, 16, '2026-05-04 07:32:03', '2026-05-04 07:32:03', 'Kanwil DKI Jakarta', NULL, 16),
(17, 5, 2, 3, 4, 1, '2026-05-04 07:32:05', '2026-05-04 07:32:05', 'Human Capital', NULL, 1),
(18, 5, 12, 13, 14, 2, '2026-05-04 07:32:05', '2026-05-04 07:32:05', 'Sekretariat Perusahaan', NULL, 2),
(19, 5, 22, 23, 24, 3, '2026-05-04 07:32:05', '2026-05-04 07:32:05', 'Teknologi Informasi dan Komunikasi', NULL, 3),
(20, 5, 29, 30, 31, 4, '2026-05-04 07:32:05', '2026-05-04 07:32:05', 'Keuangan', NULL, 4),
(21, 5, 38, 39, 40, 5, '2026-05-04 07:32:05', '2026-05-04 07:32:05', 'Asuransi', NULL, 5),
(22, 5, 46, 47, 48, 6, '2026-05-04 07:32:05', '2026-05-04 07:32:05', 'Strategi Transformasi dan Korporasi', NULL, 6),
(23, 5, 55, 56, NULL, 7, '2026-05-04 07:32:05', '2026-05-04 07:32:05', 'Satuan Pengawasan Intern', NULL, 7),
(24, 5, 63, 64, 65, 8, '2026-05-04 07:32:05', '2026-05-04 07:32:05', 'Umum', NULL, 8),
(25, 5, 71, 72, NULL, 9, '2026-05-04 07:32:05', '2026-05-04 07:32:05', 'Aktuaria Perusahaan', NULL, 9),
(26, 5, 75, 76, 77, 10, '2026-05-04 07:32:05', '2026-05-04 07:32:05', 'Investasi', NULL, 10),
(27, 5, 84, 85, NULL, 11, '2026-05-04 07:32:05', '2026-05-04 07:32:05', 'Akuntansi', NULL, 11),
(28, 5, 91, 92, 93, 12, '2026-05-04 07:32:05', '2026-05-04 07:32:05', 'Manajemen Risiko', NULL, 12),
(29, 5, 98, 99, 100, 13, '2026-05-04 07:32:05', '2026-05-04 07:32:05', 'Pelayanan dan TJSL', NULL, 13),
(30, 5, 106, 107, NULL, 14, '2026-05-04 07:32:05', '2026-05-04 07:32:05', 'Hubungan Antar Lembaga dan UBS', NULL, 14),
(31, 5, 109, 110, NULL, 15, '2026-05-04 07:32:05', '2026-05-04 07:32:05', 'Kepatuhan dan Hukum', NULL, 15),
(32, 5, 117, 118, 119, 16, '2026-05-04 07:32:05', '2026-05-04 07:32:05', 'Kanwil DKI Jakarta', NULL, 16),
(33, 6, 124, 8, NULL, 1, '2026-05-04 07:32:25', '2026-05-04 07:32:25', 'Human Capital', NULL, 17),
(34, 6, 55, 62, NULL, 2, '2026-05-04 07:32:25', '2026-05-04 07:32:25', 'Satuan Pengawasan Intern', NULL, 18),
(35, 6, 65, 63, NULL, 3, '2026-05-04 07:32:25', '2026-05-04 07:32:25', 'Umum', NULL, 19),
(36, 6, 13, 12, NULL, 4, '2026-05-04 07:32:25', '2026-05-04 07:32:25', 'Sekretariat Perusahaan', NULL, 20),
(37, 6, 98, 100, NULL, 5, '2026-05-04 07:32:25', '2026-05-04 07:32:25', 'Pelayanan dan TJSL', NULL, 21),
(38, 6, 136, 137, NULL, 6, '2026-05-04 07:32:25', '2026-05-04 07:32:25', 'Akuntansi', NULL, 22),
(39, 6, 141, 31, NULL, 7, '2026-05-04 07:32:25', '2026-05-04 07:32:25', 'Keuangan', NULL, 23),
(40, 6, 144, 46, NULL, 8, '2026-05-04 07:32:25', '2026-05-04 07:32:25', 'Strategi Transformasi dan Korporasi', NULL, 24),
(41, 6, 147, 109, NULL, 9, '2026-05-04 07:32:25', '2026-05-04 07:32:25', 'Kepatuhan dan Hukum', NULL, 25),
(42, 6, 149, 92, NULL, 10, '2026-05-04 07:32:25', '2026-05-04 07:32:25', 'Manajemen Risiko', NULL, 26),
(43, 6, 44, 38, NULL, 11, '2026-05-04 07:32:25', '2026-05-04 07:32:25', 'Asuransi', NULL, 27),
(44, 6, 24, 152, NULL, 12, '2026-05-04 07:32:25', '2026-05-04 07:32:25', 'Teknologi Informasi dan Komunikasi', NULL, 28),
(45, 6, 155, 156, NULL, 13, '2026-05-04 07:32:25', '2026-05-04 07:32:25', 'Investasi', NULL, 29),
(46, 6, 160, 71, NULL, 14, '2026-05-04 07:32:25', '2026-05-04 07:32:25', 'Aktuaria Perusahaan', NULL, 30),
(47, 2, 73, 74, NULL, 1, '2026-05-04 22:54:02', '2026-05-04 23:23:42', 'Aktuaria Perusahaan', 'league-entries/JDFIIdi1taxbJbwVTeDIIAkGxBo1bf6EtXevlnhW.jpg', NULL),
(48, 2, 87, 88, 89, 2, '2026-05-04 23:00:20', '2026-05-05 11:57:26', 'Akuntansi', 'league-entries/ycA4vnWdHRg5bqmSAtJMqv8ZxMzxb2jwGmralumU.png', NULL),
(49, 2, 41, 43, 169, 3, '2026-05-04 23:02:03', '2026-05-06 15:52:41', 'Asuransi', 'league-entries/Bg2O2SNz9qWcnnweRJNs7ahRiWVBANQS55Dm850u.png', NULL),
(50, 2, 5, 6, 7, 4, '2026-05-04 23:02:41', '2026-05-05 11:39:30', 'Human Capital', 'league-entries/DB9OqAlSnqe2NaRFtubJrYjmZlAmYiGI5sZxcHTg.png', NULL),
(51, 2, 78, 79, 80, 5, '2026-05-04 23:03:30', '2026-05-05 11:58:00', 'Investasi', 'league-entries/SyCyGR8YoHtKOxqY96afW78MKtOnwzhFfjb45CCW.png', NULL),
(52, 2, 120, 121, 122, 6, '2026-05-04 23:04:05', '2026-05-04 23:04:05', 'Kanwil DKI Jakarta', 'league-entries/BxZ9LbqiA38k6fpc1xXyZefDI0bajlYd3iSrctDK.jpg', NULL),
(53, 2, 112, 113, 114, 7, '2026-05-04 23:04:41', '2026-05-05 13:38:47', 'Kepatuhan dan Hukum', 'league-entries/pM3qkpXBy3OCwuSKBh0suubQRe7EveJFUE1uk28Y.png', NULL),
(54, 2, 32, 33, 34, 8, '2026-05-04 23:05:07', '2026-05-05 12:07:01', 'Keuangan', 'league-entries/MEAoPgZxpSBvjWOLOjUFi2ogcP4yODdo3M1KTpb8.png', NULL),
(55, 2, 94, 95, 96, 9, '2026-05-04 23:05:34', '2026-05-04 23:05:34', 'Manajemen Risiko', 'league-entries/iVUOV3MBBJ1bNbVWd8CMDUmgHfxXGAH5cp1aeWur.jpg', NULL),
(56, 2, 101, 102, 103, 10, '2026-05-04 23:06:15', '2026-05-05 12:05:30', 'Pelayanan dan TJSL', 'league-entries/2AjCtI4Kzh9EjxxyDSi3owsFH75bn1PFssXHfXcT.png', NULL),
(57, 2, 58, 59, 60, 11, '2026-05-04 23:06:47', '2026-05-05 13:36:38', 'Satuan Pengawasan Intern', 'league-entries/QjNtxPpZsGdDIcCMtVPx3CQNOj2vtrtVn0BiYxls.png', NULL),
(58, 2, 21, 16, 17, 12, '2026-05-04 23:07:26', '2026-05-07 10:58:36', 'Sekretariat Perusahaan', 'league-entries/k4rThkOc8y7Tb52qRLxCksQt9WQdyFWBTTVvVn29.png', NULL),
(59, 2, 49, 50, 51, 13, '2026-05-04 23:07:50', '2026-05-05 12:02:56', 'Strategi Transformasi dan Korporasi', 'league-entries/CXprBdi4jtt3AL9EYb6neL0IWKOBm1Xd57YbRFY0.png', NULL),
(60, 2, 25, 26, NULL, 14, '2026-05-04 23:08:16', '2026-05-05 12:02:00', 'Teknologi Informasi dan Komunikasi', 'league-entries/zzI4ZPgkRzWW2HUbRxJ2DQi6bApLdHWK4hYL1olQ.png', NULL),
(61, 2, 66, 67, NULL, 15, '2026-05-04 23:08:39', '2026-05-05 13:37:40', 'Umum', 'league-entries/DDBobX2xwkUcSFmMYjTpx1G2eQaONgz6TBVwOIMv.png', NULL),
(62, 2, 162, 163, NULL, 16, '2026-05-04 23:30:38', '2026-05-05 11:49:08', 'Hubungan Antar Lembaga dan UBS', 'league-entries/y2PeYsenl4ZdzxnIRigr0o02FTnzo02gjS9YUPss.png', NULL),
(63, 1, 71, 72, NULL, 1, '2026-05-05 08:51:49', '2026-05-05 13:45:39', 'Aktuaria Perusahaan', 'league-entries/jJP0iLzoQSA26i4kxq3eiW9GPOFdHy3IpvLV1EE1.png', NULL),
(65, 1, 106, 107, 108, 3, '2026-05-05 08:57:30', '2026-05-05 15:47:05', 'Hubungan Antar Lembaga dan UBS', 'league-entries/Y4lsvqivSFMN3zpTl4D5TpiuZfwYDdU2QoVtD9tY.png', NULL),
(66, 1, 117, 118, 119, 4, '2026-05-05 09:00:09', '2026-05-05 09:00:09', 'Kanwil DKI Jakarta', 'league-entries/xAtb8NNrW4EBq5QPoAwof7e3AgMFCEPDW08uTLfh.jpg', NULL),
(67, 1, 84, 85, 86, 5, '2026-05-05 09:00:51', '2026-05-05 13:43:41', 'Akuntansi', 'league-entries/tJjJTocXo04BbdLjYBj1ChEg5KYWqQYfv4qZSntQ.png', NULL),
(68, 1, 2, 3, 4, 6, '2026-05-05 09:01:02', '2026-05-05 13:42:48', 'Human Capital', 'league-entries/36AsQLRAHEFKnnISz01xmU2XHZv14E9pkcg0TA23.png', NULL),
(69, 3, 71, 73, 74, 1, '2026-05-05 09:02:22', '2026-05-05 13:51:00', 'Aktuaria Perusahaan', 'league-entries/gX72Ptr65reY8Jja5cFxd84SgzhHFD6S0Faxu6mg.png', NULL),
(71, 1, 75, 76, NULL, 7, '2026-05-05 09:06:50', '2026-05-05 13:42:36', 'Investasi', 'league-entries/9vgxn72miMfsvNKokeRerza2m3j50AM4ZWFQlEBl.png', NULL),
(73, 1, 63, 64, NULL, 8, '2026-05-05 09:34:37', '2026-05-05 13:42:21', 'Umum', 'league-entries/u96UPAIoLFBjZZXqlaO4fUCvENh8qRroWV7X5VXC.png', NULL),
(74, 1, 23, 22, NULL, 9, '2026-05-05 09:43:28', '2026-05-05 13:42:05', 'Teknologi Informasi dan Komunikasi', 'league-entries/ayTXCtaTMcRlmsvFKGAUJ02VKTrzSxnMXDOhloN0.png', NULL),
(75, 1, 91, 92, NULL, 10, '2026-05-05 09:45:13', '2026-05-05 09:45:13', 'Manajemen Risiko', 'league-entries/B6GqSOVgVGVwn9BHvtvAVWO040BfdrCrb9uhlrhD.jpg', NULL),
(76, 1, 98, 99, NULL, 11, '2026-05-05 09:48:51', '2026-05-05 13:41:35', 'Pelayanan dan TJSL', 'league-entries/wY3qMnmKRmerfZdM4OIAklcN5qDf1qKMdlqddjnq.png', NULL),
(77, 1, 38, 39, 45, 12, '2026-05-05 09:54:21', '2026-05-06 15:57:56', 'Asuransi', 'league-entries/OZkWtYxdhoVpmy5lQSdT06wKStc7jOMPF5dHUgGD.png', NULL),
(78, 1, 109, 110, NULL, 13, '2026-05-05 09:57:24', '2026-05-05 13:40:48', 'Kepatuhan dan Hukum', 'league-entries/NFTgecoK71ZpqLRFmT6E0Kj7ktpNMZiNV1YyXFuy.png', NULL),
(79, 1, 29, 30, NULL, 14, '2026-05-05 09:59:47', '2026-05-05 13:40:31', 'Keuangan', 'league-entries/Ypb4FnciW6QWn0yiBfZcjV3jG1AdAU1BahNbN4ZW.png', NULL),
(80, 1, 171, 62, NULL, 15, '2026-05-05 10:05:16', '2026-05-07 14:28:06', 'Satuan Pengawasan Intern', 'league-entries/sdTxTmdD1e7JglKGKQlW610hOiXPUg7et8Kul4BN.png', NULL),
(81, 1, 12, 13, 14, 16, '2026-05-05 10:08:39', '2026-05-05 13:40:09', 'Sekretariat Perusahaan', 'league-entries/Oa9fpmVltJC6cpmgaAGQoXhbRwJepWMIaoWrwJqT.png', NULL),
(82, 1, 46, 47, 48, 17, '2026-05-05 10:11:46', '2026-05-05 13:39:25', 'Strategi Transformasi dan Korporasi', 'league-entries/4uFLxmNIzKyoqRQzvItN5rBGCmFiFlGo2wXvotdF.png', NULL),
(83, 3, 86, 89, NULL, 2, '2026-05-05 10:15:33', '2026-05-05 13:50:46', 'Akuntansi', 'league-entries/c48l4hlJJhyvOuqtAglljNEZJGa1MfaqCn83Apk5.png', NULL),
(84, 3, 45, 42, 43, 3, '2026-05-05 10:19:09', '2026-05-06 15:57:19', 'Asuransi', 'league-entries/uV8F1WTx1t1jdjn4KYTUHRNKtb7p5XL6M4KUnUFv.png', NULL),
(85, 3, 167, 168, NULL, 4, '2026-05-05 10:28:15', '2026-05-06 08:35:00', 'Hubungan Antar Lembaga dan UBS', 'league-entries/zNqx58TZDz10EojOD8l2oq3zd6lgi0pyUSh5J5KB.png', NULL),
(86, 3, 8, 9, 10, 5, '2026-05-05 10:30:36', '2026-05-05 11:39:04', 'Human Capital', 'league-entries/OUURTFa3BM0vAU6WqBqeOx9Fm1vw7frSQPTC9Cse.png', NULL),
(87, 3, 81, 82, 76, 6, '2026-05-05 10:37:15', '2026-05-05 13:49:52', 'Investasi', 'league-entries/BEZqSMRs1TzHdc8Jv3xgakJ9JDypnm78vb8pxYpq.png', NULL),
(88, 3, 123, 122, 119, 7, '2026-05-05 10:38:54', '2026-05-05 10:38:54', 'Kanwil DKI Jakarta', 'league-entries/JbZsD2sMHYxJWOIXo2A5KJDhPe9tSm01tsHAYaOy.jpg', NULL),
(89, 3, 111, 114, 115, 8, '2026-05-05 10:41:09', '2026-05-05 13:49:12', 'Kepatuhan dan Hukum', 'league-entries/lpk9zzE3Wppc28hCfRchvTlsq9buNQ3D5CSF8NO0.png', NULL),
(90, 3, 35, 36, 37, 9, '2026-05-05 10:43:15', '2026-05-05 13:49:00', 'Keuangan', 'league-entries/3bYJdSRKdA5Lmbc6ZgVZ8pucSA5bmg2R3l7jAxFA.png', NULL),
(91, 3, 97, 96, 91, 10, '2026-05-05 10:49:42', '2026-05-05 10:49:42', 'Manajemen Risiko', 'league-entries/WIXHZjcVGAxLO5XRMbSCc2jJLmZSmORjub2GVWGc.jpg', NULL),
(92, 3, 104, 105, 101, 11, '2026-05-05 10:54:09', '2026-05-05 13:48:47', 'Pelayanan dan TJSL', 'league-entries/7htbUicxZHz6R00gz4v8ReeqWNZkOyflI4K0vFJ7.png', NULL),
(93, 3, 62, 59, NULL, 12, '2026-05-05 11:01:39', '2026-05-07 14:29:14', 'Satuan Pengawasan Intern', 'league-entries/NnUmYAJIrqBAg8F9r1CsVaEBN99QhtqVvP0lzqis.png', NULL),
(94, 3, 18, 19, 20, 13, '2026-05-05 11:04:08', '2026-05-05 13:48:26', 'Sekretariat Perusahaan', 'league-entries/UbKAuUfdGK6lo7f8BYR5CfVpQoiGVqXVB5qyMWnO.png', NULL),
(95, 3, 52, 53, 54, 14, '2026-05-05 11:06:36', '2026-05-05 13:47:54', 'Strategi Transformasi dan Korporasi', 'league-entries/Llcm3QFz2WODWwUVjGSnGqCRr3besps6mPxe2VVl.png', NULL),
(96, 3, 27, 28, NULL, 15, '2026-05-05 11:11:01', '2026-05-05 13:47:41', 'Teknologi Informasi dan Komunikasi', 'league-entries/lZ5XDlKuGmFOHo0ncsULtcwHb0Ck2q8ToKkxvYqL.png', NULL),
(97, 3, 68, 69, 67, 16, '2026-05-05 11:12:29', '2026-05-05 13:47:09', 'Umum', 'league-entries/Q1aofzTlf55Y9clkrHwgYlB1Mj12uLwi7F2LAUZb.png', NULL);

INSERT INTO "public"."sport_categories" ("id", "sport_id", "code", "name", "entry_type", "player_count", "gender_rule", "sort_order", "is_active", "created_at", "updated_at") VALUES
(1, 4, 'MS', 'Single Putra', 'single', 1, 'male', 1, 't', '2026-05-04 07:31:28', '2026-05-04 07:31:28'),
(2, 4, 'WS', 'Single Putri', 'single', 1, 'female', 2, 't', '2026-05-04 07:31:28', '2026-05-04 07:31:28'),
(3, 4, 'MD', 'Ganda Putra', 'double', 2, 'male', 3, 't', '2026-05-04 07:31:28', '2026-05-04 07:31:28'),
(4, 4, 'WD', 'Ganda Putri', 'double', 2, 'female', 4, 't', '2026-05-04 07:31:28', '2026-05-04 07:31:28'),
(5, 4, 'XD', 'Ganda Campuran', 'double', 2, 'mixed', 5, 't', '2026-05-04 07:31:28', '2026-05-04 07:31:28'),
(6, 2, '3V3', '3 vs 3', 'team', 3, 'open', 1, 't', '2026-05-04 07:31:28', '2026-05-04 07:31:28'),
(7, 2, '5V5', '5 vs 5', 'team', 5, 'open', 2, 't', '2026-05-04 07:31:28', '2026-05-04 07:31:28');

ALTER TABLE "public"."leagues" ADD FOREIGN KEY ("branch_id") REFERENCES "public"."branch"("id") ON DELETE SET NULL;
ALTER TABLE "public"."leagues" ADD FOREIGN KEY ("lower_third_place_match_id") REFERENCES "public"."matches"("id") ON DELETE SET NULL;
ALTER TABLE "public"."leagues" ADD FOREIGN KEY ("sport_id") REFERENCES "public"."sports"("id") ON DELETE CASCADE;
ALTER TABLE "public"."leagues" ADD FOREIGN KEY ("lower_champion_entry_id") REFERENCES "public"."league_entries"("id") ON DELETE SET NULL;
ALTER TABLE "public"."leagues" ADD FOREIGN KEY ("third_place_match_id") REFERENCES "public"."matches"("id") ON DELETE SET NULL;
ALTER TABLE "public"."leagues" ADD FOREIGN KEY ("upper_champion_entry_id") REFERENCES "public"."league_entries"("id") ON DELETE SET NULL;
ALTER TABLE "public"."leagues" ADD FOREIGN KEY ("sport_category_id") REFERENCES "public"."sport_categories"("id") ON DELETE SET NULL;
ALTER TABLE "public"."leagues" ADD FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE CASCADE;
ALTER TABLE "public"."league_awards" ADD FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE CASCADE;
ALTER TABLE "public"."league_entry_players" ADD FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;
ALTER TABLE "public"."league_entry_players" ADD FOREIGN KEY ("league_entry_id") REFERENCES "public"."league_entries"("id") ON DELETE CASCADE;


-- Indices
CREATE UNIQUE INDEX league_entry_players_league_entry_id_user_id_unique ON public.league_entry_players USING btree (league_entry_id, user_id);
ALTER TABLE "public"."users" ADD FOREIGN KEY ("branch_id") REFERENCES "public"."branch"("id") ON DELETE RESTRICT;


-- Indices
CREATE UNIQUE INDEX users_email_unique ON public.users USING btree (email);


-- Indices
CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);
CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);


-- Indices
CREATE INDEX cache_expiration_index ON public.cache USING btree (expiration);


-- Indices
CREATE INDEX cache_locks_expiration_index ON public.cache_locks USING btree (expiration);


-- Indices
CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);
ALTER TABLE "public"."activities" ADD FOREIGN KEY ("sport_id") REFERENCES "public"."sports"("id") ON DELETE CASCADE;
ALTER TABLE "public"."activities" ADD FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE CASCADE;
ALTER TABLE "public"."activities" ADD FOREIGN KEY ("branch_id") REFERENCES "public"."branch"("id") ON DELETE SET NULL;


-- Indices
CREATE UNIQUE INDEX failed_jobs_uuid_unique ON public.failed_jobs USING btree (uuid);
ALTER TABLE "public"."teams" ADD FOREIGN KEY ("sport_id") REFERENCES "public"."sports"("id") ON DELETE CASCADE;
ALTER TABLE "public"."teams" ADD FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE CASCADE;
ALTER TABLE "public"."teams" ADD FOREIGN KEY ("branch_id") REFERENCES "public"."branch"("id") ON DELETE SET NULL;


-- Indices
CREATE UNIQUE INDEX sports_name_unique ON public.sports USING btree (name);
ALTER TABLE "public"."activity_participants" ADD FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE CASCADE;
ALTER TABLE "public"."activity_participants" ADD FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;


-- Indices
CREATE UNIQUE INDEX activity_participants_activity_id_user_id_unique ON public.activity_participants USING btree (activity_id, user_id);
ALTER TABLE "public"."team_members" ADD FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE CASCADE;
ALTER TABLE "public"."team_members" ADD FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;


-- Indices
CREATE UNIQUE INDEX team_members_team_id_user_id_unique ON public.team_members USING btree (team_id, user_id);
ALTER TABLE "public"."league_teams" ADD FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE CASCADE;
ALTER TABLE "public"."league_teams" ADD FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE CASCADE;


-- Indices
CREATE UNIQUE INDEX league_teams_league_id_team_id_unique ON public.league_teams USING btree (league_id, team_id);
ALTER TABLE "public"."matches" ADD FOREIGN KEY ("next_match_id") REFERENCES "public"."matches"("id") ON DELETE SET NULL;
ALTER TABLE "public"."matches" ADD FOREIGN KEY ("home_entry_id") REFERENCES "public"."league_entries"("id") ON DELETE SET NULL;
ALTER TABLE "public"."matches" ADD FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE CASCADE;
ALTER TABLE "public"."matches" ADD FOREIGN KEY ("away_team_id") REFERENCES "public"."teams"("id") ON DELETE CASCADE;
ALTER TABLE "public"."matches" ADD FOREIGN KEY ("away_entry_id") REFERENCES "public"."league_entries"("id") ON DELETE SET NULL;
ALTER TABLE "public"."matches" ADD FOREIGN KEY ("league_group_id") REFERENCES "public"."league_groups"("id") ON DELETE SET NULL;
ALTER TABLE "public"."matches" ADD FOREIGN KEY ("home_team_id") REFERENCES "public"."teams"("id") ON DELETE CASCADE;
ALTER TABLE "public"."league_groups" ADD FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE CASCADE;
ALTER TABLE "public"."league_group_entries" ADD FOREIGN KEY ("league_group_id") REFERENCES "public"."league_groups"("id") ON DELETE CASCADE;
ALTER TABLE "public"."league_group_entries" ADD FOREIGN KEY ("league_entry_id") REFERENCES "public"."league_entries"("id") ON DELETE CASCADE;


-- Indices
CREATE UNIQUE INDEX league_group_entries_league_group_id_league_entry_id_unique ON public.league_group_entries USING btree (league_group_id, league_entry_id);
ALTER TABLE "public"."match_substitutions" ADD FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE CASCADE;
ALTER TABLE "public"."match_substitutions" ADD FOREIGN KEY ("original_player_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;
ALTER TABLE "public"."match_substitutions" ADD FOREIGN KEY ("substitute_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;
ALTER TABLE "public"."match_substitutions" ADD FOREIGN KEY ("entry_id") REFERENCES "public"."league_entries"("id") ON DELETE CASCADE;
ALTER TABLE "public"."match_sets" ADD FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE CASCADE;


-- Indices
CREATE UNIQUE INDEX match_sets_match_id_set_number_unique ON public.match_sets USING btree (match_id, set_number);
ALTER TABLE "public"."league_entry_substitutes" ADD FOREIGN KEY ("league_entry_id") REFERENCES "public"."league_entries"("id") ON DELETE CASCADE;
ALTER TABLE "public"."league_entry_substitutes" ADD FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;


-- Indices
CREATE UNIQUE INDEX league_entry_substitutes_league_entry_id_user_id_unique ON public.league_entry_substitutes USING btree (league_entry_id, user_id);
ALTER TABLE "public"."match_documents" ADD FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE CASCADE;
ALTER TABLE "public"."match_documents" ADD FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE CASCADE;
ALTER TABLE "public"."league_entries" ADD FOREIGN KEY ("player1_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;
ALTER TABLE "public"."league_entries" ADD FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE CASCADE;
ALTER TABLE "public"."league_entries" ADD FOREIGN KEY ("player2_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;
ALTER TABLE "public"."league_entries" ADD FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE SET NULL;
ALTER TABLE "public"."league_entries" ADD FOREIGN KEY ("substitute_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;
ALTER TABLE "public"."sport_categories" ADD FOREIGN KEY ("sport_id") REFERENCES "public"."sports"("id") ON DELETE CASCADE;


-- Indices
CREATE UNIQUE INDEX sport_categories_sport_id_code_unique ON public.sport_categories USING btree (sport_id, code);
