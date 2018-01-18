#!/bin/bash -ue
tophat2 -o . genome.index ggal_gut_1.fq ggal_gut_2.fq 
mv accepted_hits.bam ggal_gut.bam
mv unmapped.bam ggal_gut_unmapped.bam
