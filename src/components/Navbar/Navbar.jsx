import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../store/AppContext";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutDropdownOpen, setIsLogoutDropdownOpen] = useState(false);
  const [isAttendanceDropdownOpen, setIsAttendanceDropdownOpen] =
    useState(false);
  const { logout, user } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLogoutDropdown = () => {
    setIsLogoutDropdownOpen(!isLogoutDropdownOpen);
  };

  const toggleAttendanceDropdown = () => {
    setIsAttendanceDropdownOpen(!isAttendanceDropdownOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogOut = () => {
    logout();
    navigate("/");
    setIsLogoutDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const navigationItems = [
    { path: "/attendance-history", label: "Attendance Details" },
    { path: "/profile", label: "Profile" },
    { path: "/expenses", label: "Expenses" },
  ];

  const getHeaderText = () => {
    const pathMap = {
      "/dashboard": "Dashboard",
      "/attendance": "Attendance",
      "/manual-attendance": "Manual Attendance",
      "/attendance-history": "Attendance History",
      "/expenses": "Expenses",
      "/profile": "Profile",
    };
    return pathMap[location.pathname] || "Dashboard";
  };

  // Mobile bottom navigation items with icons
  const mobileNavItems = [
    {
      path: "/dashboard",
      label: "Home",
      icon: "🏠",
    },
    {
      path: "/attendance",
      label: "Attendance",
      icon: "⏰",
    },
    {
      path: "/expenses",
      label: "Expenses",
      icon: "💰",
    },
    {
      path: "/attendance-history",
      label: "History",
      icon: "📊",
    },
    {
      path: "/profile",
      label: "Profile",
      icon: "👤",
    },
  ];

  return (
    <>
      {/* Desktop Navbar - unchanged */}
      <nav className={styles.navbar}>
        {/* Logo/Title Section */}
        <div className={styles.logoSection}>
          <h1 className={styles.title}>{getHeaderText()}</h1>
        </div>

        {/* Desktop Navigation Links */}
        <div className={styles.desktopNav}>
          <div className={styles.navLinks}>
            <button
              className={`${styles.navLink} ${
                location.pathname === "/dashboard" ? styles.activeNavLink : ""
              }`}
              onClick={() => handleNavigation("/dashboard")}
            >
              Dashboard
            </button>
            <div className={styles.attendanceContainer}>
              <button
                className={`${styles.navLink} ${
                  location.pathname === "/attendance" ||
                  location.pathname === "/manual-attendance"
                    ? styles.activeNavLink
                    : ""
                }`}
                onClick={toggleAttendanceDropdown}
              >
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
                <div className={styles.attendanceDropdown}>
                  <button
                    className={styles.attendanceItem}
                    onClick={() => {
                      handleNavigation("/attendance");
                      setIsAttendanceDropdownOpen(false);
                    }}
                  >
                    Regular Attendance
                  </button>
                  <button
                    className={styles.attendanceItem}
                    onClick={() => {
                      handleNavigation("/manual-attendance");
                      setIsAttendanceDropdownOpen(false);
                    }}
                  >
                    Manual Attendance
                  </button>
                </div>
              )}
            </div>
            {/* Other navigation items */}
            {navigationItems.map((item) => (
              <button
                key={item.path}
                className={`${styles.navLink} ${
                  location.pathname === item.path ? styles.activeNavLink : ""
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                {item.label}
              </button>
            ))}
          </div>
          {/* Desktop Logout Dropdown */}
          <div className={styles.logoutContainer}>
            <button
              className={styles.userButton}
              onClick={toggleLogoutDropdown}
            >
              <span className={styles.userIcon}>👤</span>
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
              <div className={styles.logoutDropdown}>
                <button className={styles.logoutItem} onClick={handleLogOut}>
                  <span>🚪</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Header - only title and logout */}
        <div className={styles.mobileHeader}>
          <h1 className={styles.mobileTitle}>{getHeaderText()}</h1>
          <button className={styles.mobileLogoutBtn} onClick={handleLogOut}>
            <span>🚪</span>
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

      {/* Mobile Attendance Options Modal */}
      {location.pathname === "/attendance" && (
        <div className={styles.mobileAttendanceModal}>
          <div className={styles.modalContent}>
            <h3>Attendance Options</h3>
            <button
              className={styles.modalOption}
              onClick={() => handleNavigation("/attendance")}
            >
              <span>⏰</span>
              Regular Attendance
            </button>
            <button
              className={styles.modalOption}
              onClick={() => handleNavigation("/manual-attendance")}
            >
              <span>✏️</span>
              Manual Attendance
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
