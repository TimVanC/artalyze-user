export const calculatePuzzleNumber = () => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(new Date());
  const year = parts.find(p => p.type === 'year').value;
  const month = parts.find(p => p.type === 'month').value - 1; // Adjust for 0-based index
  const day = parts.find(p => p.type === 'day').value;

  const estNow = new Date(year, month, day);

  // Start date remains in EST (Feb 15, 2025, at 12:00 AM EST)
  const startDate = new Date(Date.UTC(2025, 1, 15, 5, 0, 0)); // 5:00 AM UTC = Midnight EST

  // Calculate the puzzle number based on EST
  const puzzleNumber = Math.floor((estNow - startDate) / (1000 * 60 * 60 * 24)) + 1;

  return puzzleNumber;
};
