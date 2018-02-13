USE biocorepipe;
--
-- Table structure for table `run_log`
--

CREATE TABLE IF NOT EXISTS `run_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_pipeline_id` int(11) NOT NULL,
  `run_status` varchar(20) NOT NULL,
  `duration` varchar(30) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_ended` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` int(11) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=10;
