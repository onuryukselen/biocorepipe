USE biocorepipe;
  ALTER TABLE `profile_amazon`
  ADD `pid` int(11) DEFAULT NULL AFTER `status`;