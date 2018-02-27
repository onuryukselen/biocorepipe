USE biocorepipe;
  ALTER TABLE `process`
  ADD `publish` int(2) NOT NULL AFTER `script`;
