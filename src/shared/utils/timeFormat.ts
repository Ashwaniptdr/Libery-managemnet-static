export const formatTime = (time: string | undefined | null): string => {
  if (!time) return 'N/A';
  const [hours, minutes] = time.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return time;

  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');

  return `${hour12}:${formattedMinutes} ${period}`;
};
