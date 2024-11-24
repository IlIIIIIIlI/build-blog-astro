import readingTime from 'reading-time';

export function getReadingTime(content: string): string {
  const stats = readingTime(content);
  return `${Math.ceil(stats.minutes)} min read`;
}