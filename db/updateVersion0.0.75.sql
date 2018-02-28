USE biocorepipe;
  ALTER TABLE `biocorepipe_save`
  ADD `publish` int(2) NOT NULL AFTER `pin`;
