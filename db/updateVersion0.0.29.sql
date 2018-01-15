  USE biocorepipe;
 DROP TABLE `project_pipeline_file`;
 DROP TABLE `project_file`;
 DROP TABLE `file`;

 CREATE TABLE IF NOT EXISTS `input` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=20 ;

CREATE TABLE IF NOT EXISTS `project_input` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `input_id` int(11) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `input_id` (`input_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=20 ;

--
-- Constraints for table `project_input`
--
ALTER TABLE `project_input`
  ADD CONSTRAINT `project_input_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `project_input_ibfk_2` FOREIGN KEY (`input_id`) REFERENCES `input` (`id`);
  
    CREATE TABLE IF NOT EXISTS `project_pipeline_input` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `pipeline_id` int(11) NOT NULL,
  `input_id` int(11) NOT NULL,
  `project_pipeline_id` int(11) NOT NULL,  
  `g_num` int(11) NOT NULL,
  `given_name` varchar(256) NOT NULL,
  `qualifier` varchar(4) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `pipeline_id` (`pipeline_id`),
  KEY `input_id` (`input_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=20 ;
  
  ALTER TABLE `project_pipeline_input`
  ADD CONSTRAINT `project_pipeline_input_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `project_pipeline_input_ibfk_2` FOREIGN KEY (`input_id`) REFERENCES `input` (`id`),
  ADD CONSTRAINT `project_pipeline_input_ibfk_3` FOREIGN KEY (`pipeline_id`) REFERENCES `biocorepipe_save` (`id`);
  
    CREATE TABLE IF NOT EXISTS `run` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_pipeline_id` int(11) NOT NULL,  
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_pipeline_id` (`project_pipeline_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=20 ;

 ALTER TABLE `run`
  ADD CONSTRAINT `runs_ibfk_1` FOREIGN KEY (`project_pipeline_id`) REFERENCES `project_pipeline` (`id`);
  