USE biocorepipe;
  ALTER TABLE `process_parameter`
  ADD `closure` varchar(256) NOT NULL AFTER `sname`,
  ADD `operator` varchar(50) NOT NULL AFTER `sname`;
  
  ALTER TABLE `parameter`
  Drop `version`;
