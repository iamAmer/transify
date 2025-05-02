const fs = require('fs');
const chalk = require('chalk');
const pdf = require('pdf-parse');
const path = require('path');

async function extractText(pdfPath) {
  try {
    const dir = path.dirname(pdfPath);
    const filename = path.basename(pdfPath, path.extname(pdfPath));
    
    const outputPath = path.join(dir, `${filename}.txt`);

    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    
    fs.writeFileSync(outputPath, data.text);
    console.log(`Text extracted to: ${outputPath}`);
  } catch (err) {
    console.error(`Error extracting text: ${err.message}`);
    process.exit(1);
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

module.exports = { showAll: showAll, extractText, extractText};