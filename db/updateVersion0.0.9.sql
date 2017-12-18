USE biocorepipe;
ALTER TABLE `process_group`
  ADD  `owner_id` int(11) DEFAULT NULL,
  ADD `group_id` int(11) DEFAULT NULL,
  ADD `perms` int(11) DEFAULT NULL,
  ADD `date_created` datetime DEFAULT NULL,
  ADD `date_modified` datetime DEFAULT NULL,
  ADD `last_modified_user` int(11) DEFAULT NULL;
  
  CREATE TABLE `users` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `username` varchar(45) NOT NULL,
 `clusteruser` varchar(45) DEFAULT NULL,
 `role` varchar(45) DEFAULT NULL,
 `name` varchar(45) NOT NULL,
 `email` varchar(45) NOT NULL,
 `institute` varchar(45) NOT NULL,
 `lab` varchar(45) NOT NULL,
 `photo_loc` varchar(255) NOT NULL DEFAULT '/img/avatar5.png',
 `memberdate` datetime DEFAULT NULL,
 `owner_id` int(11) DEFAULT NULL,
 `group_id` int(11) DEFAULT NULL,
 `perms` int(11) DEFAULT NULL,
 `date_created` datetime DEFAULT NULL,
 `date_modified` datetime DEFAULT NULL,
 `last_modified_user` int(11) DEFAULT NULL,
 PRIMARY KEY (`id`),
 UNIQUE KEY `userind` (`username`),
 KEY `clusteruserind` (`clusteruser`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=420 DEFAULT CHARSET=latin1;


CREATE TABLE `user_group` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `u_id` int(11) DEFAULT NULL,
 `g_id` int(11) DEFAULT NULL,
 `owner_id` int(11) DEFAULT NULL,
 `group_id` int(11) DEFAULT NULL,
 `perms` int(11) DEFAULT NULL,
 `date_created` datetime DEFAULT NULL,
 `date_modified` datetime DEFAULT NULL,
 `last_modified_user` int(11) DEFAULT NULL,
 PRIMARY KEY (`id`),
 KEY `user` (`u_id`) USING BTREE,
 KEY `group` (`g_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=471 DEFAULT CHARSET=latin1;


CREATE TABLE `groups` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(45) DEFAULT NULL,
 `owner_id` int(11) DEFAULT NULL,
 `group_id` int(11) DEFAULT NULL,
 `perms` int(11) DEFAULT NULL,
 `date_created` datetime DEFAULT NULL,
 `date_modified` datetime DEFAULT NULL,
 `last_modified_user` int(11) DEFAULT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=153 DEFAULT CHARSET=latin1;