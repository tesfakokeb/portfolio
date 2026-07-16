const fs = require('fs/promises');
const path = require('path');

async function readJson(fileName) {
  const filePath = path.join(__dirname, '..', 'data', fileName);
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

async function getProjects() {
  return readJson('projects.json');
}

async function getPublications() {
  return readJson('publications.json');
}

module.exports = { getProjects, getPublications };
