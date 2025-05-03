#! /usr/bin/env node
console.log("Hello World!");

const utils = require('./utils.js')
const yargs = require('yargs');

// const usage = "\nUsage: translate --path <file_path> --from <lang> --to <lang>";
yargs
  .option("l", {
    alias:"languages", 
    describe: "List all supported languages.", 
    type: "boolean", 
    demandOption: false 
  })
  .command({
    command: 'translate',
    describe: 'Translate text from one language to another',
    builder: (yargs) => {
      return yargs
        .option('p', {
          alias: 'path',
          describe: 'Path to the PDF file',
          type: 'string',
          demandOption: true,
        })
        .option('f', {
          alias: 'from',
          describe: 'Source language (english, arabic...)',
          type: 'string',
          demandOption: true,
        })
        .option('t', {
          alias: 'to',
          describe: 'Target language (english, arabic...)',
          type: 'string',
          demandOption: true,
        })
    },
    handler: (argv) => {
      // for later use
      // utils.translate();
    }
  })    
  .command({
    command: 'extract',
    describe: 'Extract text from a PDF file',
    builder: (yargs) => {
      return yargs
        .option('p', {
          alias: 'path',
          describe: 'Path to the PDF file',
          type: 'string',
          demandOption: true,
        })
    },
    handler: async (argv) => {
      try {
        await utils.extractText(argv.path, argv.output);
      } catch (err) {
        console.error(chalk.red('\nError:', err.message));
        process.exit(1);
      }
    }
  })
  .middleware((argv) => {
    if (argv.l || argv.languages) {
      utils.showAll();
      process.exit(0);
    }
  })                                                          
  .help(true)
  .argv;