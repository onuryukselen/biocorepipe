params.outdir = 'results'  

params.hg19 ="" 

g_11_genome = file(params.hg19) 

process Build_Index {

publishDir params.outdir, mode: 'copy',
	saveAs: {filename ->
	if (filename =~ /genome.index/) filename
}

input:
 file genome from g_11_genome

output:
 file 'genome.index*' into g_0_genome_index

"""
bowtie2-build ${genome} genome.index
"""

}

