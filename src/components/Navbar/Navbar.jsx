import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../store/AppContext";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isLogoutDropdownOpen, setIsLogoutDropdownOpen] = useState(false);
  const [isAttendanceDropdownOpen, setIsAttendanceDropdownOpen] =
    useState(false);

  const { logout, user } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setIsAttendanceDropdownOpen(false);
  };

  const handleLogOut = () => {
    logout();
    navigate("/");
    setIsLogoutDropdownOpen(false);
  };

  const navigationItems = [
    { path: "/attendance-history", label: "History", icon: "📊" },
    { path: "/profile", label: "Profile", icon: "👤" },
    { path: "/expenses", label: "Expenses", icon: "💰" },
  ];

  const getHeaderText = () => {
    const pathMap = {
      "/dashboard": "Dashboard",
      "/attendance": "Attendance",
      "/manual-attendance": "Manual Attendance",
      "/attendance-history": "History",
      "/expenses": "Expenses",
      "/profile": "Profile",
    };
    return pathMap[location.pathname] || "Dashboard";
  };

  const mobileNavItems = [
    { path: "/dashboard", label: "Home", icon: "🏠" },
    { path: "/attendance", label: "Attendance", icon: "⏰" },
    { path: "/expenses", label: "Expenses", icon: "💰" },
    { path: "/attendance-history", label: "History", icon: "📊" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <>
      {/* Desktop & Mobile Navbar */}
      <nav className={styles.navbar}>
        {/* Desktop Logo Section */}
        <div className={styles.logoSection}>
          <div className={styles.brandContainer}>
            <div className={styles.brandIcon}>⚡</div>
            <h1 className={styles.title}>{getHeaderText()}</h1>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <div className={styles.navLinks}>
            {/* Dashboard */}
            <button
              className={`${styles.navLink} ${
                location.pathname === "/dashboard" ? styles.activeNavLink : ""
              }`}
              onClick={() => handleNavigation("/dashboard")}
            >
              <span className={styles.navIcon}>🏠</span>
              Dashboard
            </button>

            {/* Attendance Dropdown */}
            <div className={styles.dropdownContainer}>
              <button
                className={`${styles.navLink} ${
                  location.pathname === "/attendance" ||
                  location.pathname === "/manual-attendance"
                    ? styles.activeNavLink
                    : ""
                }`}
                onClick={() =>
                  setIsAttendanceDropdownOpen(!isAttendanceDropdownOpen)
                }
              >
                <span className={styles.navIcon}>⏰</span>
                Attendance
                <span
                  className={`${styles.arrow} ${
                    isAttendanceDropdownOpen ? styles.arrowUp : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {isAttendanceDropdownOpen && (
                <div className={styles.dropdown}>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => handleNavigation("/attendance")}
                  >
                    <span>⏰</span>
                    Regular Attendance
                  </button>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => handleNavigation("/manual-attendance")}
                  >
                    <span>✏️</span>
                    Manual Attendance
                  </button>
                </div>
              )}
            </div>

            {/* Other Navigation Items */}
            {navigationItems.map((item) => (
              <button
                key={item.path}
                className={`${styles.navLink} ${
                  location.pathname === item.path ? styles.activeNavLink : ""
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* User Profile Dropdown */}
          <div className={styles.dropdownContainer}>
            <button
              className={styles.userButton}
              onClick={() => setIsLogoutDropdownOpen(!isLogoutDropdownOpen)}
            >
              <div className={styles.userAvatar}>
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className={styles.userName}>{user?.name || "User"}</span>
              <span
                className={`${styles.arrow} ${
                  isLogoutDropdownOpen ? styles.arrowUp : ""
                }`}
              >
                ▼
              </span>
            </button>

            {isLogoutDropdownOpen && (
              <div className={styles.dropdown}>
                <button className={styles.dropdownItem} onClick={handleLogOut}>
                  <span>🚪</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Header */}
        <div className={styles.mobileHeader}>
          <div className={styles.mobileBrand}>
            <div className={styles.brandIcon}>⚡</div>
            <h1 className={styles.mobileTitle}>{getHeaderText()}</h1>
          </div>
          <button className={styles.mobileLogoutBtn} onClick={handleLogOut}>
            🚪
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className={styles.mobileBottomNav}>
        {mobileNavItems.map((item) => (
          <button
            key={item.path}
            className={`${styles.mobileNavItem} ${
              location.pathname === item.path ? styles.activeMobileNavItem : ""
            }`}
            onClick={() => handleNavigation(item.path)}
          >
            <span className={styles.mobileNavIcon}>{item.icon}</span>
            <span className={styles.mobileNavLabel}>{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default Navbar;
