 USE biocorepipe;
  ALTER TABLE `profile_amazon`
  ADD `next_memory` varchar(25) NOT NULL AFTER `executor`,
  ADD `next_cpu` varchar(25) NOT NULL AFTER `executor`,
  ADD `next_queue` varchar(25) NOT NULL AFTER `executor`,
  ADD `next_time` varchar(25) NOT NULL AFTER `executor`;
  ALTER TABLE `profile_cluster`
  ADD `next_memory` varchar(25) NOT NULL AFTER `executor`,
  ADD `next_cpu` varchar(25) NOT NULL AFTER `executor`,
  ADD `next_queue` varchar(25) NOT NULL AFTER `executor`,
  ADD `next_time` varchar(25) NOT NULL AFTER `executor`;

  ALTER TABLE `profile_local`
  ADD `next_memory` varchar(25) NOT NULL AFTER `executor`,
  ADD `next_cpu` varchar(25) NOT NULL AFTER `executor`,
  ADD `next_queue` varchar(25) NOT NULL AFTER `executor`,
  ADD `next_time` varchar(25) NOT NULL AFTER `executor`;
  
  ALTER TABLE `project_pipeline`
  DROP `exec_next`,
  DROP `exec_next_settings`;