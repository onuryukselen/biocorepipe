USE biocorepipe;
  ALTER TABLE `project_pipeline`
  ADD `singu_opt` varchar(500) NOT NULL AFTER `singu_img`,
  ADD `docker_opt` varchar(500) NOT NULL AFTER `docker_img`;

