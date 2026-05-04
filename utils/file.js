const fs = require('fs');

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function initializeDataDir(dataDir, filesConfig) {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  filesConfig.forEach(({ path: filePath, defaultData }) => {
    if (!fs.existsSync(filePath)) {
      writeJSON(filePath, defaultData);
    }
  });
}

module.exports = {
  readJSON,
  writeJSON,
  initializeDataDir
};
