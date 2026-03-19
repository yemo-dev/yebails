const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function updateVersion() {
    const { data } = await axios.get('https://web.whatsapp.com/sw.js', {
        headers: {
            'sec-fetch-site': 'none',
            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
        }
    });

    const regex = /\\?"client_revision\\?":\s*(\d+)/;
    const match = data.match(regex);
    if (!match) throw new Error('Could not find client_revision string in sw.js response');
    
    const clientRevision = match[1];
    const newVersion = [2, 3000, parseInt(clientRevision)];
    console.log('Fetched WA Version:', newVersion);

    const jsonPath = path.resolve(__dirname, '../lib/Defaults/yebails-version.json');
    if (fs.existsSync(jsonPath)) {
        fs.writeFileSync(jsonPath, JSON.stringify({ version: newVersion }));
        console.log('Updated JSON File:', jsonPath);
    }

    const indexPath = path.resolve(__dirname, '../lib/Defaults/index.js');
    if (fs.existsSync(indexPath)) {
        let indexContent = fs.readFileSync(indexPath, 'utf-8');
        indexContent = indexContent.replace(/exports\.version\s*=\s*\[\d+,\s*\d+,\s*\d+\];/, `exports.version = [${newVersion.join(', ')}];`);
        fs.writeFileSync(indexPath, indexContent);
        console.log('Updated Index File:', indexPath);
    }
}

updateVersion().catch(err => {
    console.error('Failed to update version:', err);
    process.exit(1);
});
