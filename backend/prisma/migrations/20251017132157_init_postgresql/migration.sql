-- CreateEnum
CREATE TYPE "public"."questions_difficulty" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "public"."questions_status" AS ENUM ('draft', 'pending_review', 'approved');

-- CreateTable
CREATE TABLE "public"."answer_options" (
    "option_id" VARCHAR(36) NOT NULL,
    "question_id" VARCHAR(36) NOT NULL,
    "option_text" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,

    CONSTRAINT "answer_options_pkey" PRIMARY KEY ("option_id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "category_id" VARCHAR(36) NOT NULL,
    "category_name" VARCHAR(50) NOT NULL,
    "description" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "public"."programs" (
    "program_id" VARCHAR(36) NOT NULL,
    "program_name" VARCHAR(150) NOT NULL,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("program_id")
);

-- CreateTable
CREATE TABLE "public"."questions" (
    "question_id" VARCHAR(36) NOT NULL,
    "sub_category_id" VARCHAR(36) NOT NULL,
    "statement" TEXT NOT NULL,
    "question_type" VARCHAR(30) NOT NULL,
    "image_path" VARCHAR(255),
    "creation_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "ai_generated" BOOLEAN DEFAULT false,
    "difficulty" "public"."questions_difficulty" NOT NULL DEFAULT 'medium',
    "justification" TEXT,
    "status" "public"."questions_status" NOT NULL DEFAULT 'draft',

    CONSTRAINT "questions_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "public"."roles" (
    "role_id" VARCHAR(36) NOT NULL,
    "role_name" VARCHAR(20) NOT NULL,
    "role_description" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "public"."simulation_attempts" (
    "attempt_id" VARCHAR(36) NOT NULL,
    "user_id" VARCHAR(36) NOT NULL,
    "simulation_id" VARCHAR(36) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),
    "total_score" DECIMAL(5,2),
    "status" VARCHAR(20) NOT NULL,
    "feedback" TEXT NOT NULL,

    CONSTRAINT "simulation_attempts_pkey" PRIMARY KEY ("attempt_id")
);

-- CreateTable
CREATE TABLE "public"."simulation_questions" (
    "simulation_question_id" VARCHAR(36) NOT NULL,
    "simulation_id" VARCHAR(36) NOT NULL,
    "question_id" VARCHAR(36) NOT NULL,
    "display_order" INTEGER,

    CONSTRAINT "simulation_questions_pkey" PRIMARY KEY ("simulation_question_id")
);

-- CreateTable
CREATE TABLE "public"."simulations" (
    "simulation_id" VARCHAR(36) NOT NULL,
    "simulation_name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "creation_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "simulations_pkey" PRIMARY KEY ("simulation_id")
);

-- CreateTable
CREATE TABLE "public"."sub_categories" (
    "sub_category_id" VARCHAR(36) NOT NULL,
    "category_id" VARCHAR(36) NOT NULL,
    "sub_category_name" VARCHAR(150) NOT NULL,
    "description" TEXT,

    CONSTRAINT "sub_categories_pkey" PRIMARY KEY ("sub_category_id")
);

-- CreateTable
CREATE TABLE "public"."user_answers" (
    "user_answer_id" VARCHAR(36) NOT NULL,
    "attempt_id" VARCHAR(36) NOT NULL,
    "question_id" VARCHAR(36) NOT NULL,
    "selected_option_id" VARCHAR(36),
    "answer_text" TEXT,
    "is_correct" BOOLEAN,
    "question_score" DECIMAL(5,2),

    CONSTRAINT "user_answers_pkey" PRIMARY KEY ("user_answer_id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "user_id" VARCHAR(36) NOT NULL,
    "role_id" VARCHAR(36) NOT NULL,
    "program_id" VARCHAR(36),
    "user_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "registration_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "verificated" BOOLEAN DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE INDEX "answer_options_question_id_idx" ON "public"."answer_options"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "category_name" ON "public"."categories"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "program_name" ON "public"."programs"("program_name");

-- CreateIndex
CREATE INDEX "sub_category_id" ON "public"."questions"("sub_category_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_name" ON "public"."roles"("role_name");

-- CreateIndex
CREATE INDEX "simulation_attempts_simulation_id_idx" ON "public"."simulation_attempts"("simulation_id");

-- CreateIndex
CREATE INDEX "user_id" ON "public"."simulation_attempts"("user_id");

-- CreateIndex
CREATE INDEX "simulation_questions_question_id_idx" ON "public"."simulation_questions"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "simulation_questions_sim_quest_unique" ON "public"."simulation_questions"("simulation_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "simulation_id_2" ON "public"."simulation_questions"("simulation_id", "display_order");

-- CreateIndex
CREATE UNIQUE INDEX "simulations_simulation_name_key" ON "public"."simulations"("simulation_name");

-- CreateIndex
CREATE INDEX "category_id" ON "public"."sub_categories"("category_id");

-- CreateIndex
CREATE INDEX "attempt_id" ON "public"."user_answers"("attempt_id");

-- CreateIndex
CREATE INDEX "user_answers_question_id_idx" ON "public"."user_answers"("question_id");

-- CreateIndex
CREATE INDEX "selected_option_id" ON "public"."user_answers"("selected_option_id");

-- CreateIndex
CREATE UNIQUE INDEX "email" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "program_id" ON "public"."users"("program_id");

-- CreateIndex
CREATE INDEX "role_id" ON "public"."users"("role_id");

-- AddForeignKey
ALTER TABLE "public"."answer_options" ADD CONSTRAINT "answer_options_ibfk_1" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("question_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."questions" ADD CONSTRAINT "questions_ibfk_1" FOREIGN KEY ("sub_category_id") REFERENCES "public"."sub_categories"("sub_category_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."simulation_attempts" ADD CONSTRAINT "simulation_attempts_ibfk_1" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."simulation_attempts" ADD CONSTRAINT "simulation_attempts_ibfk_2" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("simulation_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."simulation_questions" ADD CONSTRAINT "simulation_questions_ibfk_1" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("simulation_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."simulation_questions" ADD CONSTRAINT "simulation_questions_ibfk_2" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("question_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."sub_categories" ADD CONSTRAINT "sub_categories_ibfk_1" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."user_answers" ADD CONSTRAINT "user_answers_ibfk_1" FOREIGN KEY ("attempt_id") REFERENCES "public"."simulation_attempts"("attempt_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."user_answers" ADD CONSTRAINT "user_answers_ibfk_2" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("question_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."user_answers" ADD CONSTRAINT "user_answers_ibfk_3" FOREIGN KEY ("selected_option_id") REFERENCES "public"."answer_options"("option_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_ibfk_1" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_ibfk_2" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("program_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
