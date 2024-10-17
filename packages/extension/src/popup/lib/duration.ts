export function formatDuration(seconds?: number): string {
  if (typeof seconds === 'undefined') {
    return '--:--';
  }
  seconds = Math.floor(seconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const formattedHours = hours > 0 ? `${hours}:` : '';
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(secs).padStart(2, '0');

  return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
}
