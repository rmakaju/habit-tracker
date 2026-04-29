const fs = require('fs');
const path = require('path');
const { deflateSync } = require('zlib');

const size = 256;
const outPath = path.join(__dirname, '..', 'assets', 'favicon.png');

const data = Buffer.alloc(size * size * 4);

const lerp = (a, b, t) => Math.round(a + (b - a) * t);

const setPixel = (x, y, r, g, b, a = 255) => {
  if (x < 0 || y < 0 || x >= size || y >= size) return;
  const idx = (y * size + x) * 4;
  data[idx] = r;
  data[idx + 1] = g;
  data[idx + 2] = b;
  data[idx + 3] = a;
};

const blendPixel = (x, y, r, g, b, a = 255) => {
  if (x < 0 || y < 0 || x >= size || y >= size) return;
  const idx = (y * size + x) * 4;
  const alpha = a / 255;
  data[idx] = Math.round(data[idx] * (1 - alpha) + r * alpha);
  data[idx + 1] = Math.round(data[idx + 1] * (1 - alpha) + g * alpha);
  data[idx + 2] = Math.round(data[idx + 2] * (1 - alpha) + b * alpha);
  data[idx + 3] = 255;
};

const drawCircle = (cx, cy, radius, r, g, b, a = 255) => {
  const r2 = radius * radius;
  for (let y = -radius; y <= radius; y++) {
    for (let x = -radius; x <= radius; x++) {
      if (x * x + y * y <= r2) {
        blendPixel(cx + x, cy + y, r, g, b, a);
      }
    }
  }
};

const drawLine = (x1, y1, x2, y2, thickness, r, g, b, a = 255) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  for (let i = 0; i <= steps; i++) {
    const t = steps === 0 ? 0 : i / steps;
    const x = Math.round(x1 + dx * t);
    const y = Math.round(y1 + dy * t);
    drawCircle(x, y, Math.floor(thickness / 2), r, g, b, a);
  }
};

const drawWavyCircle = (cx, cy, baseRadius, waveCount, waveAmplitude, thickness, r, g, b, a = 255) => {
  const steps = 360;
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const radius = baseRadius + Math.sin(t * waveCount) * waveAmplitude;
    const x = Math.round(cx + Math.cos(t) * radius);
    const y = Math.round(cy + Math.sin(t) * radius);
    drawCircle(x, y, Math.floor(thickness / 2), r, g, b, a);
  }
};

const drawBadge = (cx, cy, baseRadius, r, g, b, a = 255) => {
  drawWavyCircle(cx, cy, baseRadius, 10, 3, 10, r, g, b, a);
  drawCircle(cx, cy, baseRadius - 6, r, g, b, a);
};

const drawRingSegment = (cx, cy, innerR, outerR, startDeg, endDeg, color) => {
  const start = (startDeg * Math.PI) / 180;
  const end = (endDeg * Math.PI) / 180;
  const rMin = innerR * innerR;
  const rMax = outerR * outerR;
  const minX = Math.floor(cx - outerR);
  const maxX = Math.ceil(cx + outerR);
  const minY = Math.floor(cy - outerR);
  const maxY = Math.ceil(cy + outerR);

  const angleInRange = (angle) => {
    const a = (angle + Math.PI * 2) % (Math.PI * 2);
    const s = (start + Math.PI * 2) % (Math.PI * 2);
    const e = (end + Math.PI * 2) % (Math.PI * 2);
    if (s <= e) {
      return a >= s && a <= e;
    }
    return a >= s || a <= e;
  };

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist2 = dx * dx + dy * dy;
      if (dist2 < rMin || dist2 > rMax) {
        continue;
      }
      const angle = Math.atan2(dy, dx);
      if (angleInRange(angle)) {
        blendPixel(x, y, color[0], color[1], color[2], color[3]);
      }
    }
  }
};

for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    setPixel(x, y, 245, 238, 228, 255);
  }
}

const center = size / 2;
const palette = [
  [211, 228, 205, 255],
  [153, 164, 153, 255],
  [242, 221, 193, 255],
  [226, 194, 185, 255],
];

const rings = [
  { inner: 38, outer: 54 },
  { inner: 58, outer: 74 },
  { inner: 78, outer: 94 },
  { inner: 98, outer: 114 },
];

const segments = 28;
const gap = 4;
const openGap = 54;
const sweep = (360 - openGap) / segments;

rings.forEach((ring, ringIndex) => {
  const color = palette[ringIndex % palette.length];
  for (let i = 0; i < segments; i++) {
    const start = i * sweep + openGap / 2 + gap / 2;
    const end = start + sweep - gap;
    drawRingSegment(center, center, ring.inner, ring.outer, start, end, color);
  }
});

drawBadge(center, center, 26, 187, 133, 136, 255);
drawLine(center - 8, center + 2, center - 1, center + 9, 8, 255, 255, 255, 255);
drawLine(center - 1, center + 9, center + 14, center - 6, 8, 255, 255, 255, 255);

const crcTable = (() => {
  const table = new Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

const crc32 = (buf) => {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
};

const chunk = (type, chunkData) => {
  const typeBuf = Buffer.from(type);
  const lengthBuf = Buffer.alloc(4);
  lengthBuf.writeUInt32BE(chunkData.length, 0);
  const crcBuf = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuf, chunkData]));
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([lengthBuf, typeBuf, chunkData, crcBuf]);
};

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(size, 0);
ihdr.writeUInt32BE(size, 4);
ihdr[8] = 8;
ihdr[9] = 6;
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

const raw = Buffer.alloc((size * 4 + 1) * size);
for (let y = 0; y < size; y++) {
  const rowStart = y * (size * 4 + 1);
  raw[rowStart] = 0;
  data.copy(raw, rowStart + 1, y * size * 4, (y + 1) * size * 4);
}

const idat = deflateSync(raw);
const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const png = Buffer.concat([
  signature,
  chunk('IHDR', ihdr),
  chunk('IDAT', idat),
  chunk('IEND', Buffer.alloc(0)),
]);

fs.writeFileSync(outPath, png);
console.log('Wrote', outPath);
