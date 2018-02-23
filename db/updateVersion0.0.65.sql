USE biocorepipe;
  ALTER TABLE `biocorepipe_save`
  ADD `pin` varchar(6) DEFAULT NULL AFTER `nodes`,
  ADD `pin_order` int(5) DEFAULT NULL AFTER `nodes`;