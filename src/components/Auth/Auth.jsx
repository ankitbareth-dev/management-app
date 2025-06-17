import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../store/AppContext";
import styles from "./Auth.module.css";

const Auth = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { login } = useAppContext();

  const onSubmit = (data) => {
    console.log("Form Data:", data);

    // Use context login function instead of localStorage directly
    login(data);

    navigate("/dashboard");
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
