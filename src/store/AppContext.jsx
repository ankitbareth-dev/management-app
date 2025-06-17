import { createContext, useContext, useReducer, useEffect } from "react";
import { getAccurateTime } from "../services/timeService";

const ASSIGNED_COORDINATES = {
  latitude: 25.356806,
  longitude: 74.620425,
};

const ALLOWED_DISTANCE_METERS = 100;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

const isWithinAllowedLocation = (userLat, userLon) => {
  const distance = calculateDistance(
    userLat,
    userLon,
    ASSIGNED_COORDINATES.latitude,
    ASSIGNED_COORDINATES.longitude
  );
  return distance <= ALLOWED_DISTANCE_METERS;
};

const initialState = {
  user: null,
  isAuthenticated: false,

  isCheckedIn: false,
  currentCheckInTime: null,
  attendanceHistory: [
    {
      id: 1703145600000,
      srNo: 1,
      date: "21/12/2024",
      checkIn: "09:15",
      checkOut: "18:30",
      location: "Office - Mumbai",
      status: "checked-out",
      serverTimestamp: "2024-12-21T09:15:00.000Z",
      checkOutTimestamp: "2024-12-21T18:30:00.000Z",
    },
    {
      id: 1703059200000,
      srNo: 2,
      date: "20/12/2024",
      checkIn: "09:00",
      checkOut: "17:45",
      location: "Client Office - Pune",
      status: "checked-out",
      serverTimestamp: "2024-12-20T09:00:00.000Z",
      checkOutTimestamp: "2024-12-20T17:45:00.000Z",
      isManual: true,
      description: "Client meeting and project discussion",
    },
    {
      id: 1702972800000,
      srNo: 3,
      date: "19/12/2024",
      checkIn: "08:45",
      checkOut: "18:00",
      location: "Home Office",
      status: "checked-out",
      serverTimestamp: "2024-12-19T08:45:00.000Z",
      checkOutTimestamp: "2024-12-19T18:00:00.000Z",
    },
    {
      id: 1702886400000,
      srNo: 4,
      date: "18/12/2024",
      checkIn: "09:30",
      checkOut: "17:30",
      location: "Office - Mumbai",
      status: "checked-out",
      serverTimestamp: "2024-12-18T09:30:00.000Z",
      checkOutTimestamp: "2024-12-18T17:30:00.000Z",
    },
    {
      id: 1702800000000,
      srNo: 5,
      date: "17/12/2024",
      checkIn: "09:15",
      checkOut: "18:15",
      location: "Co-working Space - Bangalore",
      status: "checked-out",
      serverTimestamp: "2024-12-17T09:15:00.000Z",
      checkOutTimestamp: "2024-12-17T18:15:00.000Z",
      isManual: true,
      description: "Working from co-working space during business trip",
    },
    {
      id: 1702713600000,
      srNo: 6,
      date: "16/12/2024",
      checkIn: "10:00",
      checkOut: "16:00",
      location: "Office - Mumbai",
      status: "checked-out",
      serverTimestamp: "2024-12-16T10:00:00.000Z",
      checkOutTimestamp: "2024-12-16T16:00:00.000Z",
    },
    {
      id: 1702627200000,
      srNo: 7,
      date: "15/12/2024",
      checkIn: "08:30",
      checkOut: "17:00",
      location: "Home Office",
      status: "checked-out",
      serverTimestamp: "2024-12-15T08:30:00.000Z",
      checkOutTimestamp: "2024-12-15T17:00:00.000Z",
    },
    {
      id: 1702540800000,
      srNo: 8,
      date: "14/12/2024",
      checkIn: "09:00",
      checkOut: "18:30",
      location: "Office - Mumbai",
      status: "checked-out",
      serverTimestamp: "2024-12-14T09:00:00.000Z",
      checkOutTimestamp: "2024-12-14T18:30:00.000Z",
    },
    {
      id: 1702454400000,
      srNo: 9,
      date: "13/12/2024",
      checkIn: "09:45",
      checkOut: null,
      location: "Client Site - Delhi",
      status: "checked-in",
      serverTimestamp: "2024-12-13T09:45:00.000Z",
      isManual: true,
      description: "On-site client work - forgot to check out",
    },
    {
      id: 1702368000000,
      srNo: 10,
      date: "12/12/2024",
      checkIn: "08:15",
      checkOut: "17:45",
      location: "Office - Mumbai",
      status: "checked-out",
      serverTimestamp: "2024-12-12T08:15:00.000Z",
      checkOutTimestamp: "2024-12-12T17:45:00.000Z",
    },
  ],
  isLoading: true,

  expenses: [
    {
      id: 1,
      title: "Client Meeting Lunch",
      amount: 850,
      category: "Food & Dining",
      date: "2025-06-01",
      description: "Business lunch with potential client",
      receipt: "receipt_001.pdf",
      status: "submitted",
      createdAt: "2024-12-15T12:30:00.000Z",
    },
    {
      id: 2,
      title: "Taxi to Airport",
      amount: 450,
      category: "Transportation",
      date: "2025-06-02",
      description: "Travel to airport for business trip",
      receipt: null,
      status: "submitted",
      createdAt: "2024-12-14T08:15:00.000Z",
    },
    {
      id: 3,
      title: "Office Supplies",
      amount: 1200,
      category: "Office Supplies",
      date: "2025-06-03",
      description: "Stationery and printer cartridges",
      receipt: "receipt_003.jpg",
      status: "draft",
      createdAt: "2024-12-13T16:45:00.000Z",
    },
    {
      id: 4,
      title: "Hotel Stay - Mumbai",
      amount: 3500,
      category: "Accommodation",
      date: "2025-06-04",
      description: "2 nights stay for client presentation",
      receipt: "hotel_bill.pdf",
      status: "submitted",
      createdAt: "2024-12-12T10:20:00.000Z",
    },
    {
      id: 5,
      title: "Mobile Recharge",
      amount: 299,
      category: "Communication",
      date: "2025-06-07",
      description: "Monthly mobile plan renewal",
      receipt: null,
      status: "submitted",
      createdAt: "2024-12-11T14:30:00.000Z",
    },
    {
      id: 6,
      title: "Training Course Fee",
      amount: 2500,
      category: "Training",
      date: "2025-06-08",
      description: "React Advanced Concepts Workshop",
      receipt: "training_receipt.pdf",
      status: "submitted",
      createdAt: "2024-12-10T09:00:00.000Z",
    },
    {
      id: 7,
      title: "Team Dinner",
      amount: 1800,
      category: "Food & Dining",
      date: "2025-06-09",
      description: "Team celebration dinner at restaurant",
      receipt: "dinner_bill.jpg",
      status: "submitted",
      createdAt: "2024-12-09T20:30:00.000Z",
    },
    {
      id: 8,
      title: "Uber Rides",
      amount: 320,
      category: "Transportation",
      date: "2025-06-10",
      description: "Multiple rides for client visits",
      receipt: null,
      status: "draft",
      createdAt: "2024-12-08T17:45:00.000Z",
    },
    {
      id: 9,
      title: "Conference Registration",
      amount: 4500,
      category: "Training",
      date: "2024-12-07",
      description: "Tech Conference 2024 registration fee",
      receipt: "conference_ticket.pdf",
      status: "submitted",
      createdAt: "2024-12-07T11:15:00.000Z",
    },
    {
      id: 10,
      title: "Internet Bill",
      amount: 899,
      category: "Communication",
      date: "2024-12-06",
      description: "Monthly broadband payment",
      receipt: "internet_bill.pdf",
      status: "submitted",
      createdAt: "2024-12-06T13:20:00.000Z",
    },
    {
      id: 11,
      title: "Flight Tickets",
      amount: 8500,
      category: "Travel",
      date: "2024-12-05",
      description: "Round trip tickets to Bangalore",
      receipt: "flight_booking.pdf",
      status: "submitted",
      createdAt: "2024-12-05T15:30:00.000Z",
    },
    {
      id: 12,
      title: "Parking Fees",
      amount: 150,
      category: "Transportation",
      date: "2024-12-04",
      description: "Mall parking for client meeting",
      receipt: null,
      status: "submitted",
      createdAt: "2024-12-04T16:45:00.000Z",
    },
    {
      id: 13,
      title: "Software License",
      amount: 2999,
      category: "Other",
      date: "2024-12-03",
      description: "Annual Adobe Creative Suite license",
      receipt: "adobe_invoice.pdf",
      status: "draft",
      createdAt: "2024-12-03T10:00:00.000Z",
    },
    {
      id: 14,
      title: "Business Cards Printing",
      amount: 450,
      category: "Office Supplies",
      date: "2024-12-02",
      description: "500 business cards with new design",
      receipt: "printing_bill.jpg",
      status: "submitted",
      createdAt: "2024-12-02T14:15:00.000Z",
    },
    {
      id: 15,
      title: "Coffee Meeting",
      amount: 280,
      category: "Food & Dining",
      date: "2024-12-01",
      description: "Informal client discussion over coffee",
      receipt: null,
      status: "submitted",
      createdAt: "2024-12-01T11:30:00.000Z",
    },
  ],
  displayedExpensesCount: 10, // Show 10 initially
  expensesPerPage: 10,
};

