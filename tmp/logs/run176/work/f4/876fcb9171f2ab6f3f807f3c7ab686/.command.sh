#!/bin/bash -ue
tophat2 -o . genome.index ggal_liver_1.fq ggal_liver_2.fq 
mv accepted_hits.bam ggal_liver.bam
mv unmapped.bam ggal_liver_unmapped.bam
