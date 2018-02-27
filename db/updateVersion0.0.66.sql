USE biocorepipe;
  ALTER TABLE `run`
  ADD `attempt` int(11) DEFAULT NULL AFTER `run_status`;
