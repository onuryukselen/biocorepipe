params.outdir = 'aasasa'  

params.inputparam ="" 

g_4_genome_index = file(params.inputparam) 

process troy {

input:
 file dggd from g_4_genome_index
 file fssf from param

output:
 set dgdg into g_3_read_pairs

"""
//groovy example: 

 bowtie2-build ${genome} genome.index
"""

}
 g_3_read_pairs.subscribe {println "##Output:dgdg## ${it.name}"}


workflow.onComplete {
println "##Pipeline execution summary##"
println "---------------------------"
println "##Completed at: $workflow.complete"
println "##Duration: ${workflow.duration}"
println "##Success: ${workflow.success ? 'OK' : 'failed' }"
println "##Exit status: ${workflow.exitStatus}"
}
