import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthBox from "./pages/Authbox";
import Transactions from "./pages/Transactions";
import TopSpenders from "./pages/TopSpenders";

const App = () => {
  const [access_token, setAccessToken] = useState(null);

  // Load token from session storage on app load
  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const handleLogin = (access_token) => {
    // Store the token in session storage and update state
    sessionStorage.setItem("access_token", access_token);
    setAccessToken(access_token);
  };

  return (
    <Router>
      <Routes>
        {/* If no token, show the AuthBox */}
        {!access_token ? (
          <Route path="*" element={<AuthBox onLogin={handleLogin} />} />
        ) : (
          <>
            <Route
              path="/transactions"
              element={<Transactions access_token={access_token} />}
            />
            <Route
              path="*"
              element={<Transactions access_token={access_token} />}
            />
            <Route
              path="/top-spenders"
              element={<TopSpenders access_token={access_token} />}
            />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
