// JSONBin.io Configuration
// SIGN UP: https://jsonbin.io
// 1. Create an account
// 2. Create a new Bin with this content: {"scores":[]}
// 3. Copy the Bin ID and API Key below

const JSONBIN_CONFIG = {
    BIN_ID: '69f4d5ec856a68218995a2ff',
    API_KEY: '$2a$10$dvCxBXWpINfDc0BG7qGiluSIyRkwtFe4uOisu0tB08t0HAChDsZra'
};

// API endpoints
const JSONBIN_BASE = 'https://api.jsonbin.io/v3/b';
const READ_URL = () => `${JSONBIN_BASE}/${JSONBIN_CONFIG.BIN_ID}/latest`;
const WRITE_URL = () => `${JSONBIN_BASE}/${JSONBIN_CONFIG.BIN_ID}`;

// Headers for requests
function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_CONFIG.API_KEY
    };
}

// Check if JSONBin is configured
function isJsonBinConfigured() {
    return JSONBIN_CONFIG.BIN_ID !== 'YOUR_BIN_ID' && 
           JSONBIN_CONFIG.API_KEY !== 'YOUR_API_KEY';
}
