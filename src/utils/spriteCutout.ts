/**
 * Utility to remove plain/solid backgrounds from isolated 3D sprite renders
 * using flood-fill and edge alpha anti-aliasing on HTML5 Canvas.
 */

const spriteCache = new Map<string, string>();
const inFlightCache = new Map<string, Promise<string>>();

export function getCutoutSprite(src: string): Promise<string> {
  if (spriteCache.has(src)) {
    return Promise.resolve(spriteCache.get(src)!);
  }

  if (inFlightCache.has(src)) {
    return inFlightCache.get(src)!;
  }

  const promise = new Promise<string>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          spriteCache.set(src, src);
          resolve(src);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const width = canvas.width;
        const height = canvas.height;

        // Sample background color from corners
        const cornerSamples = [
          getPixel(data, 0, 0, width),
          getPixel(data, width - 1, 0, width),
          getPixel(data, 0, height - 1, width),
          getPixel(data, width - 1, height - 1, width),
          getPixel(data, Math.floor(width / 2), 0, width),
          getPixel(data, 0, Math.floor(height / 2), width),
        ];

        // Average background color
        const avgBg = cornerSamples.reduce(
          (acc, c) => ({
            r: acc.r + c.r / cornerSamples.length,
            g: acc.g + c.g / cornerSamples.length,
            b: acc.b + c.b / cornerSamples.length,
          }),
          { r: 0, g: 0, b: 0 }
        );

        // Flood fill from outer perimeter
        const visited = new Uint8Array(width * height);
        const queue: number[] = [];

        // Helper to check if pixel matches background or light studio floor shadow
        const isBgColor = (idx: number) => {
          const r = data[idx * 4];
          const g = data[idx * 4 + 1];
          const b = data[idx * 4 + 2];

          // High brightness background detection (plain white / light gray studio background)
          const isLight = r > 210 && g > 210 && b > 210 && Math.abs(r - g) < 22 && Math.abs(g - b) < 22;
          
          // Distance from corner sample average
          const dist = Math.sqrt(
            Math.pow(r - avgBg.r, 2) +
            Math.pow(g - avgBg.g, 2) +
            Math.pow(b - avgBg.b, 2)
          );

          // Studio ground shadow detection near bottom (neutral low-saturation gray shadow on plain floor)
          const py = Math.floor(idx / width);
          const isBottomShadow =
            py > height * 0.72 &&
            r > 160 &&
            g > 160 &&
            b > 160 &&
            Math.abs(r - g) < 14 &&
            Math.abs(g - b) < 14 &&
            Math.abs(r - b) < 14;

          return isLight || dist < 48 || isBottomShadow;
        };

        // Push perimeter pixels to queue
        for (let x = 0; x < width; x++) {
          queue.push(x); // top row (y = 0)
          queue.push((height - 1) * width + x); // bottom row
        }
        for (let y = 0; y < height; y++) {
          queue.push(y * width); // left col (x = 0)
          queue.push(y * width + (width - 1)); // right col
        }

        // BFS Flood fill
        let head = 0;
        while (head < queue.length) {
          const curr = queue[head++];
          if (visited[curr]) continue;
          visited[curr] = 1;

          if (isBgColor(curr)) {
            // Make completely transparent
            data[curr * 4 + 3] = 0;

            const cx = curr % width;
            const cy = Math.floor(curr / width);

            // Check 4 neighbors
            if (cx > 0 && !visited[curr - 1]) queue.push(curr - 1);
            if (cx < width - 1 && !visited[curr + 1]) queue.push(curr + 1);
            if (cy > 0 && !visited[curr - width]) queue.push(curr - width);
            if (cy < height - 1 && !visited[curr + width]) queue.push(curr + width);
          }
        }

        // Defringe and soft edge antialiasing pass
        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const idx = y * width + x;
            if (data[idx * 4 + 3] > 0) {
              // Count transparent neighbors
              let transNeighbors = 0;
              if (data[(idx - 1) * 4 + 3] === 0) transNeighbors++;
              if (data[(idx + 1) * 4 + 3] === 0) transNeighbors++;
              if (data[(idx - width) * 4 + 3] === 0) transNeighbors++;
              if (data[(idx + width) * 4 + 3] === 0) transNeighbors++;

              if (transNeighbors >= 2) {
                // Soften border alpha
                data[idx * 4 + 3] = Math.floor(data[idx * 4 + 3] * 0.65);

                // Defringe white matte contamination from edges
                const r = data[idx * 4];
                const g = data[idx * 4 + 1];
                const b = data[idx * 4 + 2];
                if (r > 200 && g > 200 && b > 200) {
                  // If edge pixel was blended with white background, reduce brightness to restore subject color
                  data[idx * 4] = Math.max(0, r - 35);
                  data[idx * 4 + 1] = Math.max(0, g - 35);
                  data[idx * 4 + 2] = Math.max(0, b - 35);
                }
              } else if (transNeighbors === 1) {
                data[idx * 4 + 3] = Math.floor(data[idx * 4 + 3] * 0.88);
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const resultDataUrl = canvas.toDataURL('image/png');
        spriteCache.set(src, resultDataUrl);
        inFlightCache.delete(src);
        resolve(resultDataUrl);
      } catch (err) {
        console.error('Error processing cutout sprite:', err);
        spriteCache.set(src, src);
        inFlightCache.delete(src);
        resolve(src);
      }
    };

    img.onerror = () => {
      spriteCache.set(src, src);
      inFlightCache.delete(src);
      resolve(src);
    };

    img.src = src;
  });

  inFlightCache.set(src, promise);
  return promise;
}

function getPixel(data: Uint8ClampedArray, x: number, y: number, width: number) {
  const idx = (y * width + x) * 4;
  return {
    r: data[idx],
    g: data[idx + 1],
    b: data[idx + 2],
    a: data[idx + 3],
  };
}
