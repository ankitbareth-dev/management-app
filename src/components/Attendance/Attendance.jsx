import Navbar from "../Navbar/Navbar";
import styles from "./Attendance.module.css";
import { useAppContext } from "../../store/AppContext";
import { useEffect, useState } from "react";

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
    setError(""); // Clear previous errors
    setSuccessMessage("");

    if (!isCheckedIn) {
      setIsLoading(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const location = await reverseGeocode(latitude, longitude);
              await checkIn(location, { latitude, longitude }); // Pass coordinates
            } catch (error) {
              console.error("Error during check-in:", error);
              setError(
                error.message || "Failed to check-in. Please try again."
              );
            } finally {
              setIsLoading(false);
            }
          },
          async (error) => {
            console.error("Geolocation error:", error);
            setError(
              "Location access is required for check-in. Please enable location services."
            );
            setIsLoading(false);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              await checkOut({ latitude, longitude });
              setSuccessMessage("✅ Checked out successfully!");
            } catch (error) {
              console.error("Error during check-out:", error);
              setError(
                error.message || "Failed to check-out. Please try again."
              );
            } finally {
              setIsLoading(false);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            setError(
              "Location access is required for check-out. Please enable location services."
            );
            setIsLoading(false);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
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
