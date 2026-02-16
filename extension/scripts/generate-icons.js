/**
 * Generates extension icons (16, 32, 48, 128) — Vocab "V" on teal
 * Run from extension folder: npm run generate-icons
 */
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const sizes = [16, 32, 48, 128];
const teal = { r: 30, g: 95, b: 116 }; // #1E5F74
const cream = { r: 250, g: 248, b: 246 }; // #FAF8F6

function setPixel(png, x, y, c) {
  if (x < 0 || x >= png.width || y < 0 || y >= png.height) return;
  const idx = (png.width * y + x) << 2;
  png.data[idx] = c.r;
  png.data[idx + 1] = c.g;
  png.data[idx + 2] = c.b;
  png.data[idx + 3] = 255;
}

function drawLine(png, x0, y0, x1, y1, c, stroke = 1) {
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  const r = Math.max(1, Math.floor(stroke / 2));
  while (true) {
    for (let rx = -r; rx <= r; rx++)
      for (let ry = -r; ry <= r; ry++)
        if (rx * rx + ry * ry <= r * r) setPixel(png, x0 + rx, y0 + ry, c);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x0 += sx; }
    if (e2 < dx) { err += dx; y0 += sy; }
  }
}

function createPNG(size) {
  const png = new PNG({ width: size, height: size, filterType: -1 });
  const pad = Math.max(2, Math.floor(size * 0.1));
  const cx = size / 2;
  const cy = size / 2;
  const r = Math.min(cx, cy) - pad;

  // Background: teal rounded square
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;
      const dx = x - cx;
      const dy = y - cy;
      const inShape = dx * dx + dy * dy <= r * r;
      png.data[idx] = inShape ? teal.r : cream.r;
      png.data[idx + 1] = inShape ? teal.g : cream.g;
      png.data[idx + 2] = inShape ? teal.b : cream.b;
      png.data[idx + 3] = 255;
    }
  }

  // Stylized "V" for Vocab
  const stroke = Math.max(1.2, size * 0.14);
  const margin = Math.floor(size * 0.22);
  const vTop = margin;
  const vBottom = size - margin;
  const vCenterX = cx;
  const vLeftX = margin;
  const vRightX = size - margin;
  drawLine(png, vLeftX, vTop, vCenterX, vBottom, cream, stroke);
  drawLine(png, vCenterX, vBottom, vRightX, vTop, cream, stroke);

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
