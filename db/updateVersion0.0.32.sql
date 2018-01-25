 USE biocorepipe;
  ALTER TABLE `project_pipeline`
  ADD `name` varchar(256) NOT NULL after `id`,
  ADD `summary` varchar(256) NOT NULL after `name`,
  ADD `output_dir` varchar(256) NOT NULL after `summary`,
  ADD `profile` varchar(30) NOT NULL after `output_dir`,
  ADD `interdel` varchar(6) NOT NULL after `run_env`,
  ADD `exec_each` varchar(6) NOT NULL after `interdel`,
  ADD `exec_all` varchar(6) NOT NULL after `exec_each`,
  ADD `exec_all_settings` text NOT NULL after `exec_all`,
  ADD `exec_each_settings` text NOT NULL after `exec_all_settings`;
  
  
DROP TABLE `run`;
  
  CREATE TABLE IF NOT EXISTS `run` (
  `project_pipeline_id` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `run_status` int(11) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY `project_pipeline_id` (`project_pipeline_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

 