 USE biocorepipe;
  ALTER TABLE `project_pipeline`
  ADD `exec_next_settings` varchar(300) NOT NULL after `interdel`,
  ADD `docker_check` varchar(6) NOT NULL after `exec_each_settings`,
  ADD `singu_check` varchar(6) NOT NULL after `exec_each_settings`,
  ADD `docker_img` varchar(256) NOT NULL after `exec_each_settings`,
  ADD `singu_img` varchar(256) NOT NULL after `exec_each_settings`;
