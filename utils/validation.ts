export function isValidUrl(candidate: string): boolean {
  try {
    new URL(candidate);
    return true;
  } catch {
    return false;
  }
}

export function isValidIp(candidate: string): boolean {
  const parts = candidate.split('.');
  if (parts.length !== 4) return false;
  return parts.every(part => {
    if (part === '') return false;
    const num = Number(part);
    return Number.isInteger(num) && num >= 0 && num <= 255;
  });
}
