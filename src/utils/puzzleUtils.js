export const calculatePuzzleNumber = () => {
  const startDate = new Date(Date.UTC(2025, 1, 15, 5, 0, 0)); // Feb 15, 2025, at 12:00 AM EST (5:00 AM UTC)
  const now = new Date();

  // Convert `now` to EST
  const estNow = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));

  // Calculate the puzzle number based on EST
  const puzzleNumber = Math.floor((estNow - startDate) / (1000 * 60 * 60 * 24)) + 1;

  return puzzleNumber;
};
