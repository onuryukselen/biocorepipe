 USE biocorepipe;
ALTER TABLE process_parameter CHANGE `name` `sname` varchar(256);

  ALTER TABLE `profile_amazon`
  ADD `executor_job` varchar(25) NOT NULL AFTER `executor`,
  ADD `job_memory` varchar(25) NOT NULL AFTER `executor`,
  ADD `job_cpu` varchar(25) NOT NULL AFTER `executor`,
  ADD `job_queue` varchar(25) NOT NULL AFTER `executor`,
  ADD `job_time` varchar(25) NOT NULL AFTER `executor`;
  ALTER TABLE `profile_cluster`
  ADD `executor_job` varchar(25) NOT NULL AFTER `executor`,
  ADD `job_memory` varchar(25) NOT NULL AFTER `executor`,
  ADD `job_cpu` varchar(25) NOT NULL AFTER `executor`,
  ADD `job_queue` varchar(25) NOT NULL AFTER `executor`,
  ADD `job_time` varchar(25) NOT NULL AFTER `executor`;

  ALTER TABLE `profile_local`
  ADD `executor_job` varchar(25) NOT NULL AFTER `executor`,
  ADD `job_memory` varchar(25) NOT NULL AFTER `executor`,
  ADD `job_cpu` varchar(25) NOT NULL AFTER `executor`,
  ADD `job_queue` varchar(25) NOT NULL AFTER `executor`,
  ADD `job_time` varchar(25) NOT NULL AFTER `executor`;