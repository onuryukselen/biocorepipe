--
-- Table structure for table `feedback`
--
 USE biocorepipe;
CREATE TABLE IF NOT EXISTS `feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(256) NOT NULL,
  `message` text NOT NULL,
  `date_created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;


  ALTER TABLE `profile_amazon`
  DROP `success_key`,
  ADD `secret_key` varchar(256) NOT NULL AFTER `access_key`;