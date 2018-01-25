params.outdir = 'results'  

params.inputparam ="" 

g_0_genome = file(params.inputparam) 

process Build_Index {

input:
 file genome from g_0_genome

output:
 file 'genome.index*' into g_1_genome_index

"""
bowtie2-build ${genome} genome.index
"""

}

process Build_Index {

input:
 file genome from g_0_genome

output:
 file 'genome.index*' into g_2_genome_index

"""
bowtie2-build ${genome} genome.index
"""

}

