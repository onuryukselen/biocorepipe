USE biocorepipe;

ALTER TABLE `users` 
ADD CONSTRAINT `userind` UNIQUE (`username`);
    

ALTER TABLE `biocorepipe_save`
  ADD `rev_id` int(11) NOT NULL,
  ADD `rev_comment` varchar(20) NOT NULL,
  ADD `pipeline_gid` int(11) NOT NULL;
  
ALTER TABLE `process`
  ADD `rev_id` int(11) NOT NULL,
  ADD `rev_comment` varchar(20) NOT NULL,
  ADD `process_gid` int(11) NOT NULL;
  
