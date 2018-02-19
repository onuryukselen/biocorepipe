******************
Excel Export Guide
******************

This guide will walk you though the process of exporting selected Imports/Samples though the NGS Browser page.

Getting Started
===============

First, make sure you have an instance of dolphin available (see Dolphin Docker) as well as an account for the dolphin interface.

Next, make sure you have Imports/Samples that are available for you to select to export.  This means that the Imports/Samples are viewable by you and that they have underwent the initial processing phase.

Once logged in, click on the 'NGS Tracking' tab on the left, then click on 'NGS Browser'.

.. image:: dolphin_pics/menu_bar.png
	:align: center

From the Browser
================

Once you've made it to the Browser page, You can then filter the Imports/Samples if you wish in order to help filter your selection options.  Once you've selected the Imports/Samples that you wish to export, you may click on the 'Export to Excel' button.

It is important to not that you cannot export Imports/Samples from different Experiment Series.  By selecting data that belongs to more than one Experiment Series, an error will occur and the user will receive a warning message that the action is not allowed.

Likewise, if no data is selected and the Export button is pressed, an error will occur and the user will receive a warning message that the action is not allowed.

The file saved will be in the format of: *user* _ *year* _ *month* _ *day* _ *hour* _ *minute* _ *seconds* . xlsx


For more information on the NGS Browser, see the NGS Browser guide.
