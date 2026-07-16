const fs = require("fs/promises");
const path = require("path");

/**
 * Minimal JSON-file persistence layer. Good enough for a portfolio
 * guestbook without provisioning a database, and easy to swap out:
 * replace the read/write calls in services/commentService.js with
 * MongoDB/PostgreSQL calls when you're ready to scale.
 */
class JsonStore {
  constructor(fileName) {
    this.filePath = path.join(__dirname, "..", "data", fileName);
  }

  async read() {
    try {
      const raw = await fs.readFile(this.filePath, "utf-8");
      const trimmed = raw.trim();

      if (!trimmed) return [];

      try {
        return JSON.parse(trimmed);
      } catch (parseErr) {
        console.error(
          `[JsonStore] Failed to parse ${this.filePath}:`,
          parseErr.message,
        );
        return [];
      }
    } catch (err) {
      if (err.code === "ENOENT") return [];
      throw err;
    }
  }

  async write(data) {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), "utf-8");
  }
}

module.exports = JsonStore;
