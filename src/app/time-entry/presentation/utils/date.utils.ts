export function toDateKey(date: Date | string): string {
  if (typeof date === 'string') return date.slice(0, 10);
  return (
    date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0')
  );
}
