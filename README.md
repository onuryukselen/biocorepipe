# biocorepipe v0.0.1
Initial commit

Single and Pair-End Options
Single-End and Pair-End option can be added into processes by adding parameter whose name is "end" and type is "val" as a input of a process. While creating pipeline, defined input: "end"  should be connected with input parameters whose name is "single" or "pair". 


Defining Paths
Paths should be defined for the pair-ends as following example:  

params.readp ="$baseDir/data/ggal/*_{1,2}.fq" 

Only one asterisk should cover the generic name of the file and numeric parts should be defined with {1,2}.

Wherase for the singe-ends as following:  

params.readp ="$baseDir/data/ggal/*.fq" 

Only one asterisk should cover the generic name of the file and numeric parts shouldn't included.
