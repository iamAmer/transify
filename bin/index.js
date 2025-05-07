#! /usr/bin/env node
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
    handler: async(argv) => {
      try {
        if(!argv.path) {
          throw new Error('Input PDF path is required');
        }
    
        if (!utils.fs.existsSync(argv.path)) {
          throw new Error(`Input file not found: ${argv.path}`);
        }

        console.log(utils.chalk.blue('\nProcessing PDF...'));

        const extractedTextPath = utils.path.resolve(await utils.extractText(argv.path));        
        // console.log('Path of raw text', utils.path.resolve(extractedTextPath))
        console.log(utils.chalk.blue('\nTranslating text...'));
        await utils.readAndTranslate(extractedTextPath, argv.f, argv.t);
        console.log(utils.chalk.bold.green('\nAll operations completed successfully!'));
    
      } catch (err) {
        console.error(utils.chalk.red('\nError:', err.message));
        process.exit(1);
      }
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
        console.error(utils.chalk.red('\nError:', err.message));
        process.exit(1);
      }
    }
  })
  .command({
    command: 'sentence',
    describe: 'Translate a sentence',
    builder: (yargs) => {
      return yargs
        .option('s', {
          alias: 'sentence',
          describe: 'The sentence to be translated',
          type: "string",
          demandOption: true,
        })
        .option('f', {
          alias: 'from',
          describe: 'Souce Language',
          type: 'string',
          demandOption: true,
        })
        .option('t', {
          alias: 'to',
          describe: 'Target Language',
          type: 'string',
          demandOption: true,
        })
    },
    handler: async (argv) => {
      try {
        const result = await utils.sentence(argv.sentence, argv.f, argv.t);
        console.log(result);
      } catch (err) {
        console.error(utils.chalk.red('\nError:', err.message));
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