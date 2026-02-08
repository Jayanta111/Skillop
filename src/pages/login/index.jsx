import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import UserLayout from "@/layout/userLayout";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { registerUser, loginHandler } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [userLoginMethod, setUserLoginMethod] = useState(false);
  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (authState?.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn, router]);

  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod, dispatch]);

  const handleRegister = () => {
    dispatch(
      registerUser({
        username,
        password,
        email,
        name,
      }),
    );
  };

  const handleLogin = () => {
    dispatch(loginHandler({ email, password }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    userLoginMethod ? handleLogin() : handleRegister();
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardLeft_heading}>
              {userLoginMethod ? "Welcome Back" : "Create Account"}
            </p>

            {authState.message && (
              <p
                className={styles.message}
                style={{ color: authState.isError ? "red" : "green" }}
              >
                {authState.message}
              </p>
            )}

            <form className={styles.input_Container} onSubmit={handleSubmit}>
              {!userLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.input_field}
                    type="text"
                    placeholder="Username"
                    required
                  />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input_field}
                    type="text"
                    placeholder="Full Name"
                    required
                  />
                </div>
              )}

              <input
                value={email}
                onChange={(e) => setEmailAddress(e.target.value)}
                className={styles.input_field}
                type="email"
                placeholder="Email"
                required
              />

              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input_field}
                type="password"
                placeholder="Password"
                required
              />

              <button
                type="submit"
                disabled={authState.loading}
                className={`${styles.submitBtn} ${
                  authState.loading ? styles.disabled : ""
                }`}
              >
                {authState.loading
                  ? "Please wait..."
                  : userLoginMethod
                    ? "Login"
                    : "Sign Up"}
              </button>
            </form>

            <p className={styles.toggleText}>
              {userLoginMethod
                ? "Don’t have an account?"
                : "Already have an account?"}
              <span onClick={() => setUserLoginMethod(!userLoginMethod)}>
                {userLoginMethod ? " Sign Up" : " Login"}
              </span>
            </p>
          </div>

         <div
  onClick={() => setUserLoginMethod(!userLoginMethod)}
  className={styles.cardContainer_right}
>
          <img
            src={
              userLoginMethod
                ? "/images/Sign in-pana.svg"
                : "/images/Sign up-cuate.svg"
            }
            alt="Auth Illustration"
            className={styles.sideImage}
          />
          
        </div>
      </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
