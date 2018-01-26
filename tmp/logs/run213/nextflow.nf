params.outdir = 'results'  

params.hg19 ="" 
params.mate ="" 
params.gut_and_liver_readpairs ="" 

g_11_genome = file(params.hg19) 
g_17_mate = params.mate
Channel
	.fromFilePairs( params.gut_and_liver_readpairs , size: (params.mate != "pair") ? 1 : 2 )
	.ifEmpty { error "Cannot find any read_pairs matching: ${params.gut_and_liver_readpairs}" }
	.set { g_18_read_pairs} 


process Build_Index {

input:
 file genome from g_11_genome

output:
 file 'genome.index*' into g_0_genome_index

"""
bowtie2-build ${genome} genome.index
"""

}

process Map_Tophat2 {

publishDir params.outdir, mode: 'copy',
	saveAs: {filename ->
	if (filename =~ /${name}.bam/) filename
	else if (filename =~ /${name}_unmapped.bam/) filename
}

input:
 file genome from g_11_genome
 set val(name), file(reads) from g_18_read_pairs
 file index from g_0_genome_index
 val mate from g_17_mate

output:
 file "${name}.bam" into g_16_mapped_read_pairs
 file "${name}_unmapped.bam" into g_16_unmapped_reads

script:
  if ( mate == "pair" ) {
      """
      tophat2 -o . genome.index $reads 
      mv accepted_hits.bam ${name}.bam
      mv unmapped.bam ${name}_unmapped.bam
      """
} 
    else if  ( mate == "single" ){
      """
      tophat2 -o . genome.index $reads
      mv accepted_hits.bam ${name}.bam
      mv unmapped.bam ${name}_unmapped.bam
      """
}

}

