import React from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import "./SettingsModal.css";

const SettingsModal = ({ isOpen, onClose, isLoggedIn }) => {
  const { darkMode, setDarkMode } = useDarkMode();

  const toggleDarkMode = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    window.dispatchEvent(new Event("darkModeChanged"));

    const userId = localStorage.getItem("userId");
    const userToken = localStorage.getItem("authToken");

    if (userId && userToken) {
      try {
        await fetch(`/api/user/theme`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ themePreference: newMode ? "dark" : "light" }),
        });
      } catch (error) {
        console.error("Error syncing theme preference:", error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all local storage
    window.location.href = "/"; // Redirect to the homepage or login page
  };

  if (!isOpen) return null;

  const currentYear = new Date().getFullYear(); // Dynamically fetch the current year

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal-content">
        <h2>Settings</h2>
        <ul className="settings-options">
          <li className="dark-mode-toggle-wrapper">
            <div className="dark-mode-toggle-container" onClick={toggleDarkMode}>
              <span className="dark-mode-toggle-label">Dark Mode</span>
              <div className={`dark-mode-toggle ${darkMode ? "active" : ""}`}></div>
            </div>
          </li>

          <li>
            <button
              className="settings-button"
              onClick={() => {
                onClose();
                window.location.href = "mailto:info@artalyze.app?subject=Feedback";
              }}
            >
              Feedback
            </button>
          </li>
          <li>
            <button
              className="settings-button"
              onClick={() => {
                onClose();
                window.open("/privacy-policy.html", "_blank");
              }}
            >
              Privacy Policy
            </button>
          </li>
          <li>
            <button
              className="settings-button"
              onClick={() => {
                onClose();
                window.location.href = "mailto:info@artalyze.app?subject=Bug Report";
              }}
            >
              Report a Bug
            </button>
          </li>
          <li>
            <button
              className="settings-button"
              onClick={() => {
                onClose();
                window.open("/terms-of-service.html", "_blank");
              }}
            >
              Terms of Service
            </button>
          </li>
          <li>
            <button
              className="settings-button"
              onClick={() => {
                onClose();
                if (isLoggedIn) {
                  handleLogout(); // Log out if user is logged in
                } else {
                  window.location.href = "/login"; // Redirect to login/create account page
                }
              }}
            >
              {isLoggedIn ? "Log Out" : "Create Account"}
            </button>
          </li>
        </ul>
        <footer className="settings-footer">&copy; {currentYear} Artalyze</footer>
        <button className="close-modal" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
