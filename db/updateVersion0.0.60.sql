USE biocorepipe;
  ALTER TABLE `feedback`
  ADD `url` varchar(256) NOT NULL AFTER `message`;