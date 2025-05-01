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
        demandOption: true,
    })
    .option("from", {
        alias: "f",
        description: "Source language (english, arabic...)",
        type: "string",
        demandOption: true })
    .option("to", {
        alias: "t",
        description: "Target language (english, arabic...)",
        type: "string",
        demandOption: true })    
    .option("l", {
        alias:"languages", 
        describe: "List all supported languages.", 
        type: "boolean", 
        demandOption: false })                                                                        
    .help(true)
    .argv;
