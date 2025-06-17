import { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { useAppContext } from "../../store/AppContext";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const { user, isCheckedIn, currentCheckInTime, attendanceHistory, expenses } =
    useAppContext();

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate dashboard metrics
  const getDashboardMetrics = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Attendance metrics
    const thisMonthAttendance = attendanceHistory.filter((record) => {
      const recordDate = new Date(record.serverTimestamp || record.date);
      return (
        recordDate.getMonth() === currentMonth &&
        recordDate.getFullYear() === currentYear
      );
    });

    const totalWorkingDays = thisMonthAttendance.length;
    const checkedOutDays = thisMonthAttendance.filter(
      (record) => record.checkOut
    ).length;
    const pendingCheckouts = thisMonthAttendance.filter(
      (record) => !record.checkOut
    ).length;

    // Expense metrics
    const thisMonthExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const thisMonthExpenseAmount = thisMonthExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const pendingExpenses = expenses.filter(
      (expense) => expense.status === "draft"
    ).length;

    return {
      totalWorkingDays,
      checkedOutDays,
      pendingCheckouts,
      totalExpenses,
      thisMonthExpenseAmount,
      pendingExpenses,
      thisMonthAttendance: thisMonthAttendance.length,
      thisMonthExpensesCount: thisMonthExpenses.length,
    };
  };

  const getRecentActivities = () => {
    const activities = [];

    // Add recent attendance records
    attendanceHistory.slice(0, 3).forEach((record) => {
      activities.push({
        id: `attendance-${record.id}`,
        type: "attendance",
        title: record.checkOut ? "Checked Out" : "Checked In",
        description: `${record.location}`,
        time: record.checkOut ? record.checkOut : record.checkIn,
        date: record.date,
        status: record.checkOut ? "completed" : "pending",
        isManual: record.isManual,
      });
    });

    // Add recent expenses
    expenses.slice(0, 3).forEach((expense) => {
      activities.push({
        id: `expense-${expense.id}`,
        type: "expense",
        title: expense.title,
        description: `${
          expense.category
        } - ₹${expense.amount.toLocaleString()}`,
        time: new Date(expense.createdAt).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date(expense.createdAt).toLocaleDateString("en-GB"),
        status: expense.status,
      });
    });

    // Sort by date and time, most recent first
    return activities
      .sort(
        (a, b) =>
          new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`)
      )
      .slice(0, 5);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const metrics = getDashboardMetrics();
  const recentActivities = getRecentActivities();

  return (
    <div className={styles.dashboardContainer}>
      <Navbar />
      <main className={styles.mainContent}>
        {/* Welcome Section */}
        <div className={styles.welcomeSection}>
          <div className={styles.welcomeContent}>
            <h1 className={styles.welcomeTitle}>
              {getGreeting()},{" "}
              {user?.name || user?.email?.split("@")[0] || "User"}!
            </h1>
            <p className={styles.welcomeSubtitle}>
              {currentTime.toLocaleDateString("en-GB", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className={styles.currentTime}>
            <div className={styles.timeDisplay}>
              {currentTime.toLocaleTimeString("en-GB", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
            <div className={styles.statusIndicator}>
              <span
                className={`${styles.statusDot} ${
                  isCheckedIn ? styles.checkedIn : styles.checkedOut
                }`}
              ></span>
              {isCheckedIn ? "Checked In" : "Checked Out"}
            </div>
          </div>
        </div>

        {/* Current Status Card */}
        {isCheckedIn && (
          <div className={styles.currentStatusCard}>
            <div className={styles.statusHeader}>
              <h3>Current Session</h3>
              <span className={styles.liveIndicator}>🔴 LIVE</span>
            </div>
            <div className={styles.statusDetails}>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Checked in at:</span>
                <span className={styles.statusValue}>{currentCheckInTime}</span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Duration:</span>
                <span className={styles.statusValue}>
                  {(() => {
                    if (!currentCheckInTime) return "0h 0m";
                    const checkInTime = new Date(currentCheckInTime);
                    const diff = currentTime - checkInTime;
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor(
                      (diff % (1000 * 60 * 60)) / (1000 * 60)
                    );
                    return `${hours}h ${minutes}m`;
                  })()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>📅</div>
            <div className={styles.metricContent}>
              <h3 className={styles.metricValue}>
                {metrics.thisMonthAttendance}
              </h3>
              <p className={styles.metricLabel}>Days This Month</p>
              <span className={styles.metricSubtext}>
                {metrics.checkedOutDays} completed
              </span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>⏰</div>
            <div className={styles.metricContent}>
              <h3 className={styles.metricValue}>{metrics.pendingCheckouts}</h3>
              <p className={styles.metricLabel}>Pending Checkouts</p>
              <span className={styles.metricSubtext}>
                {metrics.pendingCheckouts === 0
                  ? "All clear!"
                  : "Need attention"}
              </span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>💰</div>
            <div className={styles.metricContent}>
              <h3 className={styles.metricValue}>
                {formatCurrency(metrics.thisMonthExpenseAmount)}
              </h3>
              <p className={styles.metricLabel}>This Month Expenses</p>
              <span className={styles.metricSubtext}>
                {metrics.thisMonthExpensesCount} transactions
              </span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>📋</div>
            <div className={styles.metricContent}>
              <h3 className={styles.metricValue}>{metrics.pendingExpenses}</h3>
              <p className={styles.metricLabel}>Draft Expenses</p>
              <span className={styles.metricSubtext}>
                {metrics.pendingExpenses === 0
                  ? "All submitted"
                  : "Pending submission"}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className={styles.activitiesSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Activities</h2>
            <span className={styles.sectionSubtitle}>Your latest actions</span>
          </div>

          {recentActivities.length === 0 ? (
            <div className={styles.noActivities}>
              <div className={styles.noActivitiesIcon}>📝</div>
              <h3>No recent activities</h3>
              <p>Start by checking in or adding an expense!</p>
            </div>
          ) : (
            <div className={styles.activitiesList}>
              {recentActivities.map((activity) => (
                <div key={activity.id} className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    {activity.type === "attendance" ? (
                      <span className={styles.attendanceIcon}>
                        {activity.status === "completed" ? "✅" : "🕐"}
                      </span>
                    ) : (
                      <span className={styles.expenseIcon}>💳</span>
                    )}
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityHeader}>
                      <h4 className={styles.activityTitle}>{activity.title}</h4>
                      <div className={styles.activityMeta}>
                        <span className={styles.activityTime}>
                          {activity.time}
                        </span>
                        <span className={styles.activityDate}>
                          {activity.date}
                        </span>
                      </div>
                    </div>
                    <p className={styles.activityDescription}>
                      {activity.description}
                    </p>
                    <div className={styles.activityFooter}>
                      <span
                        className={`${styles.activityStatus} ${
                          styles[activity.status]
                        }`}
                      >
                        {activity.status === "draft"
                          ? "Draft"
                          : activity.status === "pending"
                          ? "Pending"
                          : activity.status === "submitted"
                          ? "Submitted"
                          : "Completed"}
                      </span>
                      {activity.isManual && (
                        <span className={styles.manualBadge}>Manual</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActionsSection}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <div className={styles.quickActionsGrid}>
            <a href="/attendance" className={styles.quickActionCard}>
              <div className={styles.quickActionIcon}>🕐</div>
              <h3>Check In/Out</h3>
              <p>Mark your attendance</p>
            </a>
            <a href="manual-attendance" className={styles.quickActionCard}>
              <div className={styles.quickActionIcon}>📝</div>
              <h3>Manual Entry</h3>
              <p>Add manual attendance</p>
            </a>
            <a href="/expenses" className={styles.quickActionCard}>
              <div className={styles.quickActionIcon}>💰</div>
              <h3>Add Expense</h3>
              <p>Record new expense</p>
            </a>
            <a href="/attendance-history" className={styles.quickActionCard}>
              <div className={styles.quickActionIcon}>📊</div>
              <h3>View Reports</h3>
              <p>Check your history</p>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
