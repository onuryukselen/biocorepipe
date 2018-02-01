 USE biocorepipe;
  ALTER TABLE `profile_amazon`
  ADD `cmd` varchar(500) NOT NULL AFTER `executor`;
  ALTER TABLE `profile_cluster`
  ADD `cmd` varchar(500) NOT NULL AFTER `executor`;
  ALTER TABLE `profile_local`
  ADD `cmd` varchar(500) NOT NULL AFTER `executor`;
  ALTER TABLE `project_pipeline`
  ADD `cmd` varchar(500) NOT NULL AFTER `output_dir`;