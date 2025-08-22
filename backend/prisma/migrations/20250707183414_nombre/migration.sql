-- CreateTable
CREATE TABLE `answer_options` (
    `option_id` VARCHAR(36) NOT NULL,
    `question_id` VARCHAR(36) NOT NULL,
    `option_text` TEXT NOT NULL,
    `is_correct` BOOLEAN NOT NULL,

    INDEX `question_id`(`question_id`),
    PRIMARY KEY (`option_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `category_id` VARCHAR(36) NOT NULL,
    `category_name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,

    UNIQUE INDEX `category_name`(`category_name`),
    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `programs` (
    `program_id` VARCHAR(36) NOT NULL,
    `program_name` VARCHAR(150) NOT NULL,

    UNIQUE INDEX `program_name`(`program_name`),
    PRIMARY KEY (`program_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `questions` (
    `question_id` VARCHAR(36) NOT NULL,
    `sub_category_id` VARCHAR(36) NOT NULL,
    `statement` TEXT NOT NULL,
    `question_type` VARCHAR(30) NOT NULL,
    `image_path` VARCHAR(255) NULL,
    `creation_date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ai_generated` BOOLEAN NULL DEFAULT false,
    `difficulty` ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
    `justification` TEXT NULL,
    `status` ENUM('draft', 'pending_review', 'approved') NOT NULL DEFAULT 'draft',

    INDEX `sub_category_id`(`sub_category_id`),
    PRIMARY KEY (`question_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `role_id` VARCHAR(36) NOT NULL,
    `role_name` VARCHAR(20) NOT NULL,
    `role_description` TEXT NULL,

    UNIQUE INDEX `role_name`(`role_name`),
    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `simulation_attempts` (
    `attempt_id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `simulation_id` VARCHAR(36) NOT NULL,
    `start_time` DATETIME(0) NOT NULL,
    `end_time` DATETIME(0) NULL,
    `total_score` DECIMAL(5, 2) NULL,
    `status` VARCHAR(20) NOT NULL,

    INDEX `simulation_id`(`simulation_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`attempt_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `simulation_questions` (
    `simulation_question_id` VARCHAR(36) NOT NULL,
    `simulation_id` VARCHAR(36) NOT NULL,
    `question_id` VARCHAR(36) NOT NULL,
    `display_order` INTEGER NULL,

    INDEX `question_id`(`question_id`),
    UNIQUE INDEX `simulation_id`(`simulation_id`, `question_id`),
    UNIQUE INDEX `simulation_id_2`(`simulation_id`, `display_order`),
    PRIMARY KEY (`simulation_question_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `simulations` (
    `simulation_id` VARCHAR(36) NOT NULL,
    `simulation_name` VARCHAR(150) NOT NULL,
    `description` TEXT NULL,
    `creation_date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_active` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`simulation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sub_categories` (
    `sub_category_id` VARCHAR(36) NOT NULL,
    `category_id` VARCHAR(36) NOT NULL,
    `sub_category_name` VARCHAR(150) NOT NULL,
    `description` TEXT NULL,

    INDEX `category_id`(`category_id`),
    PRIMARY KEY (`sub_category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_answers` (
    `user_answer_id` VARCHAR(36) NOT NULL,
    `attempt_id` VARCHAR(36) NOT NULL,
    `question_id` VARCHAR(36) NOT NULL,
    `selected_option_id` VARCHAR(36) NULL,
    `answer_text` TEXT NULL,
    `is_correct` BOOLEAN NULL,
    `question_score` DECIMAL(5, 2) NULL,

    INDEX `attempt_id`(`attempt_id`),
    INDEX `question_id`(`question_id`),
    INDEX `selected_option_id`(`selected_option_id`),
    PRIMARY KEY (`user_answer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_id` VARCHAR(36) NOT NULL,
    `role_id` VARCHAR(36) NOT NULL,
    `program_id` VARCHAR(36) NULL,
    `user_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `registration_date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `verificated` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `email`(`email`),
    INDEX `program_id`(`program_id`),
    INDEX `role_id`(`role_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `answer_options` ADD CONSTRAINT `answer_options_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions`(`question_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories`(`sub_category_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `simulation_attempts` ADD CONSTRAINT `simulation_attempts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `simulation_attempts` ADD CONSTRAINT `simulation_attempts_ibfk_2` FOREIGN KEY (`simulation_id`) REFERENCES `simulations`(`simulation_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `simulation_questions` ADD CONSTRAINT `simulation_questions_ibfk_1` FOREIGN KEY (`simulation_id`) REFERENCES `simulations`(`simulation_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `simulation_questions` ADD CONSTRAINT `simulation_questions_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions`(`question_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sub_categories` ADD CONSTRAINT `sub_categories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_answers` ADD CONSTRAINT `user_answers_ibfk_1` FOREIGN KEY (`attempt_id`) REFERENCES `simulation_attempts`(`attempt_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_answers` ADD CONSTRAINT `user_answers_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions`(`question_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_answers` ADD CONSTRAINT `user_answers_ibfk_3` FOREIGN KEY (`selected_option_id`) REFERENCES `answer_options`(`option_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`program_id`) REFERENCES `programs`(`program_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
