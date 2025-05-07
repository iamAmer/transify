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

async function sentence(sentence, fromLang, toLang) {
  const translatedSentence = await translate(sentence, { from: fromLang, to: toLang });
  return translatedSentence;
}

function showAll(){
  console.log(chalk.black.bgMagenta.bold("\nLanguage Name\t  Code"))
  for(let [key, value] of languages) {
    console.log(key.padEnd(20) + value);
  }
}

let languages = new Map();

languages.set('afrikaans',   'af')
languages.set('albanian',	   'sq')
languages.set('amharic',	   'am')
languages.set('arabic',	     'ar')
languages.set('armenian',	   'hy')
languages.set('azerbaijani', 'az')
languages.set('basque',	        'eu')
languages.set('belarusian',	'be')
languages.set('bengali',	'bn')
languages.set('bosnian',	'bs')
languages.set('bulgarian',	'bg')
languages.set('catalan',	'ca')
languages.set('cebuano',	'ceb')
languages.set('chinese',        'zh')
languages.set('corsican',	'co')
languages.set('croatian',	'hr')
languages.set('czech',	        'cs')
languages.set('danish',	        'da')
languages.set('dutch',	        'nl')
languages.set('english',	'en')
languages.set('esperanto',	'eo')
languages.set('estonian',	'et')
languages.set('finnish',	'fi')
languages.set('french',	        'fr')
languages.set('frisian',	'fy')
languages.set('galician',	'gl')
languages.set('georgian',	'ka')
languages.set('german',	        'de')
languages.set('greek',	        'el')
languages.set('gujarati',	'gu')
languages.set('haitian creole', 'ht')
languages.set('hausa',	        'ha')
languages.set('hawaiian',	'haw') // (iso-639-2)
languages.set('hebrew',	        'he') //or iw
languages.set('hindi',	        'hi')
languages.set('hmong',	        'hmn') //(iso-639-2)
languages.set('hungarian',	'hu')
languages.set('icelandic',	'is')
languages.set('igbo',	        'ig')
languages.set('indonesian',	'id')
languages.set('irish',	        'ga')
languages.set('italian',	'it')
languages.set('japanese',	'ja')
languages.set('javanese',	'jv')
languages.set('kannada',	'kn')
languages.set('kazakh',	        'kk')
languages.set('khmer',	        'km')
languages.set('kinyarwanda',	'rw')
languages.set('korean',	        'ko')
languages.set('kurdish',	'ku')
languages.set('kyrgyz',	        'ky')
languages.set('lao',	        'lo')
languages.set('latin',	        'la')
languages.set('latvian',	'lv')
languages.set('lithuanian',	'lt')
languages.set('luxembourgish',	'lb')
languages.set('macedonian',	'mk')
languages.set('malagasy',	'mg')
languages.set('malay',	        'ms')
languages.set('malayalam',	'ml')
languages.set('maltese',	'mt')
languages.set('maori',	        'mi')
languages.set('marathi',	'mr')
languages.set('mongolian',	'mn')
languages.set('burmese',	'my')
languages.set('nepali',	        'ne')
languages.set('norwegian',	'no')
languages.set('nyanja',	        'ny')
languages.set('odia',	        'or')
languages.set('pashto',	        'ps')
languages.set('persian',	'fa')
languages.set('polish',	        'pl')
languages.set('portuguese',	'pt')
languages.set('punjabi',	'pa')
languages.set('romanian',	'ro')
languages.set('russian',	'ru')
languages.set('samoan',	        'sm')
languages.set('scots',          'gd')
languages.set('serbian',	'sr')
languages.set('sesotho',	'st')
languages.set('shona',	        'sn')
languages.set('sindhi',	        'sd')
languages.set('sinhalese',	'si')
languages.set('slovak',	        'sk')
languages.set('slovenian',	'sl')
languages.set('somali',	        'so')
languages.set('spanish',	'es')
languages.set('sundanese',	'su')
languages.set('swahili',	'sw')
languages.set('swedish',	'sv')
languages.set('tagalog',	'tl')
languages.set('tajik',	        'tg')
languages.set('tamil',	        'ta')
languages.set('tatar',	        'tt')
languages.set('telugu',	        'te')
languages.set('thai',	        'th')
languages.set('turkish',	'tr')
languages.set('turkmen',	'tk')
languages.set('ukrainian',	'uk')
languages.set('urdu',	        'ur')
languages.set('uyghur',	        'ug')
languages.set('uzbek',	        'uz')
languages.set('vietnamese',	'vi')
languages.set('welsh',	        'cy')
languages.set('xhosa',	        'xh')
languages.set('yiddish',        'yi')
languages.set('yoruba',	        'yo')
languages.set('zulu',   	'zu') 

module.exports = { 
  showAll: showAll, 
  extractText, extractText,
  readAndTranslate: readAndTranslate,
  sentence: sentence,
  languages: languages,
};