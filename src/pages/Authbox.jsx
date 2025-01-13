import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "../styles/Authbox.css";
import { API_BASE_URL } from "../api";

const AuthBox = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAuth = async () => {
    const url = isLogin
      ? `${API_BASE_URL}/users/login`
      : `${API_BASE_URL}/users/register`;
    try {
      const response = await axios.post(url, { username, password });
      if (isLogin) {
        onLogin(response.data.token); // Call onLogin with the token
      } else {
        alert("Registration successful. Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="auth-box">
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleAuth}>{isLogin ? "Login" : "Register"}</button>
      {error && <p className="error">{error}</p>}
      <p>
        {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Register here" : "Login here"}
        </span>
      </p>
    </div>
  );
};

// Prop validation
AuthBox.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default AuthBox;
