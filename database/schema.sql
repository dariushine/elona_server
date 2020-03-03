-- Adminer 4.7.6 PostgreSQL dump

DROP TABLE IF EXISTS "chat";
DROP SEQUENCE IF EXISTS chat_id_seq;
CREATE SEQUENCE chat_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1;

CREATE TABLE "public"."chat" (
    "id" integer DEFAULT nextval('chat_id_seq') NOT NULL,
    "time" timestamp NOT NULL,
    "kind" smallint NOT NULL,
    "text" text NOT NULL,
    "addr" text NOT NULL,
    "lang" text NOT NULL,
    CONSTRAINT "chat_id" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "vote";
DROP SEQUENCE IF EXISTS vote_id_seq;
CREATE SEQUENCE vote_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1;

CREATE TABLE "public"."vote" (
    "id" integer DEFAULT nextval('vote_id_seq') NOT NULL,
    "name" text NOT NULL,
    "votes" integer NOT NULL,
    "addr" text NOT NULL,
    "time" timestamp NOT NULL,
    "totalvotes" integer NOT NULL,
    "lang" text NOT NULL
) WITH (oids = false);


-- 2020-03-03 00:56:31.855438+00
