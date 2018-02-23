params.outdir = 'a'  

params.brun ="" 
params.wdir ="" 
params.samsheet ="" 
params.gelbarcode ="" 
params.extractValidReads_location ="" 
params.cutoff ="" 
params.inputparam ="" 
params.inputparam ="" 

g_1_brun = params.brun
g_2_wdir = params.wdir
g_9_g_samsheet = file(params.samsheet) 
g_15_gel = file(params.gelbarcode) 
g_16_g_extractValid = file(params.extractValidReads_location) 
g_25_cutoff = params.cutoff
g_38_genome = file(params.inputparam) 
g_39_mate = params.inputparam

process rsync_basespace {

input:
 val brun_in from g_1_brun
 val wdir_in from g_2_wdir

output:
 file '*' into g_4_g_files

"""
mkdir -p  ${wdir_in}
mkdir -p ${wdir_in}/Files
rsync -rav ${brun_in}/*.xml ${brun_in}/*.txt ${wdir_in}/Files
rsync -rav ${brun_in}/Data ${wdir_in}/Files
"""

}


process bcltofastq {

input:
 file samsheet from g_9_g_samsheet
 val wdir_in from g_2_wdir
 file '*' from g_4_g_files

output:
 file "${wdir_in}/fastqs/*.fastq.gz" into g_13_g_fastq

"""
mkdir -p ${wdir_in}/fastqs
bcl2fastq --runfolder-dir ${wdir_in}/Files --output-dir ${wdir_in}/fastqs --sample-sheet ${samsheet} --use-bases-mask y*,y*,I*,y* --mask-short-adapter-reads 0 --minimum-trimmed-read-length 0 --barcode-mismatches 1
find ${wdir_in}/fastqs/* -mindepth 2 -name '*.gz' -exec mv -t ${wdir_in}/fastqs {} +
mkdir -p ${wdir_in}/fastqs/undetermined
mv ${wdir_in}/fastqs/Undetermined* ${wdir_in}/fastqs/undetermined/
"""

}


process extractValidReads {

input:
 val wdir_in from g_2_wdir
 file gel from g_15_gel
 file extractVcode from g_16_g_extractValid
 set file(fastq1), file(fastq2), file(fastq3) from g_13_g_fastq.flatMap().buffer(size:3)

output:
 set val(nametag), file("${wdir_in}/validfastq/*.fastq") into g_22_valid_fastq_g_24

script:
nametag = fastq1.toString() - '.fastq.gz'

"""
mkdir -p ${wdir_in}/validfastq
python ${extractVcode} \
-i ${fastq1}  \
-o ${nametag} \
-d ${wdir_in}/validfastq \
-b ${gel} \
-u 8
 """

}


process Split {

input:
 set val(name), file(validfastq) from g_22_valid_fastq_g_24
 val cutoff from g_25_cutoff

output:
 set val(name), file('*') into g_24_split_fastq_g_28 mode flatten

"""
split -l ${cutoff} --numeric-suffixes ${validfastq} ${name}._
ls ${name}._*|awk '{n=split(\$1,a,".");system("mv "\$1" ${name}"a[n]".fastq")}'
"""

}


process Build_Index {

input:
 file genome from g_38_genome

output:
 file 'genome.index*' into g_26_genome_index

"""
bowtie2-build ${genome} genome.index
"""

}


process Map_Tophat2_SCell {

publishDir "${params.outdir}/outputparam", mode: 'move',
	saveAs: {filename ->
	if (filename =~ /${name}.bam/) filename
}

input:
 file genome from g_38_genome
 set val(oldname), file(reads) from g_24_split_fastq_g_28
 val mate from g_39_mate
 file index from g_26_genome_index

output:
 set val(oldname), file("${name}_unmapped.bam") into g_28_unmapped_reads
 set val(oldname), file("${name}.bam") into g_28_mapped_reads

script:
name =  reads.toString() - '.fastq'

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


workflow.onComplete {
println "##Pipeline execution summary##"
println "---------------------------"
println "##Completed at: $workflow.complete"
println "##Duration: ${workflow.duration}"
println "##Success: ${workflow.success ? 'OK' : 'failed' }"
println "##Exit status: ${workflow.exitStatus}"
}
workflow.onComplete { file('work').deleteDir() } 
