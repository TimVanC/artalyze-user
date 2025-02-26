import { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { getTodayInEST } from '../utils/dateUtils';

const useSelections = (userId, isLoggedIn) => {
  const [selections, setSelections] = useState([]);
  const [attempts, setAttempts] = useState([]); 
  const [alreadyGuessed, setAlreadyGuessed] = useState([]); 
  const [completedAttempts, setCompletedAttempts] = useState([]); // ✅ Added missing state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch selections, attempts, completedAttempts, and alreadyGuessed from backend or localStorage
  useEffect(() => {
    const fetchSelections = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get('/stats/selections', {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        console.log('Fetched selections, attempts, completedAttempts, and alreadyGuessed from backend:', data);

        const today = getTodayInEST();
        if (data.lastSelectionMadeDate !== today) {
          console.log("Last selection made on a previous day. Clearing outdated selections, attempts, and completedAttempts.");
          setSelections([]);
          setAttempts([]);
          setCompletedAttempts([]); // ✅ Reset completedAttempts for new puzzle
          setAlreadyGuessed([]);
          await axiosInstance.put("/stats/selections", { selections: [], attempts: [], completedAttempts: [], lastSelectionMadeDate: today });
        } else {
          setSelections(data.selections || []);
          setAttempts(data.attempts?.map(attempt => attempt.map(selected => !!selected)) || []);
          setCompletedAttempts(data.completedAttempts || []);
          setAlreadyGuessed(data.alreadyGuessed || []);
          localStorage.setItem("attempts", JSON.stringify(data.attempts || []));
          localStorage.setItem("completedAttempts", JSON.stringify(data.completedAttempts || []));
          localStorage.setItem("alreadyGuessed", JSON.stringify(data.alreadyGuessed || []));
        }
      } catch (err) {
        console.error('Error fetching selections:', err);
        setError('Failed to fetch selections. Please try again later.');
        setSelections([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchSelections();
    } else {
      const savedSelections = localStorage.getItem('selections');
      const savedAttempts = localStorage.getItem('attempts');
      const savedCompletedAttempts = localStorage.getItem('completedAttempts');
      const savedAlreadyGuessed = localStorage.getItem('alreadyGuessed');
      const lastSelectionMadeDate = localStorage.getItem('lastSelectionMadeDate');
      const today = getTodayInEST();

      if (lastSelectionMadeDate !== today) {
        console.log("Last selection made on a previous day. Clearing outdated selections, attempts, completedAttempts, and alreadyGuessed.");

        localStorage.setItem('selections', JSON.stringify([]));
        localStorage.setItem('attempts', JSON.stringify([])); 
        localStorage.setItem('completedAttempts', JSON.stringify([])); // ✅ Reset completedAttempts for guests
        localStorage.setItem('alreadyGuessed', JSON.stringify([]));
        localStorage.setItem('lastSelectionMadeDate', today);

        setSelections([]);
        setAttempts([]); 
        setCompletedAttempts([]); // ✅ Reset completedAttempts in state
        setAlreadyGuessed([]);
      } else {
        setSelections(savedSelections ? JSON.parse(savedSelections) : []);
        setAttempts(savedAttempts ? JSON.parse(savedAttempts) : []);
        setCompletedAttempts(savedCompletedAttempts ? JSON.parse(savedCompletedAttempts) : []);
        setAlreadyGuessed(savedAlreadyGuessed ? JSON.parse(savedAlreadyGuessed) : []);
      }
      setIsLoading(false);
    }
  }, [userId, isLoggedIn]);

  // Update selections locally and sync with the backend
  const updateSelections = (updatedSelections) => {
    const today = getTodayInEST();
    if (JSON.stringify(updatedSelections) === JSON.stringify(selections)) {
      console.log("Selections are already up-to-date. Skipping update.");
      return;
    }

    setSelections(updatedSelections);

    if (isLoggedIn) {
      axiosInstance
        .put("/stats/selections", {
          selections: updatedSelections,
          lastSelectionMadeDate: today,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        .then(() => console.log("Selections updated successfully in backend."))
        .catch((err) => console.error("Error updating selections:", err));
    } else {
      localStorage.setItem("selections", JSON.stringify(updatedSelections));
      localStorage.setItem("lastSelectionMadeDate", today);
    }
  };

  return { 
    selections, updateSelections, 
    attempts, setAttempts, 
    completedAttempts, setCompletedAttempts, // ✅ Now properly returned
    alreadyGuessed, setAlreadyGuessed, 
    isLoading, error 
  };
};

export default useSelections;