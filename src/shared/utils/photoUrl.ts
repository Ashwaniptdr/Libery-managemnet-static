export function getPhotoUrl(
  photoPath: string | null | undefined
): string | undefined {
  if (!photoPath) return undefined;

  if (photoPath.startsWith('data:')) {
    return photoPath;
  }

  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    return photoPath;
  }

  return photoPath;
}
