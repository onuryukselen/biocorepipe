USE biocorepipe;
ALTER TABLE `process_group`
DROP `last_modified_user`,
ADD `last_modified_user` varchar(45) DEFAULT NULL;

ALTER TABLE `users`
DROP `last_modified_user`,
ADD `last_modified_user` varchar(45) DEFAULT NULL;

ALTER TABLE `user_group`
DROP `last_modified_user`,
ADD `last_modified_user` varchar(45) DEFAULT NULL;

ALTER TABLE `groups`
DROP `last_modified_user`,
ADD `last_modified_user` varchar(45) DEFAULT NULL;

ALTER TABLE `biocorepipe_save`
DROP `last_modified_user`,
ADD `last_modified_user` varchar(45) DEFAULT NULL;

ALTER TABLE `parameter`
DROP `last_modified_user`,
ADD `last_modified_user` varchar(45) DEFAULT NULL;

ALTER TABLE `process`
DROP `last_modified_user`,
ADD `last_modified_user` varchar(45) DEFAULT NULL;

ALTER TABLE `process_parameter`
DROP `last_modified_user`,
ADD `last_modified_user` varchar(45) DEFAULT NULL;




