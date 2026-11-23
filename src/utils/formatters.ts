export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatPhoneBR(value: string): string {
  const digits = onlyDigits(value).slice(0, 13);

  if (!digits) return '';

  const normalized = digits.startsWith('55') ? digits.slice(2) : digits;

  if (normalized.length === 0) return '+55 ';
  if (normalized.length <= 2) return `+55 (${normalized}`;
  if (normalized.length <= 7) {
    return `+55 (${normalized.slice(0, 2)}) ${normalized.slice(2)}`;
  }

  return `+55 (${normalized.slice(0, 2)}) ${normalized.slice(2, 7)}-${normalized.slice(7, 11)}`;
}