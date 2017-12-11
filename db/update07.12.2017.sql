UPDATE `process_group` SET `id`=1 WHERE `id`=2;
UPDATE `process_group` SET `id`=2 WHERE `id`=3;
UPDATE `process_group` SET `id`=3 WHERE `id`=4;
UPDATE `process_group` SET `id`=4 WHERE `id`=5;
UPDATE `process_group` SET `id`=5 WHERE `id`=6;

UPDATE `process` SET `process_group_id`=1 WHERE `id`=10;
UPDATE `process` SET `process_group_id`=2 WHERE `id`=11;
UPDATE `process` SET `process_group_id`=3 WHERE `id`=12;
UPDATE `process` SET `process_group_id`=4 WHERE `id`=16;
UPDATE `process` SET `process_group_id`=5 WHERE `id`=17;
UPDATE `process` SET `process_group_id`=2 WHERE `id`=18;
UPDATE `process` SET `process_group_id`=6 WHERE `id`=19;

