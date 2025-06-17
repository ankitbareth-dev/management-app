import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import styles from "./Profile.module.css";
import profileImage from "../../assets/profile.png";
import { useAppContext } from "../../store/AppContext";

const Profile = () => {
  const { user, isCheckedIn } = useAppContext();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    joinDate: "",
    phone: "",
    location: "Loading location...",
  });

  const [locationError, setLocationError] = useState(null);

  // Get user's current location
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      setUserData((prev) => ({ ...prev, location: "Location not available" }));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // Cache for 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const address = await reverseGeocode(latitude, longitude);
          setUserData((prev) => ({ ...prev, location: address }));
          setLocationError(null);
        } catch (error) {
          console.error("Error getting address:", error);
          setLocationError("Unable to get address");
          setUserData((prev) => ({
            ...prev,
            location: "Location unavailable",
          }));
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "Location access denied";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
          default:
            errorMessage = "Unknown location error";
            break;
        }

        setLocationError(errorMessage);
        setUserData((prev) => ({
          ...prev,
          location: "Location not available",
        }));
      },
      options
    );
  };

  // Convert coordinates to readable address
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
        {
          headers: {
            "User-Agent": "YourAppName/1.0",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Geocoding service unavailable");
      }

      const data = await response.json();
      if (data && data.address) {
        const { city, state, country, town, village, county } = data.address;
        const locationParts = [
          city || town || village || county,
          state,
          country,
        ].filter(Boolean);
        return locationParts.join(", ") || "Unknown location";
      }
      throw new Error("Address not found");
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      throw error;
    }
  };

  // Load user data from context
  const loadUserData = () => {
    if (user) {
      setUserData((prev) => ({
        ...prev,
        name:
          user.email?.split("@")[0].charAt(0).toUpperCase() +
            user.email?.split("@")[0].slice(1).toLowerCase() || "User",
        email: user.email || "",
        position: "Full-Stack Developer",
        joinDate: "20 May 2025",
        phone: "+91 7877686338",
      }));
    }
  };

  useEffect(() => {
    loadUserData();
    getCurrentLocation();
  }, [user]);

  return (
    <>
      <Navbar />
      <div className={styles.cardContainer}>
        <div className={styles.profileCard}>
          <div className={styles.cardHeader}>
            <div className={styles.imageContainer}>
              <img
                className={styles.cardImage}
                src={profileImage}
                alt="Profile"
              />
              <div
                className={`${styles.statusBadge} ${
                  isCheckedIn ? styles.active : styles.inactive
                }`}
              >
                {isCheckedIn ? "Active" : "Inactive"}
              </div>
            </div>
            <div className={styles.headerInfo}>
              <h2 className={styles.name}>{userData.name}</h2>
              <p className={styles.position}>{userData.position}</p>
              <p className={styles.department}>{userData.department}</p>
            </div>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>Contact Information</h3>
              <div className={styles.infoItem}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{userData.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Phone:</span>
                <span className={styles.value}>{userData.phone}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Location:</span>
                <span
                  className={`${styles.value} ${
                    locationError ? styles.error : ""
                  }`}
                >
                  {userData.location}
                </span>
                {locationError && (
                  <button
                    className={styles.retryButton}
                    onClick={getCurrentLocation}
                    title="Retry getting location"
                  >
                    🔄 Retry
                  </button>
                )}
              </div>
            </div>

            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>Work Details</h3>
              <div className={styles.infoItem}>
                <span className={styles.label}>Join Date:</span>
                <span className={styles.value}>{userData.joinDate}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Employee ID:</span>
                <span className={styles.value}>EMP-2025-001</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Post:</span>
                <span className={styles.value}>Intern</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Status:</span>
                <span
                  className={`${styles.value} ${
                    isCheckedIn ? styles.activeStatus : styles.inactiveStatus
                  }`}
                >
                  {isCheckedIn ? "Active (Checked In)" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
