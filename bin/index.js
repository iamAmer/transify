#! /usr/bin/env node
console.log("Hello World!");

const utils = require('./utils.js')
const yargs = require('yargs');

const usage = "\nUsage: translate --path <file_path> --from <lang> --to <lang>";
const options = yargs
    .usage(usage)
    .option("path", {
        alias: "p",
        description: "Path to the PDF file",
        type: "string",
        demandOption: false,
    })
    .option("from", {
        alias: "f",
        description: "Source language (english, arabic...)",
        type: "string",
        demandOption: false })
    .option("to", {
        alias: "t",
        description: "Target language (english, arabic...)",
        type: "string",
        demandOption: false })    
    .option("l", {
        alias:"languages", 
        describe: "List all supported languages.", 
        type: "boolean", 
        demandOption: false })
    .option('tt', {
        alias: 'toTxt',
        description:'convert the pdf to text fiile',
        type: "boolean",
        demandOption: false,
    })                                                                   
    .help(true)
    .argv;

    yargs.command({
        command: 'extract',
        describe: 'Extract text from a PDF file',
        builder: {
          path: {
            alias: 'p',
            describe: 'Path to the PDF file',
            type: 'string',
            demandOption: true,
          },
          output: {
            alias: 'o',
            describe: 'Path to save the output .txt file',
            type: 'string',
            demand: false,
          },
        },
        handler(argv) {
          extractText(argv.path, argv.output);
        },
      });

if(yargs.argv.l == true || yargs.argv.languages == true){
    utils.showAll();
    return;
}

if (yargs.argv.tt === true || yargs.argv.toTxt === true) {
    if (!yargs.argv.p && !yargs.argv.path) {
      console.log('Provide the file path using -p or --path');
      process.exit(1);
    }
    const pdfPath = yargs.argv.p || yargs.argv.path;
    utils.extractText(pdfPath, "ouput.txt").catch(err => {
      console.error(err);
      process.exit(1);
    });
  }