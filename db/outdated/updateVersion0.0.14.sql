USE biocorepipe;
ALTER TABLE `biocorepipe_save`
  ADD  `owner_id` int(11) DEFAULT NULL,
  ADD `group_id` int(11) DEFAULT NULL,
  ADD `perms` int(11) DEFAULT NULL,
  ADD `date_created` datetime DEFAULT NULL,
  ADD `date_modified` datetime DEFAULT NULL,
  ADD `last_modified_user` int(11) DEFAULT NULL;
  
  ALTER TABLE `parameter`
  DROP `channel_name`,
  DROP `file_path`,
  DROP `input_text`,
  DROP `date_created`,
  DROP `date_modified`,
  DROP `last_modified_user`,
  ADD `owner_id` int(11) DEFAULT NULL,
  ADD `group_id` int(11) DEFAULT NULL,
  ADD `perms` int(11) DEFAULT NULL,
  ADD `date_created` datetime DEFAULT NULL,
  ADD `date_modified` datetime DEFAULT NULL,
  ADD `last_modified_user` int(11) DEFAULT NULL;

  ALTER TABLE `process`
  DROP `date_created`,
  DROP `date_modified`,
  DROP `last_modified_user`,
  ADD `owner_id` int(11) DEFAULT NULL,
  ADD `group_id` int(11) DEFAULT NULL,
  ADD `perms` int(11) DEFAULT NULL,
  ADD `date_created` datetime DEFAULT NULL,
  ADD `date_modified` datetime DEFAULT NULL,
  ADD `last_modified_user` int(11) DEFAULT NULL;
  
  ALTER TABLE `process_parameter`
  DROP `date_created`,
  DROP `date_modified`,
  DROP `last_modified_user`,
  ADD `owner_id` int(11) DEFAULT NULL,
  ADD `group_id` int(11) DEFAULT NULL,
  ADD `perms` int(11) DEFAULT NULL,
  ADD `date_created` datetime DEFAULT NULL,
  ADD `date_modified` datetime DEFAULT NULL,
  ADD `last_modified_user` int(11) DEFAULT NULL;
  
  
CREATE TABLE `perms` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `perms_name` varchar(45) DEFAULT NULL,
 `perms_var` varchar(45) DEFAULT NULL,
 `value` int(11) DEFAULT NULL,
 PRIMARY KEY (`id`),
 KEY `val` (`value`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

INSERT INTO `perms`(`id`, `perms_name`, `perms_var`, `value`) VALUES 
('1', 'Only me', 'only_me', '3'),
('2', 'Only my groups', 'only_my_groups', '15'),
('3', 'Everyone', 'everyone', '63');
  