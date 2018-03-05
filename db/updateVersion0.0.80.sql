USE biocorepipe;
  ALTER TABLE `ssh`
  ADD `check_userkey` varchar(6) NOT NULL AFTER `name`,
  ADD `check_ourkey` varchar(6) NOT NULL AFTER `name`;


