params.outdir = 'results'  

params.genome ="" 

g_0_genome = file(params.genome) 

process Build_Index {

publishDir params.outdir, mode: 'copy',
	saveAs: {filename ->
	if (filename =~ /genome.index/) filename
}

input:
 file genome from g_0_genome

output:
 file 'genome.index*' into g_1_genome_index

"""
bowtie2-build ${genome} genome.index
"""

}

