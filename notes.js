const fs = require('fs');
const path = require('path');

function noteCreateNew(body, createArray) {
  const entry = body;
  createArray.push(entry);
  fs.writeFileSync(
    path.join(__dirname, "../db.json"),
    JSON.stringify({ notes: createArray }, null, 2)
  );
  return entry;
}

module.exports = { noteCreateNew };