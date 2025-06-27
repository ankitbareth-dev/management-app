import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../store/AppContext";
import styles from "./Auth.module.css";
import axios from "axios";
import { useState } from "react";

const Auth = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setError("");
    setIsLoading(true);
    
    try {
      console.log("Attempting login with:", data.email);

      // For demo purposes, allow login with any credentials
      if (data.email && data.password) {
        // Try to connect to the API first
        try {
          const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: "/api/odoo_connect",
            headers: {
              db: "eduquity",
              login: data.email,
              password: data.password,
              credentials: "include",
            },
            timeout: 3000, // 3 second timeout
            data: "",
          };

          const response = await axios.request(config);
          console.log("API Response:", response.data);

          if (response.data.Status === "auth successful") {
            const userData = {
              name: response.data.User,
              email: data.email,
              apiKey: response.data["api-key"],
            };
            login(userData);
            navigate("/dashboard");
            return;
          }
        } catch (apiError) {
          console.error("API connection error:", apiError);
          // Continue with demo login if API is unavailable
        }

        // Demo login (when API is unavailable)
        const userData = {
          name: data.email.split("@")[0],
          email: data.email,
          isDemoUser: true,
        };
        login(userData);
        navigate("/dashboard");
      } else {
        setError("Please enter both email and password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Login</h1>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              {...register("email")}
              name="email"
              placeholder="Enter your email"
              className={styles.input}
              disabled={isLoading}
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              {...register("password")}
              name="password"
              placeholder="Enter your password"
              className={styles.input}
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log-in"}
          </button>
        </form>
        <div className={styles.demoNote}>
          Note: Enter any email and password for demo access
        </div>
      </div>
    </div>
  );
};

export default Auth;