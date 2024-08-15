const fs = require('fs');

const convertToJsonl = (data) => {
    const jsonlArray = [];
    const dataObj = JSON.parse(data);
    for (const [character, details] of Object.entries(dataObj)) {
        const romanization = details.romanization;
        const translations = details.translations;

        translations.forEach(translation => {
            const jsonlEntry = {
                prompt: translation,
                completion: `${character} (${romanization})`
            };
            jsonlArray.push(jsonlEntry);
        });
    }
    return jsonlArray.map(entry => JSON.stringify(entry)).join('\n');
};

const data = fs.readFileSync('./langpal/mapped-yue-by-frequency.json', 'utf8');
const jsonlString = convertToJsonl(data);

fs.writeFileSync('./langpal/finetune.jsonl', jsonlString);