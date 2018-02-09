params.outdir = 'svs'  

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

workflow.onComplete {
println "##Pipeline execution summary##"
println "---------------------------"
println "##Completed at: $workflow.complete"
println "##Duration: ${workflow.duration}"
println "##Success: ${workflow.success ? 'OK' : 'failed' }"
println "##Exit status: ${workflow.exitStatus}"
println "##Error report: ${workflow.errorReport ?: '-'}"
}
