use biocorepipe;
ALTER TABLE project_pipeline 
ADD publish_dir varchar(256) NOT NULL AFTER output_dir,
ADD publish_dir_check varchar(6) NOT NULL AFTER output_dir;

