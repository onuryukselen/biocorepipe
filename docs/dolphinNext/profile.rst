*************
Profile Guide
*************

This guide will walk you through all of your options within the Profile page.

Getting Started
===============

Once logged in, click on the profile tab in the top right of the screen.

	
Profile Page
============

Once you've accessed the profile page, you'll notice several tabs to explore.

The first tab is run environments. This is your main segment for creating connection profile. Second tab is groups where you can create group and add members to it. 
Next section is the SSH Keys, where you can create new or enter existing SSH key pairs to establish connection to any kind of host. 
Fourth tab is called Amazon Keys where you enter your Amazon Web Services (AWS) security credentials to start/stop Amazon EC2 instances(https://aws.amazon.com/ec2/).

.. note:: In order to submit a jobs to specified hosts, first create SSH Keys and then create connection profile in the run environments tab. 
If you want to create Amazon EC2 instances and submit your jobs to Amazon Cloud, then both SSH and Amazon Key are required before creating connection profile.


SSH Keys
========
In the SSH keys tab, you can create new or enter existing SSH key pairs by clicking on "Add SSH Key" button. By using Add SSH Keys window, enter the name of your keys and select the method you want to proceed: A. use your own keys or B. create new keys. 

A. If you choose "use your own keys", your private and public key pairs will be asked. You can reach your key pairs in your computer at default location: ~/.ssh/id_rsa for private and ~/.ssh/id_rsa.pub for public key. If these files are not exist or you want to create new ones, then on the command line, enter::

ssh-keygen -t rsa

You will be prompted to supply a filename and a password. In order to accept the default filename (and location) for your key pair, press Enter without entering a filename. Your SSH keys will be generated using the default filename (id_rsa and id_rsa.pub). 

B. If you choose "create new keys", you will proceed by clicking generate keys button where new pair of ssh keys will be specifically produced for you. You should keep these keys in your default .ssh directory (~/.ssh/id_rsa for private and ~/.ssh/id_rsa.pub for public key). It is required to be adjust your public key permissions to 644 (-rw-r--r--) and private key permissions to 600 (-rw-------) by entering following commands::

chmod -R 644 ~/.ssh/id_rsa
chmod -R 600 ~/.ssh/id_rsa_pub

In both of the cases, private key will be used for submiting jobs in the host. Therefore, public key required to be added into '~/.ssh/authorized_keys' in the host by user. 

Amazon Keys
===========
In the Amazon keys tab, you can enter your AWS security credentials by clicking on "Add Amazon Key" button. Your information will be encrypted and kept secure.





















