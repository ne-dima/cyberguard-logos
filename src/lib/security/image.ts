export type ImageKind = "jpeg" | "png" | "webp";

const SIGNATURES: Array<{ kind: ImageKind; check: (buf: Buffer) => boolean }> = [
  {
    kind: "jpeg",
    check: (buf) => buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff,
  },
  {
    kind: "png",
    check: (buf) =>
      buf.length >= 8 &&
      buf[0] === 0x89 &&
      buf[1] === 0x50 &&
      buf[2] === 0x4e &&
      buf[3] === 0x47 &&
      buf[4] === 0x0d &&
      buf[5] === 0x0a &&
      buf[6] === 0x1a &&
      buf[7] === 0x0a,
  },
  {
    kind: "webp",
    check: (buf) =>
      buf.length >= 12 &&
      buf.toString("ascii", 0, 4) === "RIFF" &&
      buf.toString("ascii", 8, 12) === "WEBP",
  },
];

export function detectImageKind(buffer: Buffer): ImageKind | null {
  for (const { kind, check } of SIGNATURES) {
    if (check(buffer)) {
      return kind;
    }
  }
  return null;
}

const MIME_BY_KIND: Record<ImageKind, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export function mimeForImageKind(kind: ImageKind): string {
  return MIME_BY_KIND[kind];
}

export function extensionForImageKind(kind: ImageKind): "jpg" | "png" | "webp" {
  return kind === "jpeg" ? "jpg" : kind;
}

export function isMimeMatchingKind(mime: string, kind: ImageKind): boolean {
  const normalized = mime.toLowerCase();
  if (kind === "jpeg") {
    return normalized === "image/jpeg" || normalized === "image/jpg";
  }
  return normalized === MIME_BY_KIND[kind];
}
