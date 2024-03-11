const fs = require("fs");

function readSettings(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      if (fileContent) {
        return JSON.parse(fileContent);
      }
    }
    return {};
  } catch (error) {
    console.error("Error reading settings from " + filePath + ":", error);
    return {};
  }
}

function writeSettings(filePath, settings) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), {
      encoding: "utf8",
    });
  } catch (error) {
    console.error("Error writing settings to " + filePath + ":", error);
  }
}

module.exports = { readSettings, writeSettings };
