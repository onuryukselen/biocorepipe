****************
NGS Status Guide
****************

This guide will walk you through all of your options within the Run Status page.

Getting Started
===============

First, make sure to have an instance of dolphin available (see Dolphin Docker) as well as an account for the dolphin interface.

Once logged in, click on the 'NGS Tracking' tab on the left, then click on 'Run Status'.

.. image:: dolphin_pics/menu_bar.png
	:align: center

Status Page
===========

The Run Status page will display all of your current runs within Dolphin, old and new.

If you have not yet processed any runs, this page will consist of an empty table with no further options of interaction.

However, if you have already started processing some initial runs, the table reads as follows:

**ID:**

This is a unique run identifier.  If contacting your local administrator or someone at biocore@umassmed.edu about a specific run, this number will help identify the run quicker.

**Name:**

The name given to the specific run.

**Output Directory:**

The output directory specified where the run information will be sent within the cluster.

**Description:**

The description of the run given by the user.

**Status:**

This is the status of the current run.  The run can have 5 different statuses.

.. image:: dolphin_pics/status_types.png
	:align: center

Each status cooresponds to how the current run is behaving.  The statuses and their meanings include:

* *Queued:* A queued run is currently waiting to be executed.  Time in the queue depends on the cluster.

* *Stopped:* A stopped run has started to run, but was at one point manually stopped by a user.

* *Error:* An errored run has had something go wrong and could not complete appropriately.  By clicking the status button on an error, a window will pop-up with a little more information about the error.  If there are logs of the past processes, you can click the 'Adv. Status' button to be taken to the Advanced status page.

* *Running:* A run that is currently running.

* *Completed:* A completed run has finished with it's task and the output is ready.

As long as the run isn't queued, you can click on the status button of a run to obtain more detailing information about the run in the Advanced Status page for that specific run.

**Options:**

The options column contains a clickable options button that will give the user specific options on the specified run.

.. image:: dolphin_pics/run_options.png
	:align: center

Each status and run type will have a different set of options.

Rather than describing every set of options for every combination, we will go over what each option does.

* *Delete:* This will delete the current selected run.

* *Cancel:* This will stop a run currently queued.  It will not delete the run information.

* *Stop:* This will stop a currently running run.  It will not delete the run information.

* *Rerun:* This option will rerun the selected run and allow for parameter changes.  If a new directory is specified, it will create a new run.

* *Resume:*  This will rerun the selected run without parameter changes.

* *Report Details:*  Selecting this option will take you to the selected run's report page.

* *Generate Plots:*  Selecting this option will take you to the selected run's plot page.

* *Change Permissions:* If you are the owner of the run, you can change the permissions of the selected run

**View Which Runs?:**

.. image:: dolphin_pics/status_sort.png
	:align: center

This dropdown menu will toggle which types of runs you will be viewing within the status table.

The options include:

* *All Runs:* This is the default setting.  All of the runs you have permissions to view will be displayed.
* *Initial Runs:* This setting will display all of the initial runs you have permissions to view.
* *Normal Runs:* This setting will display all of the runs that you have permissions to view that are not initial runs.

Advanced Status Page
===============

Upon clicking on a non-queued status, you will be directed to the advanced status page.

This page displays a table with each step processed, or currently being processed within the system of your run.

If the progress bar is green, then the step has fully finished without errors.  If the bar is red, it is either currently running or it has received an error within the step.

Upon selecting the 'Select Service' button on the right of each step, another table will be shown of all the current subprocesses within this given step.

Along with some additional information, the user can select the 'Select Job' button to view the standard output of this current job.
