import { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { getTodayInEST } from '../utils/dateUtils';

const useSelections = (userId, isLoggedIn) => {
  const [selections, setSelections] = useState([]);
  const [attempts, setAttempts] = useState([]); // ✅ Added missing state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch selections and attempts from the backend or localStorage
  useEffect(() => {
    const fetchSelections = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get('/stats/selections', {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        console.log('Fetched selections from backend:', data.selections);

        const today = getTodayInEST();
        if (data.lastSelectionMadeDate !== today) {
          console.log("Last selection made on a previous day. Clearing outdated selections and attempts.");
          setSelections([]);
          setAttempts([]); // ✅ Reset attempts
          await axiosInstance.put("/stats/selections", { selections: [], lastSelectionMadeDate: today });
          await axiosInstance.put("/stats/attempts", { attempts: [] }); // Ensure backend resets attempts
        } else {
          setSelections(data.selections || []);
        }
      } catch (err) {
        console.error('Error fetching selections:', err);
        setError('Failed to fetch selections. Please try again later.');
        setSelections([]); // Fallback to empty selections
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchSelections();
    } else {
      const savedSelections = localStorage.getItem('selections');
      const savedAttempts = localStorage.getItem('attempts');
      const lastSelectionMadeDate = localStorage.getItem('lastSelectionMadeDate');
      const today = getTodayInEST();

      if (lastSelectionMadeDate !== today) {
        console.log("Last selection made on a previous day. Clearing outdated selections and attempts.");
        
        // ✅ Reset selections and attempts in localStorage
        localStorage.setItem('selections', JSON.stringify([]));
        localStorage.setItem('attempts', JSON.stringify([])); // Reset attempts for guests
        localStorage.setItem('lastSelectionMadeDate', today);

        setSelections([]);
        setAttempts([]); // ✅ Reset attempts in state
      } else {
        setSelections(savedSelections ? JSON.parse(savedSelections) : []);
        setAttempts(savedAttempts ? JSON.parse(savedAttempts) : []);
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

  return { selections, updateSelections, attempts, setAttempts, isLoading, error };
};

export default useSelections;