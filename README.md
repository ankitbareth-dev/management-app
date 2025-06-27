# Management App

A React-based management application for attendance tracking and expense management.

## Features

- User Authentication
- Attendance Tracking (Check-in/Check-out)
- Manual Attendance Entry
- Expense Management
- Dashboard with Analytics
- Profile Management
- Attendance History

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── API_CONFIG/          # API configuration
├── API_SERVICES/        # API service functions
├── assets/             # Static assets
├── components/         # React components
├── services/           # Utility services
├── store/              # Context/State management
├── App.jsx             # Main App component
└── main.jsx            # Entry point
```

## Technologies Used

- React 18
- React Router DOM
- React Hook Form
- Axios
- Vite
- CSS Modules
- Capacitor (for mobile)

## License

This project is licensed under the MIT License.