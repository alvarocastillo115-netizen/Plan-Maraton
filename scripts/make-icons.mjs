// Genera los íconos PNG de la app sin dependencias externas (rasterizado simple + zlib).
// Uso: npm run icons
import { writeFileSync, mkdirSync } from "node:fs";
import { deflateSync } from "node:zlib";

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const BG = hex("#1E2F26"), GREEN = hex("#5C7A5C"), ORANGE = hex("#E4572E"), GOLD = hex("#C9A227"), BAND = hex("#3D6B4F"), ROAD = hex("#EEF1EC");

const inTri = (x, y, [a, b, c]) => {
  const s = (p, q, r) => (p[0] - r[0]) * (q[1] - r[1]) - (q[0] - r[0]) * (p[1] - r[1]);
  const d1 = s([x, y], a, b), d2 = s([x, y], b, c), d3 = s([x, y], c, a);
  const neg = d1 < 0 || d2 < 0 || d3 < 0, pos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(neg && pos);
};

// Escena en coordenadas 0..1 (la última capa que coincide gana)
function colorAt(x, y) {
  let c = BG;
  if ((x - 0.74) ** 2 + (y - 0.27) ** 2 < 0.075 ** 2) c = GOLD;
  if (inTri(x, y, [[0.06, 0.78], [0.32, 0.44], [0.6, 0.78]])) c = GREEN;
  if (inTri(x, y, [[0.26, 0.78], [0.56, 0.24], [0.94, 0.78]])) c = ORANGE;
  if (y >= 0.78) c = BAND;
  // carretera en perspectiva
  if (inTri(x, y, [[0.47, 0.78], [0.53, 0.78], [0.62, 1.0]]) || inTri(x, y, [[0.47, 0.78], [0.62, 1.0], [0.38, 1.0]])) c = ROAD;
  return c;
}

function png(size) {
  const SS = 4;
  const raw = Buffer.alloc((size * 3 + 1) * size);
  for (let py = 0; py < size; py++) {
    raw[py * (size * 3 + 1)] = 0;
    for (let px = 0; px < size; px++) {
      let r = 0, g = 0, b = 0;
      for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
        const c = colorAt((px + (sx + 0.5) / SS) / size, (py + (sy + 0.5) / SS) / size);
        r += c[0]; g += c[1]; b += c[2];
      }
      const o = py * (size * 3 + 1) + 1 + px * 3, n = SS * SS;
      raw[o] = Math.round(r / n); raw[o + 1] = Math.round(g / n); raw[o + 2] = Math.round(b / n);
    }
  }
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc = (buf) => {
    let c = 0xffffffff;
    for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const c = Buffer.alloc(4); c.writeUInt32BE(crc(td));
    return Buffer.concat([len, td, c]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

mkdirSync("public/icons", { recursive: true });
writeFileSync("public/icons/apple-touch-icon.png", png(180));
writeFileSync("public/icons/icon-192.png", png(192));
writeFileSync("public/icons/icon-512.png", png(512));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#1E2F26"/><circle cx="74" cy="27" r="7.5" fill="#C9A227"/><path d="M6 78 32 44 60 78Z" fill="#5C7A5C"/><path d="M26 78 56 24 94 78Z" fill="#E4572E"/><rect y="78" width="100" height="22" fill="#3D6B4F"/><path d="M47 78h6l9 22H38Z" fill="#EEF1EC"/></svg>`;
writeFileSync("public/icons/favicon.svg", svg);
console.log("Íconos generados en public/icons");
