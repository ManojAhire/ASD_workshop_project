const fs = require("node:fs/promises");
const path = require("node:path");

const databaseFilePath = path.join(__dirname, "..", "..", "db.json");

async function getAll() {
  const fileContents = await fs.readFile(databaseFilePath, "utf8");
  return JSON.parse(fileContents);
}

async function saveAll(products) {
  const fileContents = JSON.stringify(products, null, 2);
  await fs.writeFile(databaseFilePath, fileContents);
}

module.exports = { getAll, saveAll };