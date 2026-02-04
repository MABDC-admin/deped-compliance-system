const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads');

// Ensure directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const saveFile = (filename, buffer) => {
    const filePath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filePath, buffer);
    return filePath;
};

const getFilePath = (filename) => {
    return path.join(UPLOADS_DIR, filename);
};

module.exports = {
    saveFile,
    getFilePath,
    UPLOADS_DIR
};
