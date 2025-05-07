const fs = require('fs');
const chalk = require('chalk');
const pdf = require('pdf-parse');
const path = require('path');
const translate = require('translate-google')
const readline = require('readline');
const { SentenceTokenizer } = require('natural');
const tokenizer = new SentenceTokenizer();

async function extractText(pdfPath) {
  try {
    const dir = path.dirname(pdfPath);
    const filename = path.basename(pdfPath, path.extname(pdfPath));
    
    const outputPath = path.join(dir, `${filename}.txt`);

    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    
    const sentences = tokenizer.tokenize(data.text).join('\n');

    fs.writeFileSync(outputPath, sentences);
    console.log(chalk.green('Text extraction completed'));

    return outputPath;

  } catch (err) {
    console.error(`Error extracting text: ${err.message}`);
    process.exit(1);
  }
}

async function readAndTranslate(filePath, fromLang, toLang) {
    const linesPerChunk = 50;
    const dir = path.dirname(filePath);
    const filename = path.basename(filePath, path.extname(filePath));
    const outputPath = path.join(dir, `Translated_${filename}.txt`);

    if (fs.existsSync(outputPath)) {
        fs.writeFileSync(outputPath, '', 'utf8');
    }

    const fileStream = fs.createReadStream(filePath, { 
      encoding: 'utf8',
      highWaterMark: 1024 * 1024
    });

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lines = [];
    let chunkCount = 0;

    for await (const line of rl) {
        lines.push(line);
        
        if (lines.length >= linesPerChunk) {
            await processChunk(lines.join('\n'), fromLang, toLang, outputPath, ++chunkCount);
            lines = [];
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    if (lines.length > 0) {
        await processChunk(lines.join('\n'), fromLang, toLang, outputPath, ++chunkCount);
    }
    console.log(chalk.green('Translation completed'));
}

async function processChunk(text, fromLang, toLang, outputPath, chunkNumber) {
    console.log(`Processing chunk ${chunkNumber}...`);
    try {
        const translated = await translate(text, { from: fromLang, to: toLang });
        fs.appendFileSync(outputPath, translated + '\n', 'utf8');
        console.log(`Chunk ${chunkNumber} translated successfully`);
    } catch (err) {
        console.error(`Error translating chunk ${chunkNumber}:`, err);
        fs.appendFileSync(outputPath, `[UNTRANSLATED CHUNK ${chunkNumber}]\n${text}\n`, 'utf8');
    }
}

function showAll(){
  console.log(chalk.black.bgMagenta.bold("\nLanguage Name\tCode"))
  for(let [key, value] of languages) {
    console.log(key + "\t\t" + value + "\n")
  }
}

let languages = new Map();
languages.set('arabic', 'ar')   
languages.set('english', 'en')  

module.exports = { 
  showAll: showAll, 
  extractText, extractText,
  readAndTranslate: readAndTranslate,
  languages: languages,
};