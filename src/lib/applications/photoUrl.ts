export function getApplicationPhotoUrl(photoPath: string): string {
  const filename = photoPath.replace(/^uploads\//, "");
  return `/api/uploads/${encodeURIComponent(filename)}`;
}
