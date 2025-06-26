import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../store/AppContext";
import styles from "./Auth.module.css";
import axios from "axios";

const Auth = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { login } = useAppContext();

  const onSubmit = async (data) => {
    try {
      console.log("Attempting login with:", data.email);

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
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(`Login failed: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Login</h1>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              {...register("email")}
              name="email"
              placeholder="Enter your email"
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              {...register("password")}
              name="password"
              placeholder="Enter your password"
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            Log-in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
