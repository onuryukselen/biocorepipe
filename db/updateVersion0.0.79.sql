 USE biocorepipe;
alter table biocorepipe_save change summary summary blob;
alter table process change summary summary blob;
alter table project change summary summary blob;
alter table project_pipeline change summary summary blob;
