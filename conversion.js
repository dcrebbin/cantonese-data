const fs = require('fs');

function convertCSVToJSON(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');
  
  const charIndex = headers.indexOf('char');
  const jpIndex = headers.indexOf('jp');
  const engIndex = headers.indexOf('eng');
  const result = {};
  
  lines.slice(1).forEach(line => {
    const values = line.split(',');
    const char = values[charIndex];
    const romanization = values[jpIndex];
    const translation = values[engIndex];
    
    if (result[char]) {
      if (!result[char].translations.includes(translation)) {
        result[char].translations.push(translation);
      }
    } else {
      result[char] = {
        romanization: romanization,
        translations: [translation]
      };
    }
  });
  
  return result;
}

function splitAndSaveFiles(data, numSplits) {
  const entries = Object.entries(data);
  const itemsPerFile = Math.ceil(entries.length / numSplits);
  
  for (let i = 0; i < numSplits; i++) {
    const start = i * itemsPerFile;
    const end = Math.min((i + 1) * itemsPerFile, entries.length);
    const chunk = Object.fromEntries(entries.slice(start, end));
    const content = JSON.stringify(chunk, null, 2);
    
    fs.writeFile(`./langpal/split-data/split-list-${i + 1}.json`, content, (err) => {
      if (err) {
        console.error(`Error writing file split-list-${i + 1}.json:`, err);
      } else {
        console.log(`File split-list-${i + 1}.json written successfully`);
      }
    });
  }
}

const numberOfSplits = 5;
const csvDataPath = './words.hk/Word List (Graded, with Translations) - Full_20211207.csv';

fs.readFile(csvDataPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  const processedData = convertCSVToJSON(data);
  splitAndSaveFiles(processedData, numberOfSplits);
  const fullListContent = JSON.stringify(processedData, null, 2);  // Pretty print with 2 spaces
  fs.writeFile('./langpal/mapped-yue-by-frequency.json', fullListContent, (err) => {
    if (err) {
      console.error('Error writing the full file:', err);
    } else {
      console.log('File written successfully');
    }
  });
});