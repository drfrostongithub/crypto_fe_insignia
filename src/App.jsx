import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthBox from "./pages/Authbox";
import Transactions from "./pages/Transactions";

const App = () => {
  const [token, setToken] = useState("");

  const handleLogin = (token) => {
    setToken(token); // Store the token after login
  };
  console.log(token);
  return (
    <Router>
      <Routes>
        {/* If no token, show the AuthBox */}
        {!token ? (
          <Route path="*" element={<AuthBox onLogin={handleLogin} />} />
        ) : (
          <>
            <Route
              path="/transactions"
              element={<Transactions token={token} />}
            />
            <Route path="*" element={<Transactions token={token} />} />
            {/* <h1>Hello</h1> */}
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
