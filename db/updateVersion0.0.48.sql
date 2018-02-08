USE biocorepipe;
  ALTER TABLE `profile_amazon`
  ADD `ssh` varchar(256) NOT NULL AFTER `status`;
