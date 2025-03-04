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
            <div
              className="dark-mode-toggle-container"
              onClick={() => {
                toggleDarkMode();

                // ✅ Track Dark Mode toggle
                ReactGA.event({
                  category: "Settings",
                  action: "Dark Mode Toggled",
                  label: darkMode ? "Switched to Light Mode" : "Switched to Dark Mode",
                });
              }}
            >
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

                // ✅ Track Feedback button click
                ReactGA.event({
                  category: "Settings",
                  action: "Feedback Clicked",
                  label: "User clicked Feedback",
                });
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

                // ✅ Track Privacy Policy click
                ReactGA.event({
                  category: "Settings",
                  action: "Privacy Policy Clicked",
                  label: "User viewed Privacy Policy",
                });
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

                // ✅ Track Report a Bug click
                ReactGA.event({
                  category: "Settings",
                  action: "Report Bug Clicked",
                  label: "User clicked Report a Bug",
                });
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
                window.open("/patch-notes.html", "_blank");

                // ✅ Track Patch Notes click
                ReactGA.event({
                  category: "Settings",
                  action: "Patch Notes Clicked",
                  label: "User viewed Patch Notes",
                });
              }}
            >
              Patch Notes
            </button>
          </li>

          <li>
            <button
              className="settings-button"
              onClick={() => {
                onClose();
                window.open("/terms-of-service.html", "_blank");

                // ✅ Track Terms of Service click
                ReactGA.event({
                  category: "Settings",
                  action: "Terms of Service Clicked",
                  label: "User viewed Terms of Service",
                });
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
                  handleLogout();

                  // ✅ Track Log Out click
                  ReactGA.event({
                    category: "Settings",
                    action: "User Logged Out",
                    label: "User clicked Log Out",
                  });
                } else {
                  window.location.href = "/login";

                  // ✅ Track Create Account click
                  ReactGA.event({
                    category: "Settings",
                    action: "Create Account Clicked",
                    label: "User clicked Create Account",
                  });
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
