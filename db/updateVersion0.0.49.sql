USE biocorepipe;
  ALTER TABLE `run`
  DROP `run_status`,
  ADD `run_status` varchar(11) NOT NULL AFTER `pid`;