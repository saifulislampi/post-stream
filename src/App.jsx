import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./components/shared/Spinner";
import AppRoutes from "./routes/AppRoutes";
import { fetchProfileByUserId } from "./services/profiles";
import { getCurrentUser, logout, login } from "./components/auth/AuthService";

export default function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  // Counter to trigger feed refresh in Timeline after profile updates
  const [feedRefreshCount, setFeedRefreshCount] = useState(0);

  useEffect(() => {
    // On initial mount, check if user is already logged in
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const user = getCurrentUser();
        if (user) {
          setCurrentUser(user);
          const profile = await fetchProfileByUserId(user.id);
          setCurrentProfile(profile);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkLoggedInUser = async () => {
      setLoading(true);
      try {
        const user = getCurrentUser();
        if (user) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Error checking logged in user:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProfile();
    } else {
      checkLoggedInUser();
    }
  }, [currentUser]);

  // Handler for logout
  const handleLogout = async () => {
    try {
      await logout();
      setCurrentUser(null);
      setCurrentProfile(null);
      navigate("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Handler for login
  const handleLogin = async (username, password) => {
    try {
      const { user, profile } = await login(username, password);
      setCurrentUser(user);
      setCurrentProfile(profile);
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  // Handler for profile updates (e.g., follow/unfollow)
  const handleProfileUpdate = (updatedProfile) => {
    setCurrentProfile(updatedProfile);
    // trigger Timeline to refresh feed
    setFeedRefreshCount((prev) => prev + 1);
  };

  if (loading) return <Spinner />;

  return (
    <div className="app">
      <AppRoutes
        currentUser={currentUser}
        currentProfile={currentProfile}
        onLogout={handleLogout}
        onLogin={handleLogin}
        onProfileUpdate={handleProfileUpdate}
        feedRefreshCount={feedRefreshCount}
      />
    </div>
  );
}
