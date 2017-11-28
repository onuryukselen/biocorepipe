-- Build_index and Map_Tophat2 processes updated. Obsolete tables are removed.

INSERT INTO `parameter`(`id`, `name`, `channel_name`, `file_type`, `file_path`, `version`, `qualifier`, `input_text`, `date_created`, `date_modified`, `last_modified_user`) VALUES 
(18, 'end', 'end', 'end', '', '', 'val', '', '2017-07-12 03:36:42', '2017-07-12 03:36:42', 'root');

UPDATE `parameter` SET `name`='sam_files',`channel_name`='sam',`file_type`='',`file_path`='',`version`='1',`qualifier`='file',`input_text`='',`date_created`='2017-11-20 15:18:33',`date_modified`='2017-11-20 15:18:33',`last_modified_user`='root' WHERE `id`=16;

UPDATE `parameter` SET `name`='unmapped_reads',`channel_name`='unmapped_reads',`file_type`='bam',`file_path`='',`version`='1',`qualifier`='file',`input_text`='',`date_created`='2017-11-20 15:33:16',`date_modified`='2017-11-20 15:33:16',`last_modified_user`='root' WHERE `id`=17;

UPDATE `parameter` SET `qualifier`='file' WHERE `id`=13;


DROP TABLE pipeline_process;
DROP TABLE pipeline_process_parameter;
DROP TABLE pipeline;
DROP TABLE matchid;



UPDATE `process_parameter` SET `name`='val(name), file(reads)' WHERE `id`=23;
UPDATE `process_parameter` SET `name`='"${name}.bam"' WHERE `id`=24;

INSERT INTO `process_parameter` (`id`, `process_id`, `parameter_id`, `type`, `name`, `date_created`, `date_modified`, `last_modified_user`) VALUES
(44, 18, 11, 'input', 'val(name), file(reads)', '2017-11-20 15:11:34', '2017-11-20 15:11:34', 'root'),
(45, 18, 10, 'input', 'index', '2017-11-20 15:11:49', '2017-11-20 15:11:49', 'root'),
(46, 18, 13, 'output', '"${name}_sorted_alignment.bam"', '2017-11-20 15:14:19', '2017-11-20 15:14:19', 'root'),
(47, 18, 16, 'output', '"${name}_alignment.sam"', '2017-11-20 15:19:35', '2017-11-20 15:19:35', 'root'),
(49, 11, 17, 'output', '"${name}_unmapped.bam"', '2017-11-20 15:41:48', '2017-11-20 15:41:48', 'root'),
(51, 11, 18, 'input', 'end', '2017-11-28 02:21:29', '2017-11-28 02:21:29', 'root');


UPDATE `process` SET `script`='script:\r\n  if ( end == "pair" ) {\r\n      """\r\n      tophat2 -o . genome.index $reads \r\n      mv accepted_hits.bam ${name}.bam\r\n      mv unmapped.bam ${name}_unmapped.bam\r\n      """\r\n} \r\n    else if  ( end == "single" ){\r\n      """\r\n      tophat2 -o . genome.index $reads\r\n      mv accepted_hits.bam ${name}.bam\r\n      mv unmapped.bam ${name}_unmapped.bam\r\n      """\r\n}' WHERE `id`=11;

UPDATE `process` SET `script`='script: if( end == "pair" ) { """ bowtie2 -x genome.index -1 ${reads.join('' -2 '')} -S ${name}_alignment.sam samtools view -bS ${name}_alignment.sam > ${name}_alignment.bam samtools sort ${name}_alignment.bam -f ${name}_sorted_alignment.bam """ } else { """ bowtie2 -x genome.index -U $reads -S ${name}_alignment.sam samtools view -bS ${name}_alignment.sam > ${name}_alignment.bam samtools sort ${name}_alignment.bam -f ${name}_sorted_alignment.bam """ }' WHERE `id`=18;

UPDATE `process` SET `script`='"""bowtie2-build ${genome} genome.index"""' WHERE `id`=10;




