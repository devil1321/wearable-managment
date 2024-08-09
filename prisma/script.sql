CREATE TABLE "User" (
  "id" SERIAL PRIMARY KEY,
  "nickname" VARCHAR(255) UNIQUE NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password" VARCHAR(255),
  "first_name" VARCHAR(255) NOT NULL,
  "last_name" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(255),
  "isgoogle" BOOLEAN NOT NULL,
  "created_at" TIMESTAMPTZ(6) DEFAULT now(),
  "updated_at" TIMESTAMPTZ(6) DEFAULT now()
);

-- Create Task table
CREATE TABLE "Task" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "completed" BOOLEAN DEFAULT false,
  "description" TEXT,
  "user_id" INTEGER NOT NULL REFERENCES "User" ON DELETE CASCADE
);

-- Create SMTP table
CREATE TABLE "SMTP" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255),
  "password" VARCHAR(255),
  "vi" VARCHAR(255),
  "provider" VARCHAR(255),
  "user_id" INTEGER NOT NULL REFERENCES "User" ON DELETE CASCADE,
  "is_active" BOOLEAN DEFAULT false
);

-- Create Room table
CREATE TABLE "Room" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL
);

-- Create Message table
CREATE TABLE "Message" (
  "id" SERIAL PRIMARY KEY,
  "message" VARCHAR(255) NOT NULL,
  "sender_id" INTEGER NOT NULL REFERENCES "User" ON DELETE SET NULL,
  "receiver_id" INTEGER REFERENCES "User" ON DELETE SET NULL,
  "room_id" INTEGER REFERENCES "Room" ON DELETE SET NULL
);