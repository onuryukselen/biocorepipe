-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 26, 2018 at 06:25 PM
-- Server version: 5.5.58-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `biocorepipe`
--

-- --------------------------------------------------------
DROP DATABASE IF EXISTS biocorepipe;
CREATE DATABASE biocorepipe;
USE biocorepipe;
--
-- Table structure for table `biocorepipe_save`
--

CREATE TABLE IF NOT EXISTS `biocorepipe_save` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `edges` text NOT NULL,
  `mainG` text NOT NULL,
  `nodes` text NOT NULL,
  `name` text NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  `rev_id` int(11) NOT NULL,
  `rev_comment` varchar(20) NOT NULL,
  `pipeline_gid` int(11) NOT NULL,
  `summary` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=160 ;

--
-- Dumping data for table `biocorepipe_save`
--

INSERT INTO `biocorepipe_save` (`id`, `edges`, `mainG`, `nodes`, `name`, `owner_id`, `group_id`, `perms`, `date_created`, `date_modified`, `last_modified_user`, `rev_id`, `rev_comment`, `pipeline_gid`, `summary`) VALUES
(79, '{''edges'':["o-inPro-1-9-11_i-10-0-9-0","i-outPro-1-10-12_o-10-0-10-0"]}', '{''mainG'':[549.84167480469,51.032623291016,1.0255305767059]}', '{"g-0":[-78.41121673584,49.570999145508,"10","Build_Index"],"g-11":[-273.11877441406,30.351045608521,"inPro","hg19"],"g-12":[139.8620300293,59.941570281982,"outPro","index"]}', 'RNA1', 473, NULL, 63, NULL, '2018-01-25 00:20:24', '473', 0, '', 5, 'fwffsafsdd'),
(80, '{''edges'':[]}', '{''mainG'':[0,0,1]}', '{"g-0":[265.66665649414,243.66667175293,"138","dna"]}', 'afaf', 473, NULL, 63, NULL, '2018-01-08 01:44:37', '473', 0, '', 6, 'This pipeline takes you 755iuh'),
(88, '{''edges'':[]}', '{''mainG'':[0,0,1]}', '{}', 'adad', 473, NULL, 63, '2018-01-08 00:37:50', '2018-01-20 05:27:00', '473', 0, '', 8, 'A typical human cell consists of about 6 billion base pairs of DNA and 600 million bases of mRNA. Usually a mix of millions of cells are used in sequencing the DNA or RNA using traditional methods like Sanger sequencing or Illumina sequencing. By using deep sequencing of DNA and RNA from a single cell, cellular functions can be investigated extensively.[1] Like typical NGS experiments, the protocols of single cell sequencing generally contain the following steps: isolation of a single cell, nucleic acid extraction and amplification, sequencing library preparation, sequencing and bioinformatic data analysis. It is more challenging to perform single cell sequencing in comparison with sequencing from cells in bulk. The minimal amount of starting materia'),
(105, '{''edges'':["o-inPro-1-9-0_i-10-0-9-2","o-inPro-1-9-0_i-10-0-9-1"]}', '{''mainG'':[212.60543823242,121.95203399658,0.71938455104828]}', '{"g-0":[92.128570556641,-18.981174468994,"inPro","inputparam"],"g-1":[655.984375,180.25987243652,"10","Build_Index"],"g-2":[493.75451660156,-1.2871292829514,"10","Build_Index"]}', 'ab1', 473, NULL, 63, '2018-01-08 02:04:17', '2018-01-09 16:38:15', '473', 0, '', 11, 'sfwfsf'),
(121, '{''edges'':[]}', '{''mainG'':[0,0,1]}', '{"g-0":[268.67706298828,150.86111450195,"inPro","inputparam"]}', 'ssvs', 473, NULL, 63, '2018-01-08 20:55:41', '2018-01-08 20:55:41', '473', 0, '', 12, 'sfsfsf'),
(122, '{''edges'':[]}', '{''mainG'':[0,0,1]}', '{"g-0":[268.67706298828,150.86111450195,"inPro","inputparam"]}', 'ssvs', 473, NULL, 3, '2018-01-08 21:05:40', '2018-01-09 15:57:44', '473', 1, 'kjbv', 12, 'sfsfsf'),
(128, '{''edges'':["o-inPro-1-9-0_i-10-0-9-1"]}', '{''mainG'':[-120,-64,1]}', '{"g-0":[268.67706298828,150.86111450195,"inPro","inputparam"],"g-1":[421.67706298828,167.86109924316,"10","Build_Index"]}', 'ssvs', 473, NULL, 3, '2018-01-09 15:58:26', '2018-01-20 05:28:53', '473', 2, 'sadecesayi123', 12, 'targets of single cell genomics due to its difficulty for culturing. Single cell genomics is the one way to identify microbiomesâ€™ identities and its genomes. The first microorganism used for single cell sequencing was a bacterium. When the data will be assembled in the near future, several new functions of these organisms might be discovered and might provide pros and cons regarding human health.[8]\n\nCancer sequencing is also an emerging application of scDNAseq.'),
(129, '{''edges'':["o-inPro-1-9-0_i-10-0-9-2","o-inPro-1-9-0_i-10-0-9-1"]}', '{''mainG'':[212.60543823242,121.95203399658,0.71938449144363]}', '{"g-0":[140.78121948242,19.940984725952,"inPro","inputparam"],"g-1":[655.984375,180.25987243652,"10","Build_Index"],"g-2":[493.75451660156,-1.2871292829514,"10","Build_Index"]}', 'ab1', 473, NULL, 63, '2018-01-09 16:38:50', '2018-01-09 16:41:19', '473', 1, 'new kjbkjbl lkjnlknl', 11, 'sfwfsf'),
(130, '{''edges'':["o-inPro-1-9-0_i-10-0-9-2","o-inPro-1-9-0_i-10-0-9-1"]}', '{''mainG'':[243.60543823242,101.95203399658,0.71938449144363]}', '{"g-0":[286.73928833008,150.60824584961,"inPro","inputparam"],"g-1":[655.984375,180.25987243652,"10","Build_Index"],"g-2":[493.75451660156,-1.2871292829514,"10","Build_Index"]}', 'ab1', 473, NULL, 3, '2018-01-09 16:40:01', '2018-01-12 17:01:02', '473', 2, 'sadece sayi1234', 11, 'sfwfsf'),
(131, '{''edges'':["o-inPro-1-9-0_i-10-0-9-2","o-inPro-1-9-0_i-10-0-9-1"]}', '{''mainG'':[212.60543823242,121.95203399658,0.71938449144363]}', '{"g-0":[153.29196166992,293.78619384766,"inPro","inputparam"],"g-1":[655.984375,180.25987243652,"10","Build_Index"],"g-2":[493.75451660156,-1.2871292829514,"10","Build_Index"]}', 'ab1', 473, NULL, 3, '2018-01-09 16:57:15', '2018-01-09 16:57:15', '473', 3, 'reee', 11, 'sfwfsf'),
(132, '{''edges'':["o-inPro-1-9-0_i-10-0-9-2","o-inPro-1-9-0_i-10-0-9-1"]}', '{''mainG'':[144.60543823242,113.95203399658,0.71938449144363]}', '{"g-0":[142.17134094238,56.083003997803,"inPro","inputparam"],"g-1":[655.984375,180.25987243652,"10","Build_Index"],"g-2":[420.08041381836,-15.187901496887,"10","Build_Index"]}', 'ab1', 473, NULL, 3, '2018-01-09 16:57:44', '2018-01-20 05:29:11', '473', 4, 'www', 11, 'Current methods for quantifying molecular states of cells, from microarray to standard RNA-seq analysis, mostly depend on estimating the mean value from millions of cells by averaging the signal of individual cells. Given the heterogeneity of cell population, measurement of the mean values of signals overlooks the internal interactions and differences within a cell population that may be crucial for maintaining normal tissue functions and facilitating disease progression.'),
(133, '{''edges'':["o-inPro-1-9-0_i-10-0-9-1"]}', '{''mainG'':[125,102.00000762939,1]}', '{"g-0":[114.67707824707,69.861114501953,"inPro","inputparam"],"g-1":[402.67706298828,173.86111450195,"10","Build_Index"]}', 'khb', 473, NULL, 3, '2018-01-09 17:06:05', '2018-01-09 17:06:30', '473', 0, '', 13, 'jhvii uhiuhiu iuhiin i'),
(134, '{''edges'':[]}', '{''mainG'':[143,-162.00001525879,1]}', '{"g-0":[265.66665649414,243.66667175293,"138","dna"]}', 'afaf', 473, NULL, 3, '2018-01-09 18:12:50', '2018-01-09 18:13:45', '473', 1, 'hhh', 6, 'This pipeline takes you 755iuh'),
(135, '{''edges'':[]}', '{''mainG'':[122,-59.000007629395,1]}', '{"g-0":[265.66665649414,243.66667175293,"138","dna"]}', 'afaf', 473, NULL, 3, '2018-01-09 18:16:55', '2018-01-09 18:16:55', '473', 2, 'dd', 6, 'This pipeline takes you 755iuh'),
(136, '{''edges'':[]}', '{''mainG'':[5,-67.000007629395,1]}', '{"g-0":[307.66665649414,201.66667175293,"138","dna"]}', 'afaf', 473, NULL, 3, '2018-01-09 18:17:59', '2018-01-09 18:19:35', '473', 3, 'jj', 6, 'This pipeline takes you 755iuh'),
(137, '{''edges'':[]}', '{''mainG'':[37,-86.000007629395,1]}', '{"g-0":[265.66665649414,243.66667175293,"138","dna"]}', 'afaf', 473, NULL, 3, '2018-01-09 18:19:45', '2018-01-09 18:19:45', '473', 4, 'kjj', 6, 'This pipeline takes you 755iuh'),
(138, '{''edges'':[]}', '{''mainG'':[43,-64.000007629395,1]}', '{"g-0":[265.66665649414,243.66667175293,"138","dna"]}', 'afaf', 473, NULL, 3, '2018-01-09 18:20:45', '2018-01-09 18:20:45', '473', 5, 'ww', 6, 'This pipeline takes you 755iuh'),
(139, '{''edges'':[]}', '{''mainG'':[-88,-70.000007629395,1]}', '{"g-0":[265.66665649414,243.66667175293,"138","dna"]}', 'afaf', 473, NULL, 3, '2018-01-09 18:21:25', '2018-01-09 18:21:25', '473', 6, 'kl', 6, 'This pipeline takes you 755iuh'),
(140, '{''edges'':[]}', '{''mainG'':[-59,-131.00001525879,1]}', '{"g-0":[265.66665649414,243.66667175293,"138","dna"]}', 'afaf', 473, NULL, 3, '2018-01-09 18:21:45', '2018-01-09 18:22:05', '473', 7, 'kuh', 6, 'This pipeline takes you 755iuh'),
(142, '{''edges'':[]}', '{''mainG'':[0,0,1]}', '{"g-0":[226.67707824707,152.63888549805,"137","troy"]}', 'ghdg', 473, NULL, 3, '2018-01-09 18:23:17', '2018-01-09 18:24:09', '473', 0, '', 14, ''),
(143, '{''edges'':[]}', '{''mainG'':[43,-74.000007629395,1]}', '{"g-0":[750.66662597656,194.66667175293,"138","dna"]}', 'afaf', 473, NULL, 3, '2018-01-09 18:29:36', '2018-01-09 18:29:36', '473', 8, 'sf', 6, 'This pipeline takes you 755iuh'),
(144, '{''edges'':["i-outPro-1-10-2_o-10-0-10-1"]}', '{''mainG'':[0,0,1]}', '{"g-1":[263.67706298828,126.86109924316,"10","Build_Index"],"g-2":[474.67706298828,141.86111450195,"outPro","outputparam"]}', 'afaf', 473, NULL, 3, '2018-01-09 19:23:18', '2018-01-20 18:11:23', '473', 9, 'dd', 6, '    Single-cell genomics is heavily dependent on increasing the copies of DNA found in the cell so there is enough to be sequenced. </br></br>\n\nThis has led to the development of strategies for whole genome amplification (WGA). \n\nOne widely adopted WGA techniques is called degenerate oligonucleotideâ€“primed polymerase chain reaction (DOP-PCR). \n\nThis method uses the well established DNA amplification method PCR to try and amplify the entire genome using a large set of primers. Although simple, this method has been shown to have very low genome coverage. \n\nAn improvement on DOP-PCR is Multiple displacement amplification (MDA), which uses random primers and a high fidelity enzyme, usually Î¦29 DNA polymerase, to accomplish the amplification of larger fragments and greater genome coverage than DOP-PCR. Despite these improvement MDA still has a sequence dependent bias (certain parts of the genome are amplified more than others because of their sequence). '),
(149, '{''edges'':["o-inPro-1-9-0_i-10-0-9-1","i-outPro-1-10-2_o-10-0-10-1"]}', '{''mainG'':[0,0,1]}', '{"g-0":[191.66665649414,170.66665649414,"inPro","genome"],"g-1":[402.66665649414,169.66667175293,"10","Build_Index"],"g-2":[620.66668701172,176.66667175293,"outPro","index"]}', 'zczc', 473, NULL, 3, '2018-01-11 16:31:28', '2018-01-25 20:10:21', '473', 0, '', 19, ''),
(156, '{''edges'':["o-inPro-1-9-11_i-10-0-9-0","o-inPro-1-64-17_i-148-3-64-16","o-10-0-10-0_i-148-2-10-16","o-inPro-1-9-11_i-148-0-9-16","o-inPro-1-11-18_i-148-1-11-16","i-outPro-1-13-19_o-148-0-13-16","i-outPro-1-17-20_o-148-1-17-16"]}', '{''mainG'':[374.84167480469,148.03262329102,1.0255305767059]}', '{"g-0":[-117.41541290283,88.5751953125,"10","Build_Index"],"g-11":[-276.04409790039,-93.487289428711,"inPro","hg19"],"g-16":[328.4397277832,10.369309425354,"148","Map_Tophat2"],"g-17":[65.16138458252,186.86331176758,"inPro","mate"],"g-18":[85.63858795166,-9.1327934265137,"inPro","gut_and_liver_readpairs"],"g-19":[555.63916015625,-71.539512634277,"outPro","aligned"],"g-20":[541.01263427734,73.751129150391,"outPro","unaligned"]}', 'RNA1', 473, NULL, 63, '2018-01-17 18:12:40', '2018-01-17 18:32:00', '473', 1, 'added map', 5, 'fwffsafsdd'),
(157, '{''edges'':["o-inPro-1-9-11_i-10-0-9-0","o-inPro-1-64-17_i-148-3-64-16","o-10-0-10-0_i-148-2-10-16","o-inPro-1-9-11_i-148-0-9-16","o-inPro-1-11-18_i-148-1-11-16","i-outPro-1-13-19_o-148-0-13-16","i-outPro-1-17-20_o-148-1-17-16"]}', '{''mainG'':[360.8053894043,199.5619354248,0.77758306264877]}', '{"g-0":[-117.41541290283,88.5751953125,"10","Build_Index"],"g-11":[-269.11038208008,-100.42099761963,"inPro","hg19"],"g-16":[328.4397277832,10.369309425354,"148","Map_Tophat2"],"g-17":[65.16138458252,186.86331176758,"inPro","mate"],"g-18":[85.63858795166,-9.1327934265137,"inPro","gut_and_liver_readpairs"],"g-19":[555.63916015625,-71.539512634277,"outPro","aligned"],"g-20":[541.01263427734,73.751129150391,"outPro","unaligned"]}', 'RNA1', 473, NULL, 63, '2018-01-20 05:07:49', '2018-01-20 17:53:15', '473', 2, 'sfs', 5, 'The coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. </br> It is a paradisematic country, in which roasted parts of sentences fly into your mouth.'),
(159, '{''edges'':["o-inPro-1-9-11_i-10-0-9-0","o-inPro-1-64-17_i-148-3-64-16","o-10-0-10-0_i-148-2-10-16","o-inPro-1-9-11_i-148-0-9-16","o-inPro-1-11-18_i-148-1-11-16","i-outPro-1-13-19_o-148-0-13-16","i-outPro-1-17-20_o-148-1-17-16"]}', '{''mainG'':[257.80541992188,153.56192016602,0.77758306264877]}', '{"g-0":[-117.41541290283,88.5751953125,"10","Build_Index"],"g-11":[-269.11038208008,-100.42099761963,"inPro","hg19"],"g-16":[328.4397277832,10.369309425354,"148","Map_Tophat2"],"g-17":[65.16138458252,186.86331176758,"inPro","mate"],"g-18":[85.63858795166,-9.1327934265137,"inPro","gut_and_liver_readpairs"],"g-19":[555.63916015625,-71.539512634277,"outPro","aligned"],"g-20":[541.01263427734,73.751129150391,"outPro","unaligned"]}', 'RNA1', 473, NULL, 3, '2018-01-25 00:40:08', '2018-01-25 01:21:42', '473', 3, 'izin ver', 5, 'The coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. </br> It is a paradisematic country, in which roasted parts of sentences fly into your mouth.');

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE IF NOT EXISTS `groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `input`
--

CREATE TABLE IF NOT EXISTS `input` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=94 ;

--
-- Dumping data for table `input`
--

INSERT INTO `input` (`id`, `name`, `owner_id`, `group_id`, `perms`, `date_created`, `date_modified`, `last_modified_user`) VALUES
(22, 'abc2', 473, NULL, 3, '2018-01-14 04:11:55', '2018-01-14 04:15:54', '473'),
(24, 'dd2', 473, NULL, 3, '2018-01-14 04:16:01', '2018-01-14 04:16:05', '473'),
(34, 'aaa', 473, NULL, 3, '2018-01-14 15:20:15', '2018-01-14 15:20:15', '473'),
(35, 'adad', 473, NULL, 3, '2018-01-14 15:36:31', '2018-01-14 15:36:31', '473'),
(36, 'ss2', 473, NULL, 3, '2018-01-14 16:22:56', '2018-01-14 16:39:52', '473'),
(37, 'ss', 473, NULL, 3, '2018-01-14 16:44:44', '2018-01-14 16:44:44', '473'),
(38, 'ss2', 473, NULL, 3, '2018-01-14 16:45:31', '2018-01-14 16:45:35', '473'),
(39, 'ss', 473, NULL, 3, '2018-01-14 16:49:50', '2018-01-14 16:49:50', '473'),
(40, 'adad', 473, NULL, 3, '2018-01-14 16:52:17', '2018-01-14 16:52:17', '473'),
(41, 'adad', 473, NULL, 3, '2018-01-14 16:52:28', '2018-01-14 16:52:28', '473'),
(42, 'wfw', 473, NULL, 3, '2018-01-14 16:54:03', '2018-01-14 16:54:03', '473'),
(43, 'sfsf', 473, NULL, 3, '2018-01-14 16:54:07', '2018-01-14 16:54:07', '473'),
(44, 'sfsf', 473, NULL, 3, '2018-01-14 16:54:13', '2018-01-14 16:54:13', '473'),
(45, 'sfs', 473, NULL, 3, '2018-01-14 16:54:15', '2018-01-14 16:54:15', '473'),
(46, '1232', 473, NULL, 3, '2018-01-14 16:54:26', '2018-01-14 16:54:28', '473'),
(47, 'adadadasdasd2', 473, NULL, 3, '2018-01-14 17:05:07', '2018-01-14 17:05:07', '473'),
(48, 'adadaadaaaaaa', 473, NULL, 3, '2018-01-14 17:05:11', '2018-01-14 17:05:11', '473'),
(49, 'sSs', 473, NULL, 3, '2018-01-14 17:05:14', '2018-01-14 17:05:14', '473'),
(50, 'iug', 473, NULL, 3, '2018-01-14 17:14:48', '2018-01-14 17:14:48', '473'),
(51, 'ada', 473, NULL, 3, '2018-01-14 17:25:55', '2018-01-14 17:25:55', '473'),
(52, 'adad', 473, NULL, 3, '2018-01-14 17:26:36', '2018-01-14 17:26:36', '473'),
(53, 'fwf', 473, NULL, 3, '2018-01-14 17:28:00', '2018-01-14 17:28:00', '473'),
(54, 'adad', 473, NULL, 3, '2018-01-14 17:29:00', '2018-01-14 17:29:00', '473'),
(55, 'fwf', 473, NULL, 3, '2018-01-14 17:32:08', '2018-01-14 17:32:08', '473'),
(56, 'dgd', 473, NULL, 3, '2018-01-14 17:34:32', '2018-01-14 17:34:32', '473'),
(57, 'fs', 473, NULL, 3, '2018-01-14 17:35:55', '2018-01-14 17:35:55', '473'),
(58, 'ad', 473, NULL, 3, '2018-01-14 17:36:51', '2018-01-14 17:36:51', '473'),
(59, 'wfw', 473, NULL, 3, '2018-01-14 17:46:06', '2018-01-14 17:46:06', '473'),
(60, 'wfwf', 473, NULL, 3, '2018-01-14 17:46:10', '2018-01-14 17:46:10', '473'),
(61, 'sfs', 473, NULL, 3, '2018-01-14 17:48:56', '2018-01-14 17:48:56', '473'),
(62, 'sds', 473, NULL, 3, '2018-01-14 17:48:59', '2018-01-14 17:48:59', '473'),
(63, 'sf', 473, NULL, 3, '2018-01-14 17:49:07', '2018-01-14 17:49:07', '473'),
(64, 'sc2', 473, NULL, 3, '2018-01-14 17:50:37', '2018-01-14 17:50:42', '473'),
(65, 'fsf', 473, NULL, 3, '2018-01-14 17:50:46', '2018-01-14 17:50:46', '473'),
(66, 'sfs', 473, NULL, 3, '2018-01-14 17:50:48', '2018-01-14 17:50:48', '473'),
(74, '/mac/biocore/nextflowruns/trial1/data/ggal/ggal_1_48850000_49020000.Ggal71.500bpflank.fa', 473, NULL, 3, '2018-01-16 19:50:15', '2018-01-16 19:50:15', '473'),
(75, '/mac/biocore/nextflowruns/trial1/data/ggal/ggal_1_48850000_49020000.Ggal71.500bpflank.fa', 473, NULL, 3, '2018-01-17 18:22:32', '2018-01-17 18:22:32', '473'),
(76, 'pair', 473, NULL, 3, '2018-01-17 18:22:43', '2018-01-17 18:22:43', '473'),
(77, '/mac/biocore/nextflowruns/trial1/data/ggal/*_{1,2}.fq', 473, NULL, 3, '2018-01-17 18:27:32', '2018-01-17 18:27:47', '473'),
(78, '/mac/biocore/nextflowruns/trial1/data/ggal/ggal_1_48850000_49020000.Ggal71.500bpflank.fa', 473, NULL, 3, '2018-01-17 18:32:25', '2018-01-17 18:32:25', '473'),
(79, 'pair', 473, NULL, 3, '2018-01-17 18:32:31', '2018-01-17 18:32:31', '473'),
(80, '/mac/biocore/nextflowruns/trial1/data/ggal/*_{1,2}.fq', 473, NULL, 3, '2018-01-17 18:32:38', '2018-01-17 18:32:38', '473'),
(83, '/share/data/umw_biocore/genome_data/mousetest/mm10/commondb/rRNA/rRNA.fasta', 473, NULL, 3, '2018-01-25 20:16:07', '2018-01-25 20:16:07', '473'),
(93, 'ssss', 473, NULL, 3, '2018-01-26 15:03:30', '2018-01-26 15:03:30', '473');

-- --------------------------------------------------------

--
-- Table structure for table `parameter`
--

CREATE TABLE IF NOT EXISTS `parameter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `file_type` varchar(256) DEFAULT NULL,
  `version` varchar(256) DEFAULT NULL,
  `qualifier` varchar(256) DEFAULT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=65 ;

--
-- Dumping data for table `parameter`
--

INSERT INTO `parameter` (`id`, `name`, `file_type`, `version`, `qualifier`, `owner_id`, `group_id`, `perms`, `date_created`, `date_modified`, `last_modified_user`) VALUES
(9, 'genome', 'fasta', '1', 'file', 473, NULL, 63, NULL, NULL, NULL),
(10, 'genome_index', 'index', '1', 'file', 473, NULL, 63, NULL, NULL, NULL),
(11, 'read_pairs', 'fq', '1', 'set', 473, NULL, 63, NULL, NULL, NULL),
(13, 'mapped_read_pairs', 'bam', '1', 'file', 473, NULL, 63, NULL, NULL, NULL),
(14, 'transcripts', 'gtf', '1', 'set', 473, NULL, 63, NULL, NULL, NULL),
(15, 'RSeQC', 'tsv', '1.0.0', 'file', 473, NULL, 63, NULL, NULL, NULL),
(16, 'sam_files', 'sam', '1', 'file', 473, NULL, 63, NULL, NULL, NULL),
(17, 'unmapped_reads', 'bam', '1', 'file', 473, NULL, 63, NULL, NULL, NULL),
(18, 'end', 'end', '', 'val', 473, NULL, 63, NULL, NULL, NULL),
(19, 'www', 'edd', NULL, 'file', 473, NULL, 63, NULL, NULL, NULL),
(20, 'dad', 'ad', NULL, 'file', NULL, NULL, 63, NULL, NULL, NULL),
(21, 'adad', 'ada', NULL, 'file', NULL, NULL, 63, NULL, NULL, NULL),
(22, 'adad', 'afaf', NULL, 'file', NULL, NULL, 63, NULL, NULL, NULL),
(23, '123', 'asd', NULL, 'file', NULL, NULL, 63, NULL, NULL, NULL),
(24, 'res', 'res', NULL, 'file', NULL, NULL, 63, NULL, NULL, NULL),
(25, 'yuu', 'te', NULL, 'file', NULL, NULL, 63, NULL, NULL, NULL),
(26, 'err', 'ret', NULL, 'file', NULL, NULL, 63, NULL, NULL, NULL),
(28, '4444', 'sdfsf', NULL, 'file', NULL, NULL, 63, NULL, NULL, NULL),
(29, 'ulu2', 'adadad', NULL, 'file', NULL, NULL, 63, NULL, NULL, '473'),
(31, 'fff', '35', NULL, 'file', NULL, NULL, 63, NULL, NULL, NULL),
(32, '3456', '24', NULL, 'file', NULL, NULL, 63, NULL, NULL, NULL),
(33, 'opl', 'kbj', NULL, 'file', NULL, NULL, 63, NULL, NULL, NULL),
(34, '45646', '456', NULL, 'file', NULL, NULL, 63, NULL, NULL, NULL),
(35, 'rrr2', 'rrr', NULL, 'file', NULL, NULL, 63, NULL, NULL, NULL),
(36, 'sdfsfsf', 'sfsf', NULL, 'file', NULL, NULL, 63, NULL, NULL, NULL),
(45, 'aaa', 'asd', NULL, 'file', NULL, NULL, 63, NULL, NULL, NULL),
(46, 'whata', 'fw', NULL, 'file', NULL, NULL, 63, NULL, NULL, NULL),
(51, 'yeni2', 'ddd', NULL, 'set', NULL, NULL, 63, '2017-12-18 15:25:06', '2017-12-18 15:25:06', NULL),
(56, 'hede2', 'ddd', NULL, 'file', NULL, NULL, 63, '2017-12-18 16:11:37', '2017-12-18 16:11:37', 'root'),
(59, 'hede234', 'ddd', NULL, 'file', NULL, NULL, 63, '2017-12-21 17:04:15', '2017-12-21 17:04:15', 'root'),
(60, 'wfw', 'wfwf', NULL, 'file', NULL, NULL, 63, '2017-12-30 20:11:08', '2017-12-30 20:11:08', 'root'),
(61, 'svsv', 'svsvsv', NULL, 'file', NULL, NULL, 63, '2018-01-02 15:16:25', '2018-01-02 15:16:25', 'root'),
(62, 'adadadasdasd2', 'adadad', NULL, 'file', 473, NULL, 63, '2018-01-02 15:26:40', '2018-01-02 15:26:40', 'root'),
(63, 'qwee', 'sss', NULL, 'file', 473, NULL, 63, '2018-01-02 20:05:50', '2018-01-02 20:05:50', 'root'),
(64, 'mate', 'mate', NULL, 'val', 473, NULL, 63, '2018-01-16 19:45:11', '2018-01-16 19:45:11', '473');

-- --------------------------------------------------------

--
-- Table structure for table `perms`
--

CREATE TABLE IF NOT EXISTS `perms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `perms_name` varchar(45) DEFAULT NULL,
  `perms_var` varchar(45) DEFAULT NULL,
  `value` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `val` (`value`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `perms`
--

INSERT INTO `perms` (`id`, `perms_name`, `perms_var`, `value`) VALUES
(1, 'Only me', 'only_me', 3),
(2, 'Only my groups', 'only_my_groups', 15),
(3, 'Everyone', 'everyone', 63);

-- --------------------------------------------------------

--
-- Table structure for table `process`
--

CREATE TABLE IF NOT EXISTS `process` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `process_group_id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `version` varchar(256) DEFAULT NULL,
  `summary` varchar(255) NOT NULL,
  `script` text,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  `rev_id` int(11) NOT NULL,
  `rev_comment` varchar(20) NOT NULL,
  `process_gid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=149 ;

--
-- Dumping data for table `process`
--

INSERT INTO `process` (`id`, `process_group_id`, `name`, `version`, `summary`, `script`, `owner_id`, `group_id`, `perms`, `date_created`, `date_modified`, `last_modified_user`, `rev_id`, `rev_comment`, `process_gid`) VALUES
(10, 1, 'Build_Index', '', '', '&quot;bowtie2-build ${genome} genome.index&quot;', 473, NULL, 63, NULL, NULL, 'root', 0, '', 1),
(11, 2, 'Map_Tophat2', '', 'TopHat is a program that aligns RNA-Seq reads to a genome in order to identify exon-exon splice junctions. It is built on the ultrafast short read mapping program Bowtie. TopHat runs on Linux and OS X.', '&quot;script:\r\n  if ( end == &quot;pair&quot; ) {\r\n      &quot;&quot;&quot;\r\n      tophat2 -o . genome.index $reads \r\n      mv accepted_hits.bam ${name}.bam\r\n      mv unmapped.bam ${name}_unmapped.bam\r\n      &quot;&quot;&quot;\r\n} \r\n    else if  ( end == &quot;single&quot; ){\r\n      &quot;&quot;&quot;\r\n      tophat2 -o . genome.index $reads\r\n      mv accepted_hits.bam ${name}.bam\r\n      mv unmapped.bam ${name}_unmapped.bam\r\n      &quot;&quot;&quot;\r\n}&quot;', 1, NULL, 63, NULL, NULL, 'root', 0, '', 2),
(12, 3, 'Make_Transcript', '1', 'Cufflinks assembles transcripts, estimates their abundances, and tests for differential expression and regulation in RNA-Seq samples. It accepts aligned RNA-Seq reads and assembles the alignments into a parsimonious set of transcripts.', 'cufflinks ${bam_file}', 1, NULL, 63, NULL, NULL, NULL, 0, '', 3),
(16, 4, 'samtools_sort', '0.1.19', 'Samtools sort functionality.', 'samtools sort ${initial_alignment} ${sorted_bam}\r\n', 1, NULL, 63, NULL, NULL, NULL, 0, '', 4),
(17, 5, 'splitSequences', '0.0.1', 'Module to split your fastq files. \nYou can specify the number of reads per file.', '', 1, NULL, 63, NULL, NULL, NULL, 0, '', 5),
(18, 2, 'Map_Bowtie', '0.0.1', '', '&quot;script: if( end == &quot;pair&quot; ) \n{ &quot;&quot;&quot; bowtie2 -x genome.index -1 ${reads.join(&#039; -2 &#039;)} -S ${name}_alignment.sam samtools view -bS ${name}_alignment.sam &gt; ${name}_alignment.bam samtools sort ${name}_alignment.bam -f ${name}_sorted_alignment.bam &quot;&quot;&quot; } else { &quot;&quot;&quot; bowtie2 -x genome.index -U $reads -S ${name}_alignment.sam samtools view -bS ${name}_alignment.sam &gt; ${name}_alignment.bam samtools sort ${name}_alignment.bam -f ${name}_sorted_alignment.bam &quot;&quot;&quot; }&quot;', 473, NULL, 63, NULL, NULL, '473', 0, '', 6),
(19, 6, 'RSeQC', '1.0.0', '', 'rseqc ${bam_file}', 1, NULL, 63, NULL, NULL, NULL, 0, '', 7),
(58, 3, 'Make_Transcript', '1', 'Cufflinks assembles transcripts, estimates their abundances, and tests for differential expression and regulation in RNA-Seq samples. It accepts aligned RNA-Seq reads and assembles the alignments into a parsimonious set of transcripts.', 'cufflinks ${bam_file}', 473, NULL, 63, NULL, NULL, NULL, 1, 'output changed', 3),
(59, 2, 'Map_Bowtie', '0.0.1', '', 'script: if( end == &quot;pair&quot; ) \r\n{ &quot;&quot;&quot; bowtie2 -x genome.index -1 ${reads.join(&#039; -2 &#039;)} -S ${name}_alignment.sam samtools view -bS ${name}_alignment.sam &gt; ${name}_alignment.bam samtools sort ${name}_alignment.bam -f ${name}_sorted_alignment.bam &quot;&quot;&quot; } else { &quot;&quot;&quot; bowtie2 -x genome.index -U $reads -S ${name}_alignment.sam samtools view -bS ${name}_alignment.sam &gt; ${name}_alignment.bam samtools sort ${name}_alignment.bam -f ${name}_sorted_alignment.bam &quot;&quot;&quot; }', 1, NULL, 63, NULL, NULL, NULL, 1, 'cccc', 6),
(60, 2, 'Map_Bowtie', '0.0.1', 'ff', '&quot;script: if( end == &quot;pair&quot; ) \r\n{ &quot;&quot;&quot; bowtie2 -x genome.index -1 ${reads.join(&#039; -2 &#039;)} -S ${name}_alignment.sam samtools view -bS ${name}_alignment.sam &gt; ${name}_alignment.bam samtools sort ${name}_alignment.bam -f ${name}_sorted_alignment.bam &quot;&quot;&quot; } else { &quot;&quot;&quot; bowtie2 -x genome.index -U $reads -S ${name}_alignment.sam samtools view -bS ${name}_alignment.sam &gt; ${name}_alignment.bam samtools sort ${name}_alignment.bam -f ${name}_sorted_alignment.bam &quot;&quot;&quot; }&quot;', 473, NULL, 63, NULL, NULL, '473', 2, 'tree', 6),
(121, 11, 'deneme1', NULL, 'ddd', '&quot;//groovy example: \n\n bowtie2-build ${genome} genome.index&quot;', NULL, NULL, 3, '2017-12-30 07:00:13', '2017-12-30 07:00:13', 'root', 4, 'werw', 8),
(123, 11, 'asfafd', NULL, 'dv', '&quot;//groovy example: \n\n bowtie2-build ${genome} genome.index&quot;', NULL, NULL, 3, '2017-12-30 20:53:18', '2017-12-30 20:53:18', 'root', 3, 'sfsf', 9),
(124, 11, 'asfafd', NULL, 'dv', '&quot;//groovy example: \n\n bowtie2-build ${genome} genome.index&quot;', NULL, NULL, 3, '2017-12-30 20:53:42', '2017-12-30 20:53:42', 'root', 4, 'sfsf', 9),
(126, 11, 'ffsd', NULL, 'sdfs', '&quot;//groovy example: \n\n bowtie2-build ${genome} genome.index&quot;', NULL, NULL, 3, '2017-12-31 21:14:50', '2017-12-31 21:14:50', 'root', 0, '', 10),
(127, 11, 'ffsd', NULL, 'sdfs', '&quot;//groovy example: \n\n bowtie2-build ${genome} genome.index&quot;', NULL, NULL, 3, '2017-12-31 21:15:09', '2017-12-31 21:15:09', 'root', 1, 'sfs', 10),
(128, 11, 'ffsd', NULL, 'sdfs', '&quot;//groovy example: \n\n bowtie2-build ${genome} genome.index&quot;', NULL, NULL, 3, '2017-12-31 21:16:33', '2017-12-31 21:16:33', 'root', 2, 'gege', 10),
(129, 6, 'sgsg', NULL, 'dgd', '&quot;//groovy example: \n\n bowtie2-build ${genome} genome.index&quot;', NULL, NULL, 3, '2018-01-02 06:48:19', '2018-01-02 06:48:19', 'root', 0, '', 11),
(130, 1, 'dada', NULL, '', '&quot;//groovy example: \n\n bowtie2-build ${genome} genome.index&quot;', NULL, NULL, 3, '2018-01-02 15:14:17', '2018-01-02 15:14:17', 'root', 0, '', 12),
(131, 2, 'vsvv', NULL, '', '&quot;//groovy example: \n\n bowtie2-build ${genome} genome.index&quot;', NULL, NULL, 3, '2018-01-02 15:16:31', '2018-01-02 15:16:31', 'root', 0, '', 13),
(132, 1, 'addad', NULL, '', '&quot;//groovy example: \n\n bowtie2-build ${genome} genome.index&quot;', 473, NULL, 3, '2018-01-02 15:26:49', '2018-01-02 15:26:49', 'root', 0, '', 14),
(134, 1, 'hede', NULL, 'adddadd', '&quot;//groovy example: \n\n bowtie2-build ${genome} genome.index&quot;', 473, NULL, 3, '2018-01-02 16:03:37', '2018-01-02 16:03:37', 'root', 0, '', 15),
(137, 11, 'troy', NULL, '', '&quot;//groovy example: \n\n bowtie2-build ${genome} genome.index&quot;', 473, NULL, 3, '2018-01-02 20:28:34', '2018-01-02 20:28:34', '473', 0, '', 16),
(138, 8, 'dna', NULL, '', '&quot;//groovy example: \n\n bowtie2-build ${genome} genome.index&quot;', 473, NULL, 3, '2018-01-02 20:43:51', '2018-01-02 20:43:51', '473', 0, '', 17),
(142, 0, 'adad', NULL, '', NULL, 473, NULL, 3, '2018-01-05 00:59:21', '2018-01-05 00:59:21', '473', 0, '', 0),
(143, 0, 'adad', NULL, '', NULL, 473, NULL, 3, '2018-01-05 01:00:44', '2018-01-05 01:00:44', '473', 0, '', 0),
(144, 0, 'ada', NULL, '', NULL, 473, NULL, 3, '2018-01-05 01:02:36', '2018-01-05 01:02:36', '473', 0, '', 0),
(147, 11, 'troy', NULL, '', '&quot;//groovy example: \n\n bowtie2-build ${genome} genome.index&quot;', 473, NULL, 3, '2018-01-09 18:24:47', '2018-01-09 18:24:47', '473', 1, 'sfgsf', 16),
(148, 2, 'Map_Tophat2', NULL, 'TopHat is a program that aligns RNA-Seq reads to a genome in order to identify exon-exon splice junctions. It is built on the ultrafast short read mapping program Bowtie. TopHat runs on Linux and OS X.', '&quot;script:\r\n  if ( mate == &quot;pair&quot; ) {\r\n      &quot;&quot;&quot;\r\n      tophat2 -o . genome.index $reads \r\n      mv accepted_hits.bam ${name}.bam\r\n      mv unmapped.bam ${name}_unmapped.bam\r\n      &quot;&quot;&quot;\r\n} \r\n    else if  ( mate == &quot;single&quot; ){\r\n      &quot;&quot;&quot;\r\n      tophat2 -o . genome.index $reads\r\n      mv accepted_hits.bam ${name}.bam\r\n      mv unmapped.bam ${name}_unmapped.bam\r\n      &quot;&quot;&quot;\r\n}&quot;', 473, NULL, 63, '2018-01-16 19:45:40', '2018-01-16 19:45:40', '473', 1, 'mate', 2);

-- --------------------------------------------------------

--
-- Table structure for table `process_group`
--

CREATE TABLE IF NOT EXISTS `process_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_name` varchar(100) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

--
-- Dumping data for table `process_group`
--

INSERT INTO `process_group` (`id`, `group_name`, `owner_id`, `group_id`, `perms`, `date_created`, `date_modified`, `last_modified_user`) VALUES
(1, 'Index', NULL, NULL, 63, NULL, NULL, NULL),
(2, 'Alignment', NULL, NULL, 63, NULL, NULL, NULL),
(4, 'Samtools', NULL, NULL, 63, NULL, NULL, NULL),
(5, 'Misc.', NULL, NULL, 63, NULL, NULL, NULL),
(6, 'QC', NULL, NULL, 63, NULL, NULL, NULL),
(8, 'deneme', 473, NULL, 3, '2017-12-12 21:16:07', '2017-12-12 21:16:07', '473'),
(11, 'dron', 473, NULL, 3, '2017-12-18 16:11:17', '2017-12-18 16:11:17', '473');

-- --------------------------------------------------------

--
-- Table structure for table `process_parameter`
--

CREATE TABLE IF NOT EXISTS `process_parameter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `process_id` int(11) NOT NULL,
  `parameter_id` int(11) NOT NULL,
  `type` varchar(10) NOT NULL,
  `name` varchar(256) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `process_id` (`process_id`),
  KEY `parameter_id` (`parameter_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=308 ;

--
-- Dumping data for table `process_parameter`
--

INSERT INTO `process_parameter` (`id`, `process_id`, `parameter_id`, `type`, `name`, `owner_id`, `group_id`, `perms`, `date_created`, `date_modified`, `last_modified_user`) VALUES
(19, 10, 9, 'input', 'genome', 473, NULL, 63, NULL, NULL, 'root'),
(20, 10, 10, 'output', '''genome.index*''', 473, NULL, 63, NULL, NULL, NULL),
(21, 11, 9, 'input', 'genome', 473, NULL, 63, NULL, NULL, 'root'),
(22, 11, 10, 'input', 'index', 473, NULL, 63, NULL, NULL, 'root'),
(23, 11, 11, 'input', 'val(name), file(reads)', 473, NULL, 63, NULL, NULL, 'root'),
(24, 11, 13, 'output', '"${name}.bam"', 473, NULL, 63, NULL, NULL, 'root'),
(25, 12, 13, 'input', 'bam_file', 473, NULL, 63, NULL, NULL, NULL),
(26, 12, 14, 'output', '''transcripts.gtf''', 473, NULL, 63, NULL, NULL, NULL),
(29, 16, 13, 'input', 'initial_alignment', 473, NULL, 63, NULL, NULL, NULL),
(35, 18, 11, 'input', 'dd', 473, NULL, 63, NULL, NULL, '473'),
(36, 17, 11, 'input', 'initial_seq', 473, NULL, 63, NULL, NULL, NULL),
(37, 17, 11, 'output', 'splited_seq', 473, NULL, 63, NULL, NULL, NULL),
(40, 16, 13, 'output', 'sorted_bam', NULL, NULL, 63, NULL, NULL, NULL),
(41, 18, 13, 'output', 'tophat_bam', 473, NULL, 63, NULL, NULL, '473'),
(42, 19, 13, 'input', 'bam', NULL, NULL, 63, NULL, NULL, NULL),
(43, 19, 15, 'output', 'RSeQC_table', NULL, NULL, 63, NULL, NULL, NULL),
(44, 18, 11, 'input', 'val(name), file(reads)', 473, NULL, 63, NULL, NULL, '473'),
(45, 18, 10, 'input', 'index', 473, NULL, 63, NULL, NULL, '473'),
(46, 18, 13, 'output', '"${name}_sorted_alignment.bam"', 473, NULL, 63, NULL, NULL, '473'),
(47, 18, 16, 'output', '"${name}_alignment.sam"', 473, NULL, 63, NULL, NULL, '473'),
(49, 11, 17, 'output', '"${name}_unmapped.bam"', 473, NULL, 63, NULL, NULL, 'root'),
(51, 11, 18, 'input', 'end', 473, NULL, 63, NULL, NULL, 'root'),
(227, 121, 9, 'output', 'troythth', NULL, NULL, 63, '2017-12-30 07:00:13', '2017-12-30 07:00:13', 'root'),
(228, 121, 10, 'input', 'toy123344thh', NULL, NULL, 63, '2017-12-30 07:00:13', '2017-12-30 07:00:13', 'root'),
(232, 121, 10, 'input', 'adda', NULL, NULL, 63, '2017-12-30 20:51:56', '2017-12-30 20:51:56', 'root'),
(233, 123, 10, 'input', 'sfsf', NULL, NULL, 63, '2017-12-30 20:53:18', '2017-12-30 20:53:18', 'root'),
(234, 123, 10, 'input', 'wr', NULL, NULL, 63, '2017-12-30 20:53:18', '2017-12-30 20:53:18', 'root'),
(235, 123, 11, 'output', 'wr', NULL, NULL, 63, '2017-12-30 20:53:18', '2017-12-30 20:53:18', 'root'),
(236, 124, 10, 'input', 'sfsf', NULL, NULL, 63, '2017-12-30 20:53:42', '2017-12-30 20:53:42', 'root'),
(237, 124, 11, 'output', 'wr', NULL, NULL, 63, '2017-12-30 20:53:42', '2017-12-30 20:53:42', 'root'),
(238, 124, 10, 'input', 'wr', NULL, NULL, 63, '2017-12-30 20:53:42', '2017-12-30 20:53:42', 'root'),
(241, 126, 11, 'output', 'sfsf', NULL, NULL, 63, '2017-12-31 21:14:50', '2017-12-31 21:14:50', 'root'),
(242, 126, 10, 'input', 'sfsf', NULL, NULL, 63, '2017-12-31 21:14:50', '2017-12-31 21:14:50', 'root'),
(248, 130, 9, 'input', 'ada', NULL, NULL, 63, '2018-01-02 15:14:17', '2018-01-02 15:14:17', 'root'),
(249, 130, 9, 'output', 'adad', NULL, NULL, 63, '2018-01-02 15:14:17', '2018-01-02 15:14:17', 'root'),
(250, 131, 61, 'input', 'svsv', NULL, NULL, 63, '2018-01-02 15:16:31', '2018-01-02 15:16:31', 'root'),
(251, 131, 9, 'output', 'svsv', NULL, NULL, 63, '2018-01-02 15:16:31', '2018-01-02 15:16:31', 'root'),
(252, 132, 62, 'input', 'adad', NULL, NULL, 63, '2018-01-02 15:26:49', '2018-01-02 15:26:49', 'root'),
(253, 132, 62, 'output', 'adasdasdasd', NULL, NULL, 63, '2018-01-02 15:26:49', '2018-01-02 15:26:49', 'root'),
(254, 132, 9, 'output', 'asdasdvvv', NULL, NULL, 63, '2018-01-02 15:26:49', '2018-01-02 15:26:49', 'root'),
(255, 132, 9, 'input', 'adad', NULL, NULL, 63, '2018-01-02 15:26:49', '2018-01-02 15:26:49', 'root'),
(258, 134, 62, 'input', 'adad', NULL, NULL, 63, '2018-01-02 16:03:37', '2018-01-02 16:03:37', 'root'),
(259, 134, 9, 'output', 'adad', NULL, NULL, 63, '2018-01-02 16:03:37', '2018-01-02 16:03:37', 'root'),
(267, 137, 10, 'input', 'dggd', 473, NULL, 3, '2018-01-02 20:28:34', '2018-01-02 20:28:34', '473'),
(268, 137, 11, 'output', 'dgdg', 473, NULL, 3, '2018-01-02 20:28:34', '2018-01-02 20:28:34', '473'),
(269, 138, 9, 'input', 'ada', 473, NULL, 3, '2018-01-02 20:43:51', '2018-01-02 20:43:51', '473'),
(270, 138, 29, 'output', 'adad', 473, NULL, 3, '2018-01-02 20:43:51', '2018-01-02 20:43:51', '473'),
(299, 147, 10, 'input', 'dggd', 473, NULL, 3, '2018-01-09 18:24:47', '2018-01-09 18:24:47', '473'),
(300, 147, 11, 'output', 'dgdg', 473, NULL, 3, '2018-01-09 18:24:47', '2018-01-09 18:24:47', '473'),
(301, 147, 10, 'input', 'fssf', 473, NULL, 3, '2018-01-09 18:24:47', '2018-01-09 18:24:47', '473'),
(302, 148, 9, 'input', 'genome', 473, NULL, 3, '2018-01-16 19:45:40', '2018-01-16 19:45:40', '473'),
(303, 148, 11, 'input', 'val(name), file(reads)', 473, NULL, 3, '2018-01-16 19:45:40', '2018-01-16 19:45:40', '473'),
(304, 148, 13, 'output', '"${name}.bam"', 473, NULL, 3, '2018-01-16 19:45:40', '2018-01-16 19:45:40', '473'),
(305, 148, 10, 'input', 'index', 473, NULL, 3, '2018-01-16 19:45:40', '2018-01-16 19:45:40', '473'),
(306, 148, 17, 'output', '"${name}_unmapped.bam"', 473, NULL, 3, '2018-01-16 19:45:40', '2018-01-16 19:45:40', '473'),
(307, 148, 64, 'input', 'mate', 473, NULL, 3, '2018-01-16 19:45:40', '2018-01-16 19:45:40', '473');

-- --------------------------------------------------------

--
-- Table structure for table `profile_amazon`
--

CREATE TABLE IF NOT EXISTS `profile_amazon` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `next_path` varchar(256) NOT NULL,
  `default_region` varchar(256) NOT NULL,
  `access_key` varchar(256) NOT NULL,
  `success_key` varchar(256) NOT NULL,
  `instance_type` varchar(256) NOT NULL,
  `image_id` varchar(256) NOT NULL,
  `executor` varchar(25) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `profile_cluster`
--

CREATE TABLE IF NOT EXISTS `profile_cluster` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `username` varchar(256) NOT NULL,
  `hostname` varchar(256) NOT NULL,
  `next_path` varchar(256) NOT NULL,
  `executor` varchar(25) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=26 ;

--
-- Dumping data for table `profile_cluster`
--

INSERT INTO `profile_cluster` (`id`, `name`, `username`, `hostname`, `next_path`, `executor`, `owner_id`, `perms`, `date_created`, `date_modified`, `last_modified_user`) VALUES
(25, 'deneme', 'oy28w', 'ghpcc06.umassrc.org', '/project/umw_biocore/bin', 'none', 473, 3, '2018-01-19 22:11:52', '2018-01-19 22:11:52', '473');

-- --------------------------------------------------------

--
-- Table structure for table `profile_local`
--

CREATE TABLE IF NOT EXISTS `profile_local` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `next_path` varchar(256) NOT NULL,
  `executor` varchar(25) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE IF NOT EXISTS `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  `summary` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=62 ;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`id`, `name`, `owner_id`, `group_id`, `perms`, `date_created`, `date_modified`, `last_modified_user`, `summary`) VALUES
(35, 'tureng2', 461, NULL, 3, '2018-01-05 02:37:07', '2018-01-05 03:25:11', '461', ''),
(36, 'sssa', 461, NULL, 3, '2018-01-05 03:25:17', '2018-01-05 03:25:17', '461', ''),
(47, 'Chip-Seq', 473, NULL, 3, '2018-01-05 21:25:51', '2018-01-10 15:04:58', '473', 'ChIP-sequencing, also known as ChIP-seq, is a method used to analyze protein interactions with DNA. Mapping the chromosomal locations of transcription factors, nucleosomes, histone modifications, chromatin remodeling enzymes, chaperones, and polymerases is one of the key tasks of modern biology, as evidenced by the Encyclopedia of DNA Elements. \n\nBy combining chromatin immunoprecipitation (ChIP) assays with sequencing, ChIP-sequencing (ChIP-Seq) is a powerful method for identifying genome-wide DNA binding sites for transcription factors and other proteins. Following ChIP protocols, DNA-bound protein is immunoprecipitated using a specific antibody. \n\nThe bound DNA is then co-precipitated, purified, and sequenced. It can be used to map global binding sites precisely for any protein of interest'),
(55, 'Single Cell', 473, NULL, 3, '2018-01-08 16:19:39', '2018-01-08 16:24:03', '473', ''),
(57, 'carcinoma', 473, NULL, 3, '2018-01-10 15:04:20', '2018-01-10 15:04:20', '473', ''),
(58, 'Yeni', 473, NULL, 3, '2018-01-11 15:55:55', '2018-01-11 15:55:55', '473', ''),
(59, 'new', 473, NULL, 3, '2018-01-11 16:16:22', '2018-01-11 16:16:22', '473', ''),
(61, 'Inputs2', 473, NULL, 3, '2018-01-14 04:08:05', '2018-01-14 04:08:33', '473', 'adada');

-- --------------------------------------------------------

--
-- Table structure for table `project_input`
--

CREATE TABLE IF NOT EXISTS `project_input` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `input_id` int(11) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `input_id` (`input_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=94 ;

--
-- Dumping data for table `project_input`
--

INSERT INTO `project_input` (`id`, `project_id`, `input_id`, `owner_id`, `group_id`, `perms`, `date_created`, `date_modified`, `last_modified_user`) VALUES
(35, 61, 35, 473, NULL, 3, '2018-01-14 15:36:31', '2018-01-14 15:36:31', '473'),
(36, 61, 36, 473, NULL, 3, '2018-01-14 16:22:56', '2018-01-14 16:22:56', '473'),
(37, 61, 37, 473, NULL, 3, '2018-01-14 16:44:44', '2018-01-14 16:44:44', '473'),
(38, 61, 38, 473, NULL, 3, '2018-01-14 16:45:31', '2018-01-14 16:45:31', '473'),
(39, 61, 39, 473, NULL, 3, '2018-01-14 16:49:50', '2018-01-14 16:49:50', '473'),
(40, 61, 40, 473, NULL, 3, '2018-01-14 16:52:17', '2018-01-14 16:52:17', '473'),
(41, 61, 41, 473, NULL, 3, '2018-01-14 16:52:28', '2018-01-14 16:52:28', '473'),
(42, 61, 42, 473, NULL, 3, '2018-01-14 16:54:03', '2018-01-14 16:54:03', '473'),
(43, 61, 43, 473, NULL, 3, '2018-01-14 16:54:07', '2018-01-14 16:54:07', '473'),
(44, 61, 44, 473, NULL, 3, '2018-01-14 16:54:13', '2018-01-14 16:54:13', '473'),
(45, 61, 45, 473, NULL, 3, '2018-01-14 16:54:15', '2018-01-14 16:54:15', '473'),
(46, 61, 46, 473, NULL, 3, '2018-01-14 16:54:26', '2018-01-14 16:54:26', '473'),
(47, 61, 47, 473, NULL, 3, '2018-01-14 17:05:07', '2018-01-14 17:05:07', '473'),
(48, 61, 48, 473, NULL, 3, '2018-01-14 17:05:11', '2018-01-14 17:05:11', '473'),
(49, 61, 49, 473, NULL, 3, '2018-01-14 17:05:14', '2018-01-14 17:05:14', '473'),
(50, 61, 50, 473, NULL, 3, '2018-01-14 17:14:48', '2018-01-14 17:14:48', '473'),
(51, 61, 51, 473, NULL, 3, '2018-01-14 17:25:55', '2018-01-14 17:25:55', '473'),
(52, 61, 52, 473, NULL, 3, '2018-01-14 17:26:36', '2018-01-14 17:26:36', '473'),
(53, 61, 53, 473, NULL, 3, '2018-01-14 17:28:00', '2018-01-14 17:28:00', '473'),
(54, 61, 54, 473, NULL, 3, '2018-01-14 17:29:00', '2018-01-14 17:29:00', '473'),
(55, 61, 55, 473, NULL, 3, '2018-01-14 17:32:08', '2018-01-14 17:32:08', '473'),
(56, 61, 56, 473, NULL, 3, '2018-01-14 17:34:32', '2018-01-14 17:34:32', '473'),
(57, 61, 57, 473, NULL, 3, '2018-01-14 17:35:55', '2018-01-14 17:35:55', '473'),
(58, 61, 58, 473, NULL, 3, '2018-01-14 17:36:51', '2018-01-14 17:36:51', '473'),
(59, 61, 59, 473, NULL, 3, '2018-01-14 17:46:06', '2018-01-14 17:46:06', '473'),
(60, 61, 60, 473, NULL, 3, '2018-01-14 17:46:10', '2018-01-14 17:46:10', '473'),
(61, 61, 61, 473, NULL, 3, '2018-01-14 17:48:56', '2018-01-14 17:48:56', '473'),
(62, 61, 62, 473, NULL, 3, '2018-01-14 17:48:59', '2018-01-14 17:48:59', '473'),
(63, 61, 63, 473, NULL, 3, '2018-01-14 17:49:07', '2018-01-14 17:49:07', '473'),
(64, 61, 64, 473, NULL, 3, '2018-01-14 17:50:37', '2018-01-14 17:50:37', '473'),
(65, 61, 65, 473, NULL, 3, '2018-01-14 17:50:46', '2018-01-14 17:50:46', '473'),
(66, 61, 66, 473, NULL, 3, '2018-01-14 17:50:48', '2018-01-14 17:50:48', '473'),
(74, 57, 74, 473, NULL, 3, '2018-01-16 19:50:15', '2018-01-16 19:50:15', '473'),
(75, 57, 75, 473, NULL, 3, '2018-01-17 18:22:32', '2018-01-17 18:22:32', '473'),
(76, 57, 76, 473, NULL, 3, '2018-01-17 18:22:43', '2018-01-17 18:22:43', '473'),
(77, 57, 77, 473, NULL, 3, '2018-01-17 18:27:32', '2018-01-17 18:27:32', '473'),
(78, 57, 78, 473, NULL, 3, '2018-01-17 18:32:25', '2018-01-17 18:32:25', '473'),
(79, 57, 79, 473, NULL, 3, '2018-01-17 18:32:31', '2018-01-17 18:32:31', '473'),
(80, 57, 80, 473, NULL, 3, '2018-01-17 18:32:38', '2018-01-17 18:32:38', '473'),
(83, 57, 83, 473, NULL, 3, '2018-01-25 20:16:07', '2018-01-25 20:16:07', '473'),
(93, 57, 93, 473, NULL, 3, '2018-01-26 15:03:30', '2018-01-26 15:03:30', '473');

-- --------------------------------------------------------

--
-- Table structure for table `project_pipeline`
--

CREATE TABLE IF NOT EXISTS `project_pipeline` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `summary` varchar(256) NOT NULL,
  `output_dir` varchar(256) NOT NULL,
  `profile` varchar(30) NOT NULL,
  `interdel` varchar(6) NOT NULL,
  `exec_each` varchar(6) NOT NULL,
  `exec_all` varchar(6) NOT NULL,
  `exec_all_settings` text NOT NULL,
  `exec_each_settings` text NOT NULL,
  `project_id` int(11) NOT NULL,
  `pipeline_id` int(11) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `pipeline_id` (`pipeline_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=209 ;

--
-- Dumping data for table `project_pipeline`
--

INSERT INTO `project_pipeline` (`id`, `name`, `summary`, `output_dir`, `profile`, `interdel`, `exec_each`, `exec_all`, `exec_all_settings`, `exec_each_settings`, `project_id`, `pipeline_id`, `owner_id`, `group_id`, `perms`, `date_created`, `date_modified`, `last_modified_user`) VALUES
(176, 'index+tophat', '', '', '', 'true', 'false', 'true', '[{"name":"queue","value":"long"},{"name":"memory","value":"10 GB"},{"name":"cpu","value":"2"}]', '[{"name":"queue","value":"long"},{"name":"memory","value":"10 GB"},{"name":"cpu","value":"2"},{"name":"queue","value":"long"},{"name":"memory","value":"10 GB"},{"name":"cpu","value":"2"}]', 57, 156, 473, 0, 3, '2018-01-17 18:32:10', '2018-01-25 00:34:42', '473'),
(178, '', '', '', '', '', '', '', '', '', 47, 131, 473, NULL, 3, '2018-01-20 17:59:06', '2018-01-20 17:59:06', '473'),
(185, '', '', '', '', '', '', '', '', '', 59, 157, 473, NULL, 3, '2018-01-23 15:12:15', '2018-01-23 15:12:15', '473'),
(186, '', '', '', '', '', '', '', '', '', 59, 157, 473, NULL, 3, '2018-01-23 15:12:33', '2018-01-23 15:12:33', '473'),
(188, '', '', '', '', '', '', '', '', '', 55, 157, 473, NULL, 3, '2018-01-23 15:15:13', '2018-01-23 15:15:13', '473'),
(189, 'tur', '', '', '', '', '', '', '', '', 61, 157, 473, NULL, 3, '2018-01-23 15:32:55', '2018-01-23 15:32:55', '473'),
(190, 'yenio', '', '', '', '', '', '', '', '', 59, 88, 473, NULL, 3, '2018-01-23 15:34:24', '2018-01-23 15:34:24', '473'),
(191, 'hepoo', '', '', '', '', '', '', '', '', 61, 88, 473, NULL, 3, '2018-01-23 15:35:30', '2018-01-23 15:35:30', '473'),
(192, 'yoda', '', '', '', '', '', '', '', '', 59, 88, 473, NULL, 3, '2018-01-23 15:37:54', '2018-01-23 15:37:54', '473'),
(197, 'ass', '', '', '', '', '', '', '', '', 47, 88, 473, NULL, 3, '2018-01-23 17:03:24', '2018-01-23 17:03:24', '473'),
(208, 'Build_Index', '', '', '', '', '', '', '', '', 57, 149, 473, NULL, 3, '2018-01-25 20:10:41', '2018-01-25 20:10:41', '473');

-- --------------------------------------------------------

--
-- Table structure for table `project_pipeline_input`
--

CREATE TABLE IF NOT EXISTS `project_pipeline_input` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `pipeline_id` int(11) NOT NULL,
  `input_id` int(11) NOT NULL,
  `project_pipeline_id` int(11) NOT NULL,
  `g_num` int(11) NOT NULL,
  `given_name` varchar(256) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  `qualifier` varchar(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `pipeline_id` (`pipeline_id`),
  KEY `input_id` (`input_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=82 ;

--
-- Dumping data for table `project_pipeline_input`
--

INSERT INTO `project_pipeline_input` (`id`, `project_id`, `pipeline_id`, `input_id`, `project_pipeline_id`, `g_num`, `given_name`, `owner_id`, `group_id`, `perms`, `date_created`, `date_modified`, `last_modified_user`, `qualifier`) VALUES
(76, 57, 156, 78, 176, 11, 'hg19', 473, NULL, 3, '2018-01-17 18:32:25', '2018-01-17 18:32:25', '473', 'file'),
(77, 57, 156, 79, 176, 17, 'mate', 473, NULL, 3, '2018-01-17 18:32:31', '2018-01-17 18:32:31', '473', 'val'),
(78, 57, 156, 80, 176, 18, 'gut_and_liver_readpairs', 473, NULL, 3, '2018-01-17 18:32:38', '2018-01-17 18:32:38', '473', 'set'),
(81, 57, 149, 83, 208, 0, 'genome', 473, NULL, 3, '2018-01-25 20:16:07', '2018-01-25 20:16:07', '473', 'file');

-- --------------------------------------------------------

--
-- Table structure for table `run`
--

CREATE TABLE IF NOT EXISTS `run` (
  `project_pipeline_id` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `run_status` int(11) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`project_pipeline_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `run`
--

INSERT INTO `run` (`project_pipeline_id`, `pid`, `run_status`, `owner_id`, `group_id`, `perms`, `date_created`, `date_modified`, `last_modified_user`) VALUES
(176, 374633, 0, 473, NULL, 3, '2018-01-25 16:09:50', '2018-01-25 17:00:35', '473'),
(198, 380488, 0, 473, NULL, 3, '2018-01-25 18:40:28', '2018-01-25 18:40:32', '473'),
(205, 379972, 0, 473, NULL, 3, '2018-01-25 00:14:07', '2018-01-25 18:34:14', '473'),
(208, 408329, 0, 473, NULL, 3, '2018-01-25 20:16:19', '2018-01-26 18:19:30', '473'),
(209, 0, 0, 473, NULL, 3, '2018-01-26 14:41:39', '2018-01-26 14:41:39', '473'),
(210, 407319, 0, 473, NULL, 3, '2018-01-26 14:44:58', '2018-01-26 14:53:03', '473'),
(211, 407321, 0, 473, NULL, 3, '2018-01-26 14:54:20', '2018-01-26 14:55:26', '473'),
(212, 407323, 0, 473, NULL, 3, '2018-01-26 14:56:47', '2018-01-26 14:59:36', '473'),
(213, 407325, 0, 473, NULL, 3, '2018-01-26 15:03:31', '2018-01-26 15:03:36', '473');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `clusteruser` varchar(45) DEFAULT NULL,
  `role` varchar(45) DEFAULT NULL,
  `name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `institute` varchar(45) NOT NULL,
  `lab` varchar(45) NOT NULL,
  `photo_loc` varchar(255) NOT NULL DEFAULT '/img/avatar5.png',
  `memberdate` datetime DEFAULT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `google_image` varchar(255) NOT NULL,
  `google_id` varchar(100) NOT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userind` (`username`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=474 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `clusteruser`, `role`, `name`, `email`, `institute`, `lab`, `photo_loc`, `memberdate`, `owner_id`, `group_id`, `perms`, `date_created`, `date_modified`, `google_image`, `google_id`, `last_modified_user`) VALUES
(473, 'onuryukselen', NULL, NULL, 'Onur YÃ¼kselen', 'onuryukselen@gmail.com', '', '', '/img/avatar5.png', '2017-12-31 18:39:35', NULL, NULL, NULL, '2017-12-31 18:39:35', '2017-12-31 18:39:35', 'https://lh4.googleusercontent.com/-h7_FO3k9sB4/AAAAAAAAAAI/AAAAAAAAAAA/AA6ZPT59P1VmY2tKX-25rnGsvEU3l-rEYg/s96-c/photo.jpg', '105130646152672654297', 'root'),
(461, 'biyonur', NULL, NULL, 'Onur Y', 'biyonur@gmail.com', '', '', '/img/avatar5.png', '2017-12-19 19:53:25', NULL, NULL, NULL, '2017-12-19 19:53:25', '2017-12-19 19:53:25', 'https://lh6.googleusercontent.com/-c0KPXuc1SNU/AAAAAAAAAAI/AAAAAAAAAAA/AA6ZPT4wp3UTVlgbLH2s_Fgcsdaeo93bOQ/s96-c/photo.jpg', '107206627002853865415', 'root');

-- --------------------------------------------------------

--
-- Table structure for table `user_group`
--

CREATE TABLE IF NOT EXISTS `user_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `u_id` int(11) DEFAULT NULL,
  `g_id` int(11) DEFAULT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user` (`u_id`) USING BTREE,
  KEY `group` (`g_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `process_parameter`
--
ALTER TABLE `process_parameter`
  ADD CONSTRAINT `process_parameter_ibfk_1` FOREIGN KEY (`process_id`) REFERENCES `process` (`id`),
  ADD CONSTRAINT `process_parameter_ibfk_2` FOREIGN KEY (`parameter_id`) REFERENCES `parameter` (`id`);

--
-- Constraints for table `project_input`
--
ALTER TABLE `project_input`
  ADD CONSTRAINT `project_input_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `project_input_ibfk_2` FOREIGN KEY (`input_id`) REFERENCES `input` (`id`);

--
-- Constraints for table `project_pipeline`
--
ALTER TABLE `project_pipeline`
  ADD CONSTRAINT `project_pipeline_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `project_pipeline_ibfk_2` FOREIGN KEY (`pipeline_id`) REFERENCES `biocorepipe_save` (`id`);

--
-- Constraints for table `project_pipeline_input`
--
ALTER TABLE `project_pipeline_input`
  ADD CONSTRAINT `project_pipeline_input_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `project_pipeline_input_ibfk_2` FOREIGN KEY (`input_id`) REFERENCES `input` (`id`),
  ADD CONSTRAINT `project_pipeline_input_ibfk_3` FOREIGN KEY (`pipeline_id`) REFERENCES `biocorepipe_save` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
