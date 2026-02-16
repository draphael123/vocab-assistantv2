/**
 * Generates extension icons (16, 32, 48, 128) as teal PNGs
 * Run from extension folder: npm run generate-icons
 */
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const sizes = [16, 32, 48, 128];
const color = { r: 30, g: 95, b: 116 }; // #1E5F74 (teal, matches website)

function createPNG(size) {
  const png = new PNG({ width: size, height: size, filterType: -1 });
  const pad = Math.max(2, Math.floor(size * 0.12));
  const cx = size / 2;
  const cy = size / 2;
  const r = Math.min(cx, cy) - pad;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;
      const dx = x - cx;
      const dy = y - cy;
      const inCircle = dx * dx + dy * dy <= r * r;
      png.data[idx] = inCircle ? color.r : 250;
      png.data[idx + 1] = inCircle ? color.g : 248;
      png.data[idx + 2] = inCircle ? color.b : 246;
      png.data[idx + 3] = 255;
    }
  }
  return png;
}

async function main() {
  const iconsDir = path.join(__dirname, "..", "icons");
  if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

  for (const size of sizes) {
    const png = createPNG(size);
    const file = path.join(iconsDir, `icon${size}.png`);
    await new Promise((resolve, reject) => {
      png.pack().pipe(fs.createWriteStream(file)).on("finish", resolve).on("error", reject);
    });
    console.log(`Created icon${size}.png`);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
