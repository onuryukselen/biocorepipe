  USE biocorepipe;
  
  CREATE TABLE IF NOT EXISTS `profile_local` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `next_path` varchar(256) NOT NULL,
  `executor` varchar(25) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=20;

  CREATE TABLE IF NOT EXISTS `profile_cluster` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `username` varchar(256) NOT NULL,
  `hostname` varchar(256) NOT NULL,
  `next_path` varchar(256) NOT NULL,
  `executor` varchar(25) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=20;

  CREATE TABLE IF NOT EXISTS `profile_amazon` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `next_path` varchar(256) NOT NULL,
  `default_region` varchar(256) NOT NULL,
  `access_key` varchar(256) NOT NULL,
  `success_key` varchar(256) NOT NULL,
  `instance_type` varchar(256) NOT NULL,
  `image_id` varchar(256) NOT NULL,
  `executor` varchar(25) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=20;

