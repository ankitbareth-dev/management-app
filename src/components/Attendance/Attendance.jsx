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
      console.log("🔍 Requesting location permission...");
      const permission = await Geolocation.requestPermissions();
      console.log("📋 Permission result:", permission);

      const isGranted = permission.location === "granted";
      console.log("✅ Permission granted:", isGranted);
      return isGranted;
    } catch (error) {
      console.error("❌ Permission request failed:", error);
      return false;
    }
  }
  console.log("🌐 Web platform - no permission request needed");
  return true;
};

// Update getCurrentPosition function
// Update just the getCurrentPosition function with alerts
const getCurrentPosition = async () => {
  try {
    alert("🔍 Starting location check...");

    if (Capacitor.isNativePlatform()) {
      alert("📱 Running on mobile device");

      // Check current permission status first
      const currentPermissions = await Geolocation.checkPermissions();
      alert(`📋 Permission status: ${currentPermissions.location}`);

      if (currentPermissions.location !== "granted") {
        alert("⚠️ Permission not granted, requesting...");
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
          alert("❌ Permission denied by user");
          throw new Error("Location permission denied");
        }
        alert("✅ Permission granted");
      } else {
        alert("✅ Permission already granted");
      }

      alert("🎯 Getting GPS coordinates...");
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      });

      alert(
        `📍 GPS Success! Lat: ${coordinates.coords.latitude.toFixed(
          4
        )}, Lng: ${coordinates.coords.longitude.toFixed(4)}`
      );

      return {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
      };
    } else {
      alert("🌐 Running on web browser");
      // Web fallback code...
    }
  } catch (error) {
    alert(`❌ Location Error: ${error.message}`);
    throw error;
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
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleToggle = async () => {
    setError("");
    setSuccessMessage("");

    console.log("🚀 Handle toggle called, isCheckedIn:", isCheckedIn);

    if (!isCheckedIn) {
      setIsLoading(true);
      try {
        console.log("⏰ Starting check-in process...");
        const position = await getCurrentPosition();
        console.log("📍 Position obtained:", position);

        const location = await reverseGeocode(
          position.latitude,
          position.longitude
        );
        console.log("🏠 Location geocoded:", location);

        await checkIn(location, position);
        setSuccessMessage("✅ Checked in successfully!");
      } catch (error) {
        console.error("❌ Check-in error details:", error);
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
      setIsLoading(true);
      try {
        console.log("⏰ Starting check-out process...");
        const position = await getCurrentPosition();
        console.log("📍 Check-out position obtained:", position);

        await checkOut(position);
        setSuccessMessage("✅ Checked out successfully!");
      } catch (error) {
        console.error("❌ Check-out error details:", error);
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
      console.log("🌍 Reverse geocoding:", latitude, longitude);
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
      console.log("🌍 Geocoding response:", data);

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
      console.error("❌ Reverse geocoding error:", error);
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
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : isCheckedIn ? "Check-Out" : "Check-In"}
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
