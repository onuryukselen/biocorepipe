USE biocorepipe;
  ALTER TABLE `profile_amazon`
  ADD `subnet_id` varchar(256) NOT NULL AFTER `image_id`,
  ADD `shared_storage_id` varchar(256) NOT NULL AFTER `image_id`,
  ADD `shared_storage_mnt` varchar(256) NOT NULL AFTER `image_id`,
  ADD `status` varchar(15) NOT NULL AFTER `name`,
  ADD `nodes` varchar(10) NOT NULL AFTER `status`,
  ADD `autoscale_check` varchar(6) NOT NULL AFTER `nodes`,
  ADD `autoscale_maxIns` varchar(10) NOT NULL AFTER `autoscale_check`;