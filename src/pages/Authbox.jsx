import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { API_BASE_URL } from "../api";

const AuthBox = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAuth = async () => {
    const url = isLogin ? `${API_BASE_URL}/login` : `${API_BASE_URL}/register`;
    try {
      const response = await axios.post(url, { username, password });
      if (isLogin) {
        onLogin(response.data.token);
      } else {
        alert("Registration successful. Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">
        {isLogin ? "Login" : "Register"}
      </h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleAuth}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
      >
        {isLogin ? "Login" : "Register"}
      </button>
      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
      <p className="text-sm text-gray-600">
        {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
        <span
          className="text-blue-500 cursor-pointer hover:underline"
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
