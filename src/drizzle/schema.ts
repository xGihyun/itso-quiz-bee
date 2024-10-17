import {
  pgEnum,
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  smallint,
  boolean,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("role", ["player", "admin"]);
export const openStatusEnum = pgEnum("lobby_status", ["open", "closed"]);
export const quizQuestionEnum = pgEnum("quiz_question_variant", [
  "multiple-choice",
  "boolean",
  "written",
]);

// Users

export const UsersTable = pgTable("users", {
  id: uuid("user_id").primaryKey().defaultRandom(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull(),
});

export const UserDetailsTable = pgTable("user_details", {
  id: uuid("user_detail_id").primaryKey().defaultRandom(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  firstName: text("first_name").notNull(),
  middleName: text("middle_name"),
  lastName: text("last_name").notNull(),

  userId: uuid("user_id")
    .references(() => UsersTable.id)
    .notNull()
    .unique(),
});

// Quiz Lobby

export const LobbiesTable = pgTable("lobbies", {
  id: uuid("lobby_id").primaryKey().defaultRandom(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  name: text("name").notNull(),
  description: text("description"),
  code: text("code").notNull().unique(),
  capacity: integer("capacity"),

  status: openStatusEnum("status").notNull(),
});

export const UsersInLobbies = pgTable("users_in_lobbies", {
  id: uuid("user_in_lobby_id").primaryKey().defaultRandom(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  userId: uuid("user_id")
    .references(() => UsersTable.id)
    .notNull(),
  lobbyId: uuid("lobby_id")
    .references(() => LobbiesTable.id)
    .notNull(),
});

// Quiz

export const QuizzesTable = pgTable("quizzes", {
  id: uuid("quiz_id").primaryKey().defaultRandom(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  name: text("name").notNull(),
  description: text("description"),
  status: openStatusEnum("status").notNull(),

  lobbyId: uuid("lobby_id")
    .references(() => LobbiesTable.id)
    .notNull(),
});

export const QuizQuestionsTable = pgTable("quiz_questions", {
  id: uuid("quiz_question_id").primaryKey().defaultRandom(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  content: text("content").notNull(),
  variant: quizQuestionEnum("variant").notNull(),
  points: smallint("points").notNull(),
  orderNumber: smallint("order_number").notNull(),

  quizId: uuid("quiz_id")
    .references(() => QuizzesTable.id)
    .notNull(),
});

export const QuizAnswersTable = pgTable("quiz_answers", {
  id: uuid("quiz_answer_id").primaryKey().defaultRandom(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  content: text("content").notNull(),
  isCorrect: boolean("is_correct").notNull(),

  quizQuestionId: uuid("quiz_question_id")
    .references(() => QuizQuestionsTable.id)
    .notNull(),
});

// Player Quiz Answers

export const PlayerSelectedAnswersTable = pgTable("player_selected_answers", {
  id: uuid("player_selected_answer_id").primaryKey().defaultRandom(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  quizAnswerId: uuid("quiz_answer_id")
    .references(() => QuizAnswersTable.id)
    .notNull(),
  userId: uuid("user_id")
    .references(() => UsersTable.id)
    .notNull(),
});

export const PlayerWrittenAnswersTable = pgTable("player_written_answers", {
  id: uuid("player_written_answer_id").primaryKey().defaultRandom(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  content: text("content").notNull(),

  quizQuestionId: uuid("quiz_question_id")
    .references(() => QuizQuestionsTable.id)
    .notNull(),
  userId: uuid("user_id")
    .references(() => UsersTable.id)
    .notNull(),
});
