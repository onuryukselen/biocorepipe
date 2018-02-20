************************
Developer Implementation
************************

Dolphin Integration
===================

This section of the documentation is only meant for developers implementing a Dolphin system on their own personal system.
This is not to be confused with Dolphin-Docker, which creates an insteance of Dolphin using a Virtual Machine.  If you are
not implementing Dolphin within your own system, please ignore these notes.

Python Dependencies
===================

Dolphin, as you may have noticed, uses python for some scripts in order to generate pipelines or secure data within the databse.
Here is a list of packages you will need in order to properly implement Dolphin within your system:

	* pycrypto
	* simple-crypt
	* boto
	* boto3
	* MySQLdb
	* ConfigParser
	* optparse
	* binascii
	* subprocess
	
You can install these modules with the "pip install" feature of python.
