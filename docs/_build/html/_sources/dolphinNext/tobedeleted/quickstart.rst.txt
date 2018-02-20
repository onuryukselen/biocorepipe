*************************
DolphinNext Quick-start Guide
*************************

This guide is a quick walkthrough for setting up a Dolphin account

Accessing Dolphin
=================

So you want to start using the Dolphin Web tool, but you don't have an account.

Let's go over the steps needed to be taken in order to access the Dolphin Web Service at UMass.

**HPCC Access**

In order to use the Dolphin Web Service at UMass, you're going to need access to our High Performance Computing Cluster.

Registration for the cluster can be found at `this address`_

.. _this address: https://www.umassrc.org/hpc/

Once the HPCC Admins group receives your registration form, they will send an email to your PI requesting the PI's permission to give you access.

After it's approved you will receive an email from the HPCC Admins group with your HPCC account user name.

**Joining the Dolphin Group**

Once you have your Cluster account, you're going to want to email to hpcc-support@umassmed.edu to join the galaxy group.

Make sure to CC biocore@umassmed.edu

**Log Into Dolphin**

In order to make sure you have access to our tools and pipelines, you're going to want to log into 'dolphin.umassmed.edu' to see if you have permissions.

If you are able to log in, then you should be all set.

**Dolphin Keys**

In order for Dolphin to act on your behalf and use the pipeline tools we have available for you, you're going to need to run a script to give us permissions.

First, log into the cluster terminal using:

*<your_user>@ghpcc06.umassrc.org*

Where <your_user> is your username given to you by the cluster.

Once you're logged in, all you have to do is run this script:

/project/umw_biocore/bin/addKey.bash

This is a one time script that you'll need to run in order to have access to the Dolphin Web Service.

After using this script, it might take a few hours for our system to update before you can log into the Dolphin Web Service.  If a day goes by and you're still not able to access the Dolphin Web Service, please contact us at biocore@umassmed.edu

**Project Space requirements**

Once you have access to Dolphin, you're going to need some space in order to store your data/results.  Make sure you coordinate with HPCC for how much project space you have or require.

You should also consult with your lab on data storage, access rights, and any other additional file information you may need.



Once you have access to Dolphin and have determined whether or not you have enough space, You'll be ready to import your data to our database and begin analyzation!

For more information about importing your data, see the Excel Import Guide.
