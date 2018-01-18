  USE biocorepipe;
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

 ALTER TABLE `run`
  ADD CONSTRAINT `runs_ibfk_1` FOREIGN KEY (`project_pipeline_id`) REFERENCES `project_pipeline` (`id`);