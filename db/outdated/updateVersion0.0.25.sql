  USE biocorepipe;
  CREATE TABLE IF NOT EXISTS `project_pipeline` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `pipeline_id` int(11) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `pipeline_id` (`pipeline_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=20 ;


--
-- Constraints for table `project_pipeline`
--
ALTER TABLE `project_pipeline`
  ADD CONSTRAINT `project_pipeline_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `project_pipeline_ibfk_2` FOREIGN KEY (`pipeline_id`) REFERENCES `biocorepipe_save` (`id`);
  
  
  CREATE TABLE IF NOT EXISTS `file` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `file_type` varchar(11) NOT NULL,
  `sample_id` varchar(11) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=20 ;



ALTER TABLE `biocorepipe_save`
  ADD `summary` text NOT NULL;

ALTER TABLE `project`
  ADD `summary` text NOT NULL;
