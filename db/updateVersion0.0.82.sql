USE biocorepipe;
  ALTER TABLE `profile_cluster`
  ADD `ssh_id` int(11) NOT NULL AFTER `hostname`;

  ALTER TABLE `profile_amazon`
  ADD `ssh_id` int(11) NOT NULL AFTER `next_path`,
  ADD `amazon_cre_id` int(11) NOT NULL AFTER `next_path`;