-- MySQL dump 10.13  Distrib 5.5.58, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: biocorepipe
-- ------------------------------------------------------
-- Server version	5.5.58-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `amazon_credentials`
--

DROP TABLE IF EXISTS `amazon_credentials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `amazon_credentials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `amz_acc_key` varchar(100) DEFAULT NULL,
  `amz_suc_key` varchar(100) DEFAULT NULL,
  `amz_def_reg` varchar(45) DEFAULT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `amazon_credentials`
--

LOCK TABLES `amazon_credentials` WRITE;
/*!40000 ALTER TABLE `amazon_credentials` DISABLE KEYS */;
/*!40000 ALTER TABLE `amazon_credentials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `biocorepipe_save`
--

DROP TABLE IF EXISTS `biocorepipe_save`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `biocorepipe_save` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `edges` text NOT NULL,
  `mainG` text NOT NULL,
  `nodes` text NOT NULL,
  `pin_order` int(5) DEFAULT NULL,
  `pin` varchar(6) DEFAULT NULL,
  `publish` int(2) NOT NULL,
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
  `summary` blob,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=161 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biocorepipe_save`
--

LOCK TABLES `biocorepipe_save` WRITE;
/*!40000 ALTER TABLE `biocorepipe_save` DISABLE KEYS */;
INSERT INTO `biocorepipe_save` VALUES (160,'{\'edges\':[\"o-149-0-71-0_i-150-1-71-1\",\"o-inPro-1-65-2_i-149-0-65-0\",\"o-inPro-1-67-3_i-149-1-67-0\",\"o-inPro-1-64-4_i-149-2-64-0\",\"o-inPro-1-64-4_i-150-0-64-1\",\"o-inPro-1-69-7_i-149-4-69-0\",\"o-inPro-1-11-6_i-149-5-11-0\",\"o-inPro-1-68-5_i-149-3-68-0\",\"i-outPro-1-11-8_o-149-1-11-0\",\"i-outPro-1-73-9_o-150-0-73-1\"]}','{\'mainG\':[171.52758789062,-7.3213710784912,0.59301716089249]}','{\"g-0\":[336.69860839844,283.60278320312,\"149\",\"Bowtie2_Filter\"],\"g-1\":[650.03277587891,231.97689819336,\"150\",\"parseBow\"],\"g-2\":[157.66667175293,50.666664123535,\"inPro\",\"species\"],\"g-3\":[75.666664123535,155.66667175293,\"inPro\",\"build\"],\"g-4\":[358.66665649414,48.666656494141,\"inPro\",\"mate\"],\"g-5\":[42.058574676514,374.09902954102,\"inPro\",\"share\"],\"g-6\":[270.78622436523,541.06036376953,\"inPro\",\"inputreads\"],\"g-7\":[160.43228149414,505.86749267578,\"inPro\",\"rna_set\"],\"g-8\":[516.23999023438,433.35690307617,\"outPro\",\"filteredReads\"],\"g-9\":[944.55810546875,247.86477661133,\"outPro\",\"bowtieSummary\"]}',1,'true',0,'RNAfilter',1,0,63,'2018-02-28 19:36:52','2018-02-28 20:29:09','1',0,'',20,'Filter out and quantify given sequence sets.\nIf this is is common RNA set, the common set value needs to be set to one of the commonRNA types. (ercc, rRNA, miRNA, tRNA, snRNA, snoRNA, rmsk).\nSample file needs to be defined like below;\n #    tab-delimited text file indicating biological replicate relationships.\n #                                        cond_A    cond_A_rep1    A_rep1_left.fq    A_rep1_right.fq\n #                                        cond_A    cond_A_rep2    A_rep2_left.fq    A_rep2_right.fq\n #                                        cond_B    cond_B_rep1    B_rep1_left.fq    B_rep1_right.fq\n #                                        cond_B    cond_B_rep2    B_rep2_left.fq    B_rep2_right.fq');
/*!40000 ALTER TABLE `biocorepipe_save` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(256) NOT NULL,
  `message` text NOT NULL,
  `url` varchar(256) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `input`
--

DROP TABLE IF EXISTS `input`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `input` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `input`
--

LOCK TABLES `input` WRITE;
/*!40000 ALTER TABLE `input` DISABLE KEYS */;
INSERT INTO `input` VALUES (94,'mousetest',1,NULL,3,'2018-02-28 19:40:07','2018-02-28 19:40:07','474'),(95,'mm10',1,NULL,3,'2018-02-28 19:40:12','2018-02-28 19:40:12','474'),(96,'pair',1,NULL,3,'2018-02-28 19:40:16','2018-02-28 19:40:16','474'),(97,'rRNA',1,NULL,3,'2018-02-28 19:40:22','2018-02-28 19:40:22','474'),(98,'/share/data/umw_biocore/genome_data/mousetest/mm10/dolphinnext/*.{1,2}.fastq',1,NULL,3,'2018-02-28 19:41:02','2018-02-28 19:41:02','474'),(99,' /share/data/umw_biocore/genome_data',1,NULL,3,'2018-02-28 19:41:11','2018-02-28 19:41:11','474'),(100,'NA',1,NULL,3,'2018-02-28 20:26:47','2018-02-28 20:26:47','1'),(101,'NA',1,NULL,3,'2018-02-28 20:26:47','2018-02-28 20:26:47','1'),(102,'mousetest',1,NULL,3,'2018-02-28 20:31:25','2018-02-28 20:31:25','1'),(103,'mm10',1,NULL,3,'2018-02-28 20:31:29','2018-02-28 20:31:29','1'),(104,'pair',1,NULL,3,'2018-02-28 20:31:35','2018-02-28 20:31:35','1'),(105,'rRNA',1,NULL,3,'2018-02-28 20:31:43','2018-02-28 20:31:43','1'),(106,'/export/genome_data/mousetest/mm10/fastqtest/*R{1,2}.fastq',1,NULL,3,'2018-02-28 20:32:13','2018-02-28 20:32:13','1'),(107,'/export/genome_data',1,NULL,3,'2018-02-28 20:32:20','2018-02-28 20:32:20','1'),(108,'NA',1,NULL,3,'2018-02-28 20:39:55','2018-02-28 20:39:55','1'),(109,'NA',1,NULL,3,'2018-02-28 20:39:55','2018-02-28 20:39:55','1'),(110,'/export/dolphinnext/test1/filteredReads/*.unmap*.fq',1,NULL,3,'2018-02-28 20:41:37','2018-02-28 20:41:37','1'),(111,'/export/dolphinnext/test1/bowtieSummary/*sum',1,NULL,3,'2018-02-28 20:41:37','2018-02-28 20:41:37','1'),(112,'NA',1,NULL,3,'2018-02-28 20:56:18','2018-02-28 20:56:18','1'),(113,'NA',1,NULL,3,'2018-02-28 20:56:18','2018-02-28 20:56:18','1'),(114,'NA',1,NULL,3,'2018-02-28 22:14:00','2018-02-28 22:14:00','1'),(115,'NA',1,NULL,3,'2018-02-28 22:14:01','2018-02-28 22:14:01','1'),(116,'NA',1,NULL,3,'2018-02-28 22:14:11','2018-02-28 22:14:11','1'),(117,'NA',1,NULL,3,'2018-02-28 22:14:11','2018-02-28 22:14:11','1'),(118,'NA',1,NULL,3,'2018-02-28 22:17:40','2018-02-28 22:17:40','1'),(119,'NA',1,NULL,3,'2018-02-28 22:17:40','2018-02-28 22:17:40','1'),(120,'NA',1,NULL,3,'2018-02-28 22:17:54','2018-02-28 22:17:54','1'),(121,'NA',1,NULL,3,'2018-02-28 22:17:54','2018-02-28 22:17:54','1'),(122,'NA',1,NULL,3,'2018-03-01 18:45:05','2018-03-01 18:45:05','1'),(123,'NA',1,NULL,3,'2018-03-01 18:45:05','2018-03-01 18:45:05','1');
/*!40000 ALTER TABLE `input` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parameter`
--

DROP TABLE IF EXISTS `parameter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `parameter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `file_type` varchar(256) DEFAULT NULL,
  `qualifier` varchar(256) DEFAULT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parameter`
--

LOCK TABLES `parameter` WRITE;
/*!40000 ALTER TABLE `parameter` DISABLE KEYS */;
INSERT INTO `parameter` VALUES (11,'read_pairs','fq','set',1,NULL,63,NULL,NULL,NULL),(64,'mate','mate','val',1,NULL,63,'2018-01-16 19:45:11','2018-01-16 19:45:11','473'),(65,'species','species','val',1,0,63,'2018-02-28 19:26:10','2018-02-28 19:51:48','474'),(67,'genome_build','genome_build','val',1,0,63,'2018-02-28 19:27:17','2018-02-28 19:51:48','474'),(68,'shared_genome_folder','shared_genome_folder','val',1,0,63,'2018-02-28 19:27:45','2018-02-28 19:51:48','474'),(69,'rna_set','rna_set','val',1,0,63,'2018-02-28 19:28:05','2018-02-28 19:51:48','474'),(71,'bowfiles','bow','set',1,0,63,'2018-02-28 19:29:23','2018-02-28 19:51:48','474'),(72,'bowfiles','val(name), file(bowfile)','set',1,NULL,3,'2018-02-28 19:31:26','2018-02-28 19:31:26','474'),(73,'bowout','sum','file',1,0,63,'2018-02-28 19:34:34','2018-02-28 19:51:48','474');
/*!40000 ALTER TABLE `parameter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perms`
--

DROP TABLE IF EXISTS `perms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `perms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `perms_name` varchar(45) DEFAULT NULL,
  `perms_var` varchar(45) DEFAULT NULL,
  `value` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `val` (`value`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perms`
--

LOCK TABLES `perms` WRITE;
/*!40000 ALTER TABLE `perms` DISABLE KEYS */;
INSERT INTO `perms` VALUES (1,'Only me','only_me',3),(2,'Only my groups','only_my_groups',15),(3,'Everyone','everyone',63);
/*!40000 ALTER TABLE `perms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `process`
--

DROP TABLE IF EXISTS `process`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `process` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `process_group_id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `summary` blob,
  `script` text,
  `publish` int(2) NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `process`
--

LOCK TABLES `process` WRITE;
/*!40000 ALTER TABLE `process` DISABLE KEYS */;
INSERT INTO `process` VALUES (149,2,'Bowtie2_Filter','Filter out and quantify given sequence sets.\r\nIf this is is common RNA set, the common set value needs to be set one of the commonRNA types. (ercc, rRNA, miRNA, tRNA, snRNA, snoRNA, rmsk).','&quot;script:\n    &quot;&quot;&quot; \n    indexPath=&quot;${share}/${species}/${build}/commondb/${rna_set}/${rna_set}&quot;\n\n    if [ &quot;${mate}&quot; == &quot;pair&quot; ]; then\n        bowtie2 -x \\$indexPath --no-unal --un-conc ${name}.unmapped.fq -1 ${reads.join(&#039; -2 &#039;)} -S ${name}_alignment.sam &gt; ${name}.bow 2&gt;&amp;1\n    else\n        bowtie2 -x \\$indexPath --un  ${name}.unmapped.fq -U $reads -S ${name}_alignment.sam &gt; ${name}.bow 2&gt;&amp;1\n    fi\n    grep -v Warning ${name}.bow &gt; ${name}.tmp\n    mv  ${name}.tmp ${name}.bow \n    samtools view -bS ${name}_alignment.sam &gt; ${name}_alignment.bam \n    samtools sort ${name}_alignment.bam -f ${name}_sorted_alignment.bam \n    &quot;&quot;&quot;&quot;',1,1,0,63,'2018-02-28 19:30:30','2018-02-28 19:51:48','474',0,'',18),(150,5,'parseBow','It parses bowtie output and writes mapped reads and percentages into a single line.','&quot;shell:\n&#039;&#039;&#039;\n#!/usr/bin/env perl\n\nopen(IN, &quot;!{bowfile}&quot;);\nmy $i = 0;\nmy ($RDS_T, $RDS_P, $RDS_C1, $RDS_C2, $ALGN_T, $a, $b)=(0, 0, 0, 0, 0, 0, 0);\nwhile(my $line=&lt;IN&gt;)\n{\n  chomp($line);\n  $line=~s/^ +//;\n  my @arr=split(/ /, $line);\n  $RDS_T=$arr[0] if ($i=~/^1$/);\n  $RDS_P=$arr[0].&quot; &quot;.$arr[1] if ($i == 2);\n  \n  if ($i == 3)\n  {\n    $a=$arr[0];\n    $RDS_C1=$arr[0].&quot; &quot;.$arr[1]\n  }\n  if ($i == 4)\n  {\n    $b=$arr[0];\n    $RDS_C2=$arr[0].&quot; &quot;.$arr[1];\n  }\n  $ALGN_T=($a+$b).&quot; (&quot;.$arr[0].&quot;)&quot; if (($i == 5 &amp;&amp; &quot;!{mate}&quot; ne &quot;pair&quot; ) || ($i == 13 &amp;&amp; &quot;!{mate}&quot; eq &quot;pair&quot; )) ;\n\n  $i++;\n}\nclose(IN);\n\nopen(my \\$fh, &#039;&gt;&#039;, &quot;!{name}.sum&quot;);\n\nprint $fh &quot;!{name}\\\\t$RDS_T\\\\t$RDS_P\\\\t$RDS_C1\\\\t$RDS_C2\\\\t$ALGN_T\\\\n&quot;;\nclose($fh);\n&#039;&#039;&#039;\n&quot;',1,1,0,63,'2018-02-28 19:35:08','2018-02-28 19:51:48','474',0,'',19);
/*!40000 ALTER TABLE `process` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `process_group`
--

DROP TABLE IF EXISTS `process_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `process_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_name` varchar(100) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `process_group`
--

LOCK TABLES `process_group` WRITE;
/*!40000 ALTER TABLE `process_group` DISABLE KEYS */;
INSERT INTO `process_group` VALUES (1,'Index',1,NULL,63,NULL,NULL,NULL),(2,'Alignment',1,NULL,63,NULL,NULL,NULL),(4,'Samtools',1,NULL,63,NULL,NULL,NULL),(5,'Misc.',1,NULL,63,NULL,NULL,NULL),(6,'QC',1,NULL,63,NULL,NULL,NULL);
/*!40000 ALTER TABLE `process_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `process_parameter`
--

DROP TABLE IF EXISTS `process_parameter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `process_parameter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `process_id` int(11) NOT NULL,
  `parameter_id` int(11) NOT NULL,
  `type` varchar(10) NOT NULL,
  `sname` varchar(256) DEFAULT NULL,
  `operator` varchar(50) NOT NULL,
  `closure` varchar(256) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `process_id` (`process_id`),
  KEY `parameter_id` (`parameter_id`),
  CONSTRAINT `process_parameter_ibfk_1` FOREIGN KEY (`process_id`) REFERENCES `process` (`id`),
  CONSTRAINT `process_parameter_ibfk_2` FOREIGN KEY (`parameter_id`) REFERENCES `parameter` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=319 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `process_parameter`
--

LOCK TABLES `process_parameter` WRITE;
/*!40000 ALTER TABLE `process_parameter` DISABLE KEYS */;
INSERT INTO `process_parameter` VALUES (308,149,65,'input','species','','',1,0,63,'2018-02-28 19:30:30','2018-02-28 19:51:48','474'),(309,149,67,'input','build','','',1,0,63,'2018-02-28 19:30:30','2018-02-28 19:51:48','474'),(310,149,64,'input','mate','','',1,0,63,'2018-02-28 19:30:30','2018-02-28 19:51:48','474'),(311,149,68,'input','share','','',1,0,63,'2018-02-28 19:30:30','2018-02-28 19:51:48','474'),(312,149,69,'input','rna_set','','',1,0,63,'2018-02-28 19:30:30','2018-02-28 19:51:48','474'),(313,149,11,'input','val(name), file(reads)','','',1,0,63,'2018-02-28 19:30:30','2018-02-28 19:51:48','474'),(314,149,71,'output','val(name), file(&quot;${name}.bow&quot;)','','',1,0,63,'2018-02-28 19:30:30','2018-02-28 19:51:48','474'),(315,149,11,'output','val(name), file(&quot;${name}.unmap*.fq&quot;)','','',1,0,63,'2018-02-28 19:30:30','2018-02-28 19:51:48','474'),(316,150,73,'output','&#039;*sum&#039;','','',1,0,63,'2018-02-28 19:35:08','2018-02-28 19:51:48','474'),(317,150,64,'input','mate','','',1,0,63,'2018-02-28 19:35:08','2018-02-28 19:51:48','474'),(318,150,71,'input','val(name), file(bowfile)','','',1,0,63,'2018-02-28 19:35:08','2018-02-28 19:51:48','474');
/*!40000 ALTER TABLE `process_parameter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile_amazon`
--

DROP TABLE IF EXISTS `profile_amazon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profile_amazon` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `status` varchar(15) NOT NULL,
  `pid` int(11) DEFAULT NULL,
  `ssh` varchar(256) NOT NULL,
  `nodes` varchar(10) NOT NULL,
  `autoscale_check` varchar(6) NOT NULL,
  `autoscale_maxIns` varchar(10) NOT NULL,
  `next_path` varchar(256) NOT NULL,
  `amazon_cre_id` int(11) NOT NULL,
  `ssh_id` int(11) NOT NULL,
  `default_region` varchar(256) NOT NULL,
  `access_key` varchar(256) NOT NULL,
  `secret_key` varchar(256) NOT NULL,
  `instance_type` varchar(256) NOT NULL,
  `image_id` varchar(256) NOT NULL,
  `shared_storage_mnt` varchar(256) NOT NULL,
  `shared_storage_id` varchar(256) NOT NULL,
  `subnet_id` varchar(256) NOT NULL,
  `executor` varchar(25) NOT NULL,
  `job_time` varchar(25) NOT NULL,
  `job_queue` varchar(25) NOT NULL,
  `job_cpu` varchar(25) NOT NULL,
  `job_memory` varchar(25) NOT NULL,
  `executor_job` varchar(25) NOT NULL,
  `next_time` varchar(25) NOT NULL,
  `next_queue` varchar(25) NOT NULL,
  `next_cpu` varchar(25) NOT NULL,
  `next_memory` varchar(25) NOT NULL,
  `cmd` varchar(500) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile_amazon`
--

LOCK TABLES `profile_amazon` WRITE;
/*!40000 ALTER TABLE `profile_amazon` DISABLE KEYS */;
/*!40000 ALTER TABLE `profile_amazon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile_cluster`
--

DROP TABLE IF EXISTS `profile_cluster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profile_cluster` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `username` varchar(256) NOT NULL,
  `hostname` varchar(256) NOT NULL,
  `ssh_id` int(11) NOT NULL,
  `next_path` varchar(256) NOT NULL,
  `executor` varchar(25) NOT NULL,
  `job_time` varchar(25) NOT NULL,
  `job_queue` varchar(25) NOT NULL,
  `job_cpu` varchar(25) NOT NULL,
  `job_memory` varchar(25) NOT NULL,
  `executor_job` varchar(25) NOT NULL,
  `next_time` varchar(25) NOT NULL,
  `next_queue` varchar(25) NOT NULL,
  `next_cpu` varchar(25) NOT NULL,
  `next_memory` varchar(25) NOT NULL,
  `cmd` varchar(500) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile_cluster`
--

LOCK TABLES `profile_cluster` WRITE;
/*!40000 ALTER TABLE `profile_cluster` DISABLE KEYS */;
INSERT INTO `profile_cluster` VALUES (26,'Cluster','ak97w','ghpcc06.umassrc.org',0,'/project/umw_biocore/bin','lsf','100','short','1','32','lsf','100','short','1','32','source /etc/profile',1,3,'2018-02-28 19:24:19','2018-02-28 19:24:19','474');
/*!40000 ALTER TABLE `profile_cluster` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile_local`
--

DROP TABLE IF EXISTS `profile_local`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profile_local` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `next_path` varchar(256) NOT NULL,
  `executor` varchar(25) NOT NULL,
  `job_time` varchar(25) NOT NULL,
  `job_queue` varchar(25) NOT NULL,
  `job_cpu` varchar(25) NOT NULL,
  `job_memory` varchar(25) NOT NULL,
  `executor_job` varchar(25) NOT NULL,
  `next_time` varchar(25) NOT NULL,
  `next_queue` varchar(25) NOT NULL,
  `next_cpu` varchar(25) NOT NULL,
  `next_memory` varchar(25) NOT NULL,
  `cmd` varchar(500) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile_local`
--

LOCK TABLES `profile_local` WRITE;
/*!40000 ALTER TABLE `profile_local` DISABLE KEYS */;
INSERT INTO `profile_local` VALUES (1,'Local','/usr/bin','local','','','','','','','','','','',1,3,'2018-02-28 00:00:00','2018-02-28 00:00:00','1');
/*!40000 ALTER TABLE `profile_local` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  `summary` blob,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES (62,'testRuns',1,NULL,3,'2018-02-28 19:39:31','2018-02-28 19:39:31','1','');
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_input`
--

DROP TABLE IF EXISTS `project_input`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_input` (
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
  KEY `input_id` (`input_id`),
  CONSTRAINT `project_input_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`),
  CONSTRAINT `project_input_ibfk_2` FOREIGN KEY (`input_id`) REFERENCES `input` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_input`
--

LOCK TABLES `project_input` WRITE;
/*!40000 ALTER TABLE `project_input` DISABLE KEYS */;
INSERT INTO `project_input` VALUES (94,62,94,1,NULL,3,'2018-02-28 19:40:07','2018-02-28 19:40:07','474'),(95,62,95,1,NULL,3,'2018-02-28 19:40:12','2018-02-28 19:40:12','474'),(96,62,96,1,NULL,3,'2018-02-28 19:40:16','2018-02-28 19:40:16','474'),(97,62,97,1,NULL,3,'2018-02-28 19:40:22','2018-02-28 19:40:22','474'),(98,62,98,1,NULL,3,'2018-02-28 19:41:02','2018-02-28 19:41:02','474'),(99,62,99,1,NULL,3,'2018-02-28 19:41:11','2018-02-28 19:41:11','474'),(100,62,100,1,NULL,3,'2018-02-28 20:26:47','2018-02-28 20:26:47','1'),(101,62,101,1,NULL,3,'2018-02-28 20:26:47','2018-02-28 20:26:47','1'),(102,62,102,1,NULL,3,'2018-02-28 20:31:25','2018-02-28 20:31:25','1'),(103,62,103,1,NULL,3,'2018-02-28 20:31:29','2018-02-28 20:31:29','1'),(104,62,104,1,NULL,3,'2018-02-28 20:31:35','2018-02-28 20:31:35','1'),(105,62,105,1,NULL,3,'2018-02-28 20:31:43','2018-02-28 20:31:43','1'),(106,62,106,1,NULL,3,'2018-02-28 20:32:13','2018-02-28 20:32:13','1'),(107,62,107,1,NULL,3,'2018-02-28 20:32:20','2018-02-28 20:32:20','1'),(108,62,108,1,NULL,3,'2018-02-28 20:39:55','2018-02-28 20:39:55','1'),(109,62,109,1,NULL,3,'2018-02-28 20:39:55','2018-02-28 20:39:55','1'),(110,62,110,1,NULL,3,'2018-02-28 20:41:37','2018-02-28 20:41:37','1'),(111,62,111,1,NULL,3,'2018-02-28 20:41:37','2018-02-28 20:41:37','1'),(112,62,112,1,NULL,3,'2018-02-28 20:56:18','2018-02-28 20:56:18','1'),(113,62,113,1,NULL,3,'2018-02-28 20:56:18','2018-02-28 20:56:18','1'),(114,62,114,1,NULL,3,'2018-02-28 22:14:00','2018-02-28 22:14:00','1'),(115,62,115,1,NULL,3,'2018-02-28 22:14:01','2018-02-28 22:14:01','1'),(116,62,116,1,NULL,3,'2018-02-28 22:14:11','2018-02-28 22:14:11','1'),(117,62,117,1,NULL,3,'2018-02-28 22:14:11','2018-02-28 22:14:11','1'),(118,62,118,1,NULL,3,'2018-02-28 22:17:40','2018-02-28 22:17:40','1'),(119,62,119,1,NULL,3,'2018-02-28 22:17:40','2018-02-28 22:17:40','1'),(120,62,120,1,NULL,3,'2018-02-28 22:17:54','2018-02-28 22:17:54','1'),(121,62,121,1,NULL,3,'2018-02-28 22:17:54','2018-02-28 22:17:54','1'),(122,62,122,1,NULL,3,'2018-03-01 18:45:05','2018-03-01 18:45:05','1'),(123,62,123,1,NULL,3,'2018-03-01 18:45:05','2018-03-01 18:45:05','1');
/*!40000 ALTER TABLE `project_input` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_pipeline`
--

DROP TABLE IF EXISTS `project_pipeline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_pipeline` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `summary` blob,
  `output_dir` varchar(256) NOT NULL,
  `cmd` varchar(500) NOT NULL,
  `profile` varchar(30) NOT NULL,
  `interdel` varchar(6) NOT NULL,
  `exec_next_settings` varchar(300) NOT NULL,
  `exec_each` varchar(6) NOT NULL,
  `exec_all` varchar(6) NOT NULL,
  `exec_all_settings` text NOT NULL,
  `exec_each_settings` text NOT NULL,
  `singu_img` varchar(256) NOT NULL,
  `singu_opt` varchar(500) NOT NULL,
  `docker_img` varchar(256) NOT NULL,
  `docker_opt` varchar(500) NOT NULL,
  `singu_check` varchar(6) NOT NULL,
  `docker_check` varchar(6) NOT NULL,
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
  KEY `pipeline_id` (`pipeline_id`),
  CONSTRAINT `project_pipeline_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`),
  CONSTRAINT `project_pipeline_ibfk_2` FOREIGN KEY (`pipeline_id`) REFERENCES `biocorepipe_save` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=211 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_pipeline`
--

LOCK TABLES `project_pipeline` WRITE;
/*!40000 ALTER TABLE `project_pipeline` DISABLE KEYS */;
INSERT INTO `project_pipeline` VALUES (209,'run in the cluster','','/project/umw_biocore/dolphinnext/dockerruns/filtertest2','module load java/1.8.0_77 && module load bowtie2/2.3.2','cluster-26','true','','false','false','{\"job_queue\":\"short\",\"job_memory\":\"32\",\"job_cpu\":\"1\",\"job_time\":\"100\"}','{\"queue\":\"short\",\"memory\":\"10 GB\",\"cpu\":\"100\"}','','','','','false','false',62,160,1,0,3,'2018-02-28 19:39:50','2018-02-28 22:18:07','1'),(210,'runLocal','','/export/dolphinnext/test1','','local-1','false','','false','false','{\"job_queue\":\"\",\"job_memory\":\"\",\"job_cpu\":\"\",\"job_time\":\"\"}','{\"queue\":\"short\",\"memory\":\"10 GB\",\"cpu\":\"100\"}','','','','','false','false',62,160,1,0,3,'2018-02-28 20:31:00','2018-02-28 20:41:27','1');
/*!40000 ALTER TABLE `project_pipeline` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_pipeline_input`
--

DROP TABLE IF EXISTS `project_pipeline_input`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_pipeline_input` (
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
  KEY `input_id` (`input_id`),
  CONSTRAINT `project_pipeline_input_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`),
  CONSTRAINT `project_pipeline_input_ibfk_2` FOREIGN KEY (`input_id`) REFERENCES `input` (`id`),
  CONSTRAINT `project_pipeline_input_ibfk_3` FOREIGN KEY (`pipeline_id`) REFERENCES `biocorepipe_save` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_pipeline_input`
--

LOCK TABLES `project_pipeline_input` WRITE;
/*!40000 ALTER TABLE `project_pipeline_input` DISABLE KEYS */;
INSERT INTO `project_pipeline_input` VALUES (82,62,160,94,209,2,'species',1,NULL,3,'2018-02-28 19:40:07','2018-02-28 19:40:07','1','val'),(83,62,160,95,209,3,'build',1,NULL,3,'2018-02-28 19:40:12','2018-02-28 19:40:12','1','val'),(84,62,160,96,209,4,'mate',1,NULL,3,'2018-02-28 19:40:16','2018-02-28 19:40:16','1','val'),(85,62,160,97,209,7,'rna_set',1,NULL,3,'2018-02-28 19:40:22','2018-02-28 19:40:22','1','val'),(86,62,160,98,209,6,'inputreads',1,NULL,3,'2018-02-28 19:41:02','2018-02-28 19:41:02','1','set'),(87,62,160,99,209,5,'share',1,NULL,3,'2018-02-28 19:41:11','2018-02-28 19:41:11','1','val'),(88,62,160,102,210,2,'species',1,NULL,3,'2018-02-28 20:31:25','2018-02-28 20:31:25','1','val'),(89,62,160,103,210,3,'build',1,NULL,3,'2018-02-28 20:31:29','2018-02-28 20:31:29','1','val'),(90,62,160,104,210,4,'mate',1,NULL,3,'2018-02-28 20:31:35','2018-02-28 20:31:35','1','val'),(91,62,160,105,210,7,'rna_set',1,NULL,3,'2018-02-28 20:31:43','2018-02-28 20:31:43','1','val'),(92,62,160,106,210,6,'inputreads',1,NULL,3,'2018-02-28 20:32:13','2018-02-28 20:32:13','1','set'),(93,62,160,107,210,5,'share',1,NULL,3,'2018-02-28 20:32:20','2018-02-28 20:32:20','1','val');
/*!40000 ALTER TABLE `project_pipeline_input` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `run`
--

DROP TABLE IF EXISTS `run`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `run` (
  `project_pipeline_id` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `run_status` varchar(11) NOT NULL,
  `attempt` int(11) DEFAULT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`project_pipeline_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `run`
--

LOCK TABLES `run` WRITE;
/*!40000 ALTER TABLE `run` DISABLE KEYS */;
INSERT INTO `run` VALUES (209,4897528,'NextSuc',5,1,NULL,3,'2018-01-26 14:41:39','2018-03-01 18:45:05','1'),(210,2849,'NextSuc',5,1,NULL,3,'2018-02-28 20:33:34','2018-02-28 22:14:00','1');
/*!40000 ALTER TABLE `run` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `run_log`
--

DROP TABLE IF EXISTS `run_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `run_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_pipeline_id` int(11) NOT NULL,
  `run_status` varchar(20) NOT NULL,
  `duration` varchar(30) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_ended` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `run_log`
--

LOCK TABLES `run_log` WRITE;
/*!40000 ALTER TABLE `run_log` DISABLE KEYS */;
INSERT INTO `run_log` VALUES (12,209,'Terminated','',1,NULL,3,'2018-02-28 19:48:54','2018-02-28 20:23:19','2018-02-28 20:23:19',1),(13,209,'NextSuc',' 1m 16s',1,NULL,3,'2018-02-28 20:25:06','2018-02-28 22:17:54','2018-02-28 22:17:54',1),(14,210,'Error','',1,NULL,3,'2018-02-28 20:33:34','2018-02-28 20:33:44','2018-02-28 20:33:44',1),(15,210,'Error','',1,NULL,3,'2018-02-28 20:34:39','2018-02-28 20:35:45','2018-02-28 20:35:45',1),(16,210,'Error','',1,NULL,3,'2018-02-28 20:38:20','2018-02-28 20:38:30','2018-02-28 20:38:30',1),(17,210,'NextSuc',' 4.6s',1,NULL,3,'2018-02-28 20:39:45','2018-02-28 20:39:55','2018-02-28 20:39:55',1),(18,210,'NextSuc',' 4.3s',1,NULL,3,'2018-02-28 20:41:27','2018-02-28 22:14:00','2018-02-28 22:14:00',1),(19,209,'NextSuc',' 25m 21s',1,NULL,3,'2018-02-28 22:18:08','2018-03-01 18:45:05','2018-03-01 18:45:05',1);
/*!40000 ALTER TABLE `run_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ssh`
--

DROP TABLE IF EXISTS `ssh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ssh` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `check_ourkey` varchar(6) NOT NULL,
  `check_userkey` varchar(6) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ssh`
--

LOCK TABLES `ssh` WRITE;
/*!40000 ALTER TABLE `ssh` DISABLE KEYS */;
/*!40000 ALTER TABLE `ssh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_group`
--

DROP TABLE IF EXISTS `user_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_group` (
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_group`
--

LOCK TABLES `user_group` WRITE;
/*!40000 ALTER TABLE `user_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
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
) ENGINE=MyISAM AUTO_INCREMENT=475 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'nephantes',NULL,'admin','Alper Kucukural','nephantes@gmail.com','','','/img/avatar5.png','2018-02-28 19:16:15',NULL,NULL,3,'2018-02-28 19:16:15','2018-02-28 19:16:15','https://lh4.googleusercontent.com/-yKqeHxt4FlQ/AAAAAAAAAAI/AAAAAAAAAYw/jooH-F5y02o/s96-c/photo.jpg','107923577997088216371','');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-03-06 16:38:43
