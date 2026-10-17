const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function removeBlackBackground() {
  const inputPath = path.join(__dirname, 'assets', 'images', 'agrointel-mockup-completo.jpg');
  const outputPath = path.join(__dirname, 'assets', 'images', 'agrointel-mockup-completo.png');

  const { data, info } = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  console.log(`Processing image: ${width}x${height}`);

  // Create RGBA buffer
  const rgba = Buffer.alloc(width * height * 4);
  const visited = new Uint8Array(width * height);
  const isBg = new Uint8Array(width * height);

  // Queue for flood fill from all borders
  // We can use a 32-bit typed array for the queue for speed and memory efficiency
  const queue = new Int32Array(width * height);
  let qHead = 0;
  let qTail = 0;

  function pushPixel(x, y) {
    const idx = y * width + x;
    if (!visited[idx]) {
      visited[idx] = 1;
      queue[qTail++] = idx;
    }
  }

  // Push all 4 outer border pixels
  for (let x = 0; x < width; x++) {
    pushPixel(x, 0);
    pushPixel(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    pushPixel(0, y);
    pushPixel(width - 1, y);
  }

  const blackThreshold = 18; // values below or equal to 18 are considered background black

  while (qHead < qTail) {
    const idx = queue[qHead++];
    const x = idx % width;
    const y = Math.floor(idx / width);

    const pIdx = idx * 3;
    const r = data[pIdx];
    const g = data[pIdx + 1];
    const b = data[pIdx + 2];
    const maxVal = Math.max(r, g, b);

    if (maxVal <= blackThreshold) {
      isBg[idx] = 1; // It is background!

      // Check 4-connected neighbors
      if (x > 0 && !visited[idx - 1]) {
        visited[idx - 1] = 1;
        queue[qTail++] = idx - 1;
      }
      if (x < width - 1 && !visited[idx + 1]) {
        visited[idx + 1] = 1;
        queue[qTail++] = idx + 1;
      }
      if (y > 0 && !visited[idx - width]) {
        visited[idx - width] = 1;
        queue[qTail++] = idx - width;
      }
      if (y < height - 1 && !visited[idx + width]) {
        visited[idx + width] = 1;
        queue[qTail++] = idx + width;
      }
    }
  }

  console.log(`Flood fill complete. Background pixels marked: ${qTail}`);

  // Now build RGBA output
  // For pixels marked as background -> Alpha = 0
  // For border pixels that touch background and have low brightness (edge anti-aliasing) -> smooth alpha
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const srcIdx = idx * 3;
      const dstIdx = idx * 4;

      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];

      if (isBg[idx]) {
        rgba[dstIdx] = 0;
        rgba[dstIdx + 1] = 0;
        rgba[dstIdx + 2] = 0;
        rgba[dstIdx + 3] = 0; // Fully transparent!
      } else {
        // Check if it's an edge pixel next to background with low brightness
        const maxVal = Math.max(r, g, b);
        let touchesBg = false;
        if (
          (x > 0 && isBg[idx - 1]) ||
          (x < width - 1 && isBg[idx + 1]) ||
          (y > 0 && isBg[idx - width]) ||
          (y < height - 1 && isBg[idx + width])
        ) {
          touchesBg = true;
        }

        if (touchesBg && maxVal < 45) {
          // Soft anti-alias alpha ramp
          const alpha = Math.min(255, Math.max(0, Math.round(((maxVal - blackThreshold) / (45 - blackThreshold)) * 255)));
          rgba[dstIdx] = r;
          rgba[dstIdx + 1] = g;
          rgba[dstIdx + 2] = b;
          rgba[dstIdx + 3] = alpha;
        } else {
          rgba[dstIdx] = r;
          rgba[dstIdx + 1] = g;
          rgba[dstIdx + 2] = b;
          rgba[dstIdx + 3] = 255; // Fully opaque!
        }
      }
    }
  }

  await sharp(rgba, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
  .png({ compressionLevel: 9 })
  .toFile(outputPath);

  console.log(`Saved transparent PNG to ${outputPath}. Size: ${fs.statSync(outputPath).size} bytes`);
}

removeBlackBackground().catch(console.error);