// Action types
const ActionTypes = {
  // Auth actions
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",

  // Attendance actions
  CHECK_IN: "CHECK_IN",
  CHECK_OUT: "CHECK_OUT",
  LOAD_ATTENDANCE_HISTORY: "LOAD_ATTENDANCE_HISTORY",
  ADD_MANUAL_ATTENDANCE: "ADD_MANUAL_ATTENDANCE",

  // Expenses actions
  ADD_EXPENSE: "ADD_EXPENSE",
  UPDATE_EXPENSE: "UPDATE_EXPENSE",
  LOAD_EXPENSES: "LOAD_EXPENSES",
  SAVE_EXPENSE_DRAFT: "SAVE_EXPENSE_DRAFT",
  SUBMIT_EXPENSE: "SUBMIT_EXPENSE",
  LOAD_MORE_EXPENSES: "LOAD_MORE_EXPENSES",
  SET_LOADING: "SET_LOADING",
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN: {
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    }

    case ActionTypes.LOGOUT: {
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isCheckedIn: false,
        currentCheckInTime: null,
      };
    }
    case ActionTypes.SET_LOADING: {
      return {
        ...state,
        isLoading: action.payload,
      };
    }

    case ActionTypes.CHECK_IN: {
      const accurateTime = new Date(
        action.payload.timestamp || action.payload.time
      );

      const newCheckInEntry = {
        id: Date.now(),
        srNo: state.attendanceHistory.length + 1,
        date: accurateTime.toLocaleDateString("en-GB"),
        checkIn: accurateTime.toLocaleTimeString("en-GB", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
        checkOut: null,
        location: action.payload.location || "Location not available",
        serverTimestamp: action.payload.timestamp, // Store server timestamp
      };

      return {
        ...state,
        isCheckedIn: true,
        currentCheckInTime: action.payload.time,
        attendanceHistory: [newCheckInEntry, ...state.attendanceHistory],
      };
    }

    case ActionTypes.CHECK_OUT: {
      const accurateTime = new Date(
        action.payload.timestamp || action.payload.time
      );

      const updatedHistory = state.attendanceHistory.map((entry, index) => {
        if (index === 0 && entry.checkOut === null) {
          return {
            ...entry,
            checkOut: accurateTime.toLocaleTimeString("en-GB", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            }),
            checkOutTimestamp: action.payload.timestamp,
          };
        }
        return entry;
      });

      return {
        ...state,
        isCheckedIn: false,
        currentCheckInTime: null,
        attendanceHistory: updatedHistory,
      };
    }

    case ActionTypes.LOAD_ATTENDANCE_HISTORY: {
      return {
        ...state,
        attendanceHistory: action.payload,
      };
    }

    case ActionTypes.UPDATE_MANUAL_CHECKOUT: {
      const updatedHistory = state.attendanceHistory.map((record) => {
        if (record.id === action.payload.id) {
          return {
            ...record,
            checkOut: action.payload.checkoutTime,
            status: "checked-out",
          };
        }
        return record;
      });

      return {
        ...state,
        attendanceHistory: updatedHistory,
      };
    }

    case ActionTypes.ADD_EXPENSE: {
      const newExpense = {
        ...action.payload,
        id: Date.now(),
        status: "submitted", // Default to submitted for backward compatibility
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        expenses: [newExpense, ...state.expenses],
      };
    }

    case ActionTypes.UPDATE_EXPENSE: {
      const updatedExpenses = state.expenses.map((expense) =>
        expense.id === action.payload.id
          ? { ...expense, ...action.payload }
          : expense
      );

      return {
        ...state,
        expenses: updatedExpenses,
      };
    }

    case ActionTypes.LOAD_EXPENSES: {
      return {
        ...state,
        expenses: action.payload,
      };
    }
    case ActionTypes.SAVE_EXPENSE_DRAFT: {
      const draftExpense = {
        ...action.payload,
        id: Date.now(),
        status: "draft",
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        expenses: [draftExpense, ...state.expenses],
      };
    }

    case ActionTypes.SUBMIT_EXPENSE: {
      const submittedExpense = {
        ...action.payload,
        status: "submitted",
        submittedAt: new Date().toISOString(),
      };

      if (action.payload.id) {
        // Update existing draft to submitted
        const updatedExpenses = state.expenses.map((expense) =>
          expense.id === action.payload.id ? submittedExpense : expense
        );
        return {
          ...state,
          expenses: updatedExpenses,
        };
      } else {
        // New submission
        const newSubmittedExpense = {
          ...submittedExpense,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        };
        return {
          ...state,
          expenses: [newSubmittedExpense, ...state.expenses],
        };
      }
    }
    case ActionTypes.LOAD_MORE_EXPENSES: {
      return {
        ...state,
        displayedExpensesCount:
          state.displayedExpensesCount + state.expensesPerPage,
      };
    }

    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadStoredData = () => {
      try {
        const loginData = localStorage.getItem("loginData");
        if (loginData) {
          const parsedData = JSON.parse(loginData);
          dispatch({
            type: ActionTypes.LOGIN,
            payload: parsedData,
          });
        }

        const attendanceData = localStorage.getItem("attendanceHistory");
        if (attendanceData) {
          const parsedAttendance = JSON.parse(attendanceData);
          dispatch({
            type: ActionTypes.LOAD_ATTENDANCE_HISTORY,
            payload: parsedAttendance,
          });
        }

        // Load check-in status
        const checkInStatus = localStorage.getItem("checkInStatus");
        if (checkInStatus) {
          const parsedStatus = JSON.parse(checkInStatus);
          if (parsedStatus.isCheckedIn) {
            dispatch({
              type: ActionTypes.CHECK_IN,
              payload: {
                time: parsedStatus.checkInTime,
                location: parsedStatus.location, // ✅ Make sure this uses stored location
              },
            });
          }
        }

        // Load expenses data
        const expensesData = localStorage.getItem("expenses");
        if (expensesData) {
          const parsedExpenses = JSON.parse(expensesData);
          dispatch({
            type: ActionTypes.LOAD_EXPENSES,
            payload: parsedExpenses,
          });
        }
      } catch (error) {
        console.error("Error loading stored data:", error);
      } finally {
        dispatch({
          type: ActionTypes.SET_LOADING,
          payload: false,
        });
      }
    };

    loadStoredData();
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem("loginData", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("loginData");
    }
  }, [state.user]);

  useEffect(() => {
    localStorage.setItem(
      "attendanceHistory",
      JSON.stringify(state.attendanceHistory)
    );
  }, [state.attendanceHistory]);

  useEffect(() => {
    const currentLocation =
      state.attendanceHistory.length > 0 && state.isCheckedIn
        ? state.attendanceHistory[0].location
        : null;

    const checkInStatus = {
      isCheckedIn: state.isCheckedIn,
      checkInTime: state.currentCheckInTime,
      location: currentLocation, // ✅ Use actual location
    };
    localStorage.setItem("checkInStatus", JSON.stringify(checkInStatus));
  }, [state.isCheckedIn, state.currentCheckInTime, state.attendanceHistory]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(state.expenses));
  }, [state.expenses]);

  // Action creators
  const login = (userData) => {
    dispatch({
      type: ActionTypes.LOGIN,
      payload: userData,
    });
  };

  const logout = () => {
    localStorage.clear();
    dispatch({
      type: ActionTypes.LOGOUT,
    });
  };
  const checkIn = async (
    location = "Location not available",
    coordinates = null
  ) => {
    try {
      // Verify location if coordinates are provided
      if (coordinates) {
        const { latitude, longitude } = coordinates;
        if (!isWithinAllowedLocation(latitude, longitude)) {
          const distance = calculateDistance(
            latitude,
            longitude,
            ASSIGNED_COORDINATES.latitude,
            ASSIGNED_COORDINATES.longitude
          );
          throw new Error(
            `You are not at the assigned location. You are ${Math.round(
              distance
            )} meters away from the allowed check-in area.`
          );
        }
      }

      const accurateTime = await getAccurateTime();
      dispatch({
        type: ActionTypes.CHECK_IN,
        payload: {
          time: accurateTime.toLocaleString(),
          location: location,
          timestamp: accurateTime.toISOString(),
        },
      });
    } catch (error) {
      console.error("Error during check-in:", error);
      throw error;
    }
  };

  const checkOut = async (coordinates = null) => {
    try {
      // Verify location if coordinates are provided
      if (coordinates) {
        const { latitude, longitude } = coordinates;
        if (!isWithinAllowedLocation(latitude, longitude)) {
          const distance = calculateDistance(
            latitude,
            longitude,
            ASSIGNED_COORDINATES.latitude,
            ASSIGNED_COORDINATES.longitude
          );
          throw new Error(
            `You are not at the assigned location. You are ${Math.round(
              distance
            )} meters away from the allowed check-out area.`
          );
        }
      }

      const accurateTime = await getAccurateTime();
      dispatch({
        type: ActionTypes.CHECK_OUT,
        payload: {
          time: accurateTime.toLocaleString(),
          timestamp: accurateTime.toISOString(),
        },
      });
    } catch (error) {
      console.error("Error during check-out:", error);
      throw error;
    }
  };

  const addExpense = (expenseData) => {
    dispatch({
      type: ActionTypes.ADD_EXPENSE,
      payload: expenseData,
    });
  };

  const updateExpense = (expenseData) => {
    dispatch({
      type: ActionTypes.UPDATE_EXPENSE,
      payload: expenseData,
    });
  };
  const saveExpenseDraft = (expenseData) => {
    dispatch({
      type: ActionTypes.SAVE_EXPENSE_DRAFT,
      payload: expenseData,
    });
  };

  const submitExpense = (expenseData) => {
    dispatch({
      type: ActionTypes.SUBMIT_EXPENSE,
      payload: expenseData,
    });
  };
  const loadMoreExpenses = () => {
    dispatch({
      type: ActionTypes.LOAD_MORE_EXPENSES,
    });
  };

  // Context value
  const contextValue = {
    // State
    ...state,

    // Actions
    login,
    logout,
    checkIn,
    checkOut,
    addExpense,
    updateExpense,
    saveExpenseDraft,
    submitExpense,
    loadMoreExpenses,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export default AppContext;
