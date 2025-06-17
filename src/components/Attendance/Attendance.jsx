import Navbar from "../Navbar/Navbar";
import styles from "./Attendance.module.css";
import { useAppContext } from "../../store/AppContext";
import { useEffect, useState } from "react";
import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";

// Add this function to request permissions
const requestLocationPermission = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      const permission = await Geolocation.requestPermissions();
      return permission.location === "granted";
    } catch (error) {
      console.error("Permission request failed:", error);
      return false;
    }
  }
  return true; // Web doesn't need explicit permission request
};

// Update getCurrentPosition function
const getCurrentPosition = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      // Check and request permissions first
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        throw new Error(
          "Location permission denied. Please enable location access in your device settings."
        );
      }

      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      });

      return {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
      };
    } else {
      // Web fallback
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation is not supported"));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) =>
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          (error) =>
            reject(new Error("Failed to get location: " + error.message)),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      });
    }
  } catch (error) {
    throw new Error("Location access failed: " + error.message);
  }
};

const CheckIn = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isCheckedIn, currentCheckInTime, user, checkIn, checkOut } =
    useAppContext();

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 2000);

      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [successMessage]);

  const handleToggle = async () => {
    setError("");
    setSuccessMessage("");

    if (!isCheckedIn) {
      setIsLoading(true);
      try {
        const position = await getCurrentPosition();
        const location = await reverseGeocode(
          position.latitude,
          position.longitude
        );
        await checkIn(location, position);
        setSuccessMessage("✅ Checked in successfully!");
      } catch (error) {
        console.error("Error during check-in:", error);
        let errorMessage = "Failed to check-in. ";

        if (
          error.message.includes("permission") ||
          error.message.includes("denied")
        ) {
          errorMessage +=
            "Please go to your device Settings > Apps > [Your App Name] > Permissions and enable Location access.";
        } else if (error.message.includes("location")) {
          errorMessage +=
            "Please ensure location services are enabled on your device and try again.";
        } else {
          errorMessage += error.message;
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Similar logic for check-out
      setIsLoading(true);
      try {
        const position = await getCurrentPosition();
        await checkOut(position);
        setSuccessMessage("✅ Checked out successfully!");
      } catch (error) {
        console.error("Error during check-out:", error);
        setError(
          "Failed to check-out. Please ensure location services are enabled."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Convert coordinates to readable address
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
        {
          headers: {
            "User-Agent": "AttendanceApp/1.0",
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
      return "Location not available";
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.buttonContainer}>
        <button
          className={isCheckedIn ? styles.checkInButton : styles.checkInButton2}
          onClick={handleToggle}
          disabled={isLoading} // Add this line
        >
          {isLoading ? "Processing..." : isCheckedIn ? "Check-Out" : "Check-In"}{" "}
          {/* Update this line */}
        </button>
      </div>
      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      )}
      {successMessage && (
        <div className={styles.successContainer}>
          <p className={styles.successMessage}>{successMessage}</p>
        </div>
      )}
      {(isCheckedIn || currentCheckInTime) && (
        <div className={styles.checkInContainers}>
          <div className={styles.userData}>
            <div className={styles.userField}>
              <strong>Email:</strong> {user?.email || ""}
            </div>
            <div className={styles.userField}>
              <strong>Check-In Time:</strong> {currentCheckInTime || ""}
            </div>
            <div className={styles.userField}>
              <strong>Status:</strong>{" "}
              {isCheckedIn ? "Checked In" : "Checked Out"}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckIn;
