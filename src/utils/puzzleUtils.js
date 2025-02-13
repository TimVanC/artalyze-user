// utils/puzzleUtils.js
export const calculatePuzzleNumber = () => {
    const startDate = new Date('2025-02-13'); // Adjust start date as needed
    const now = new Date();
    const puzzleNumber = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;
    return puzzleNumber;
  };
  