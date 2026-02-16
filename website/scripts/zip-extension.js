/**
 * Creates a zip of the extension folder for download.
 * Run from website/ - zips ../extension into public/vocab-extender.zip
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const websiteDir = path.resolve(__dirname, "..");
const extensionDir = path.resolve(websiteDir, "..", "extension");
const outputZip = path.join(websiteDir, "public", "vocab-extender.zip");

// Ensure public dir exists
const publicDir = path.join(websiteDir, "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write version.json from extension manifest
const manifestPath = path.join(extensionDir, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const versionJson = path.join(publicDir, "version.json");
fs.writeFileSync(versionJson, JSON.stringify({ version: manifest.version }, null, 2));

if (!fs.existsSync(extensionDir)) {
  console.error("Extension folder not found at:", extensionDir);
  process.exit(1);
}

// Zip extension contents (manifest.json etc at root) so extract gives a folder ready for Load unpacked
const isWindows = process.platform === "win32";
try {
  if (isWindows) {
    execSync(
      `powershell -Command "Compress-Archive -Path '${extensionDir}\\*' -DestinationPath '${outputZip}' -Force"`,
      { stdio: "inherit" }
    );
  } else {
    execSync(
      `cd "${extensionDir}" && zip -r "${outputZip}" . -x "*.DS_Store" -x "*.git*"`,
      { stdio: "inherit" }
    );
  }
  console.log("Created vocab-extender.zip");
} catch (err) {
  console.error("Failed to create zip:", err.message);
  process.exit(1);
}
