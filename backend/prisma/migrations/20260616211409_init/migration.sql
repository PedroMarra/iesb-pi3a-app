-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `matricula` VARCHAR(191) NOT NULL,
    `curso` VARCHAR(191) NULL,
    `avatar` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_matricula_key`(`matricula`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `posts` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `category` VARCHAR(191) NOT NULL DEFAULT 'Geral',
    `likes` INTEGER NOT NULL DEFAULT 0,
    `likedBy` VARCHAR(2000) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comments` (
    `id` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schedules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `startTime` VARCHAR(191) NOT NULL,
    `endTime` VARCHAR(191) NOT NULL,
    `room` VARCHAR(191) NOT NULL,
    `shift` ENUM('MATUTINO', 'VESPERTINO', 'NOTURNO') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `p1` DOUBLE NULL,
    `p2` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grades` ADD CONSTRAINT `grades_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
