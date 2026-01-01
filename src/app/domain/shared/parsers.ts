export function parseBool(v: unknown): boolean {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v === 1;
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase();
    return s === '1' || s === 'true' || s === 'y';
  }
  return false;
}

export function parseDate(v: unknown): Date {
  return new Date(typeof v === 'string' || typeof v === 'number' ? v : 0);
}
