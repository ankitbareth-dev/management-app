import { useState } from "react";
import styles from "./AttendanceHistory.module.css";
import Navbar from "../Navbar/Navbar";
import { useAppContext } from "../../store/AppContext";

const AttendanceHistory = () => {
  const { attendanceHistory } = useAppContext();
  const [visibleCount, setVisibleCount] = useState(5);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, attendanceHistory.length));
  };

  const visibleData = attendanceHistory.slice(0, visibleCount);
  const hasMore = visibleCount < attendanceHistory.length;

  return (
    <>
      <Navbar />
      <div className={styles.cardContainer}>
        <div className={styles.attendanceCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.title}>Attendance History</h2>
          </div>

          {attendanceHistory.length === 0 ? (
            <div className={styles.noDataMessage}>
              <p className={styles.emptyMessage}>
                No attendance records found. Start by checking in!
              </p>
            </div>
          ) : (
            <>
              <div className={styles.tableContainer}>
                <table className={styles.attendanceTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleData.map((record) => (
                      <tr key={record.id} className={styles.tableRow}>
                        <td className={styles.date}>{record.date}</td>
                        <td className={styles.checkIn}>{record.checkIn}</td>
                        <td className={styles.checkOut}>
                          {record.checkOut || (
                            <span className={styles.pendingCheckout}>
                              Pending
                            </span>
                          )}
                        </td>
                        <td className={styles.location}>{record.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {hasMore && (
                <div className={styles.loadMoreContainer}>
                  <button
                    className={styles.loadMoreButton}
                    onClick={handleLoadMore}
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AttendanceHistory;
