USE biocorepipe;

  ALTER TABLE `users`
  ADD `google_id` varchar(100) NOT NULL,
  ADD `google_image` varchar(255) NOT NULL;

ALTER TABLE `users` DROP INDEX `userind`
ALTER TABLE `users` DROP INDEX `clusteruserind`