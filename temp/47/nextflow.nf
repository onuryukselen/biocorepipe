params.outdir = 'results'  

params.inputparam ="" 
params.inputparam ="" 
params.inputparam ="" 

g_3_genome = file(params.inputparam) 
Channel
	.fromFilePairs( params.inputparam , size: (params.end != "pair") ? 1 : 2 )
	.ifEmpty { error "Cannot find any read_pairs matching: ${params.inputparam}" }
	.set { g_8_read_pairs} 

g_9_end = params.inputparam

process Build_Index {

input:
 file genome from g_3_genome

output:
 file 'genome.index*' into g_0_genome_index

bowtie2-build ${genome} genome.index

}

process Map_Tophat2 {

publishDir params.outdir, mode: 'copy',
	saveAs: {filename ->
	if (filename =~ /${name}.bam/) filename
	else if (filename =~ /${name}_unmapped.bam/) filename
}

input:
 file genome from g_3_genome
 file index from g_0_genome_index
 set val(name), file(reads) from g_8_read_pairs
 val end from g_9_end

output:
 file "${name}.bam" into g_1_mapped_read_pairs
 file "${name}_unmapped.bam" into g_1_unmapped_reads

script:
  if ( end == "pair" ) {
      """
      tophat2 -o . genome.index $reads 
      mv accepted_hits.bam ${name}.bam
      mv unmapped.bam ${name}_unmapped.bam
      """
} 
    else if  ( end == "single" ){
      """
      tophat2 -o . genome.index $reads
      mv accepted_hits.bam ${name}.bam
      mv unmapped.bam ${name}_unmapped.bam
      """
}

}

process Map_Tophat2 {

publishDir params.outdir, mode: 'copy',
	saveAs: {filename ->
	if (filename =~ /${name}.bam/) filename
	else if (filename =~ /${name}_unmapped.bam/) filename
}

input:
 file genome from g_3_genome
 file index from param
 set val(name), file(reads) from param
 val end from param

output:
 file "${name}.bam" into g_2_mapped_read_pairs
 file "${name}_unmapped.bam" into g_2_unmapped_reads

script:
  if ( end == "pair" ) {
      """
      tophat2 -o . genome.index $reads 
      mv accepted_hits.bam ${name}.bam
      mv unmapped.bam ${name}_unmapped.bam
      """
} 
    else if  ( end == "single" ){
      """
      tophat2 -o . genome.index $reads
      mv accepted_hits.bam ${name}.bam
      mv unmapped.bam ${name}_unmapped.bam
      """
}

}

