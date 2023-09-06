export default function formatTimestamp(date: Date): string {
  const intl = new Intl.DateTimeFormat();
  const options = intl.resolvedOptions();
  const timezone = options.timeZone;

  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: timezone,
  });

  return formatter.format(date);
}
