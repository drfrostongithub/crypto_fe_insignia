import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { API_BASE_URL } from "../api";

const Transactions = ({ access_token }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/transactions`, {
        headers: { access_token: `${access_token}` },
      });
      setTransactions(response.data);
    } catch (err) {
      console.error("Error fetching transactions", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch balance
  const fetchBalance = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/wallet/balance`, {
        headers: { access_token: `${access_token}` },
      });
      setBalance(response.data.balance);
    } catch (err) {
      console.error("Error fetching balance", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchBalance();
  }, [access_token]);

  //   const filteredTransactions = transactions.filter((transaction) =>
  //     transaction.name.toLowerCase().includes(searchQuery.toLowerCase())
  //   );

  const handleLogout = () => {
    // Clear the token from session storage and state
    sessionStorage.removeItem("access_token");
    //  setAccessToken(null);
  };

  return (
    <div>
      {access_token && (
        <button
          onClick={handleLogout}
          style={{ position: "fixed", top: 10, right: 10 }}
        >
          Logout
        </button>
      )}
      <div>
        <h3>Balance: ${balance}</h3>
      </div>
      <input
        type="text"
        placeholder="Search transactions"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {filteredTransactions.map((transaction) => (
            <li key={transaction.id}>{transaction.name}</li>
          ))}
        </ul>
      )} */}
    </div>
  );
};

Transactions.propTypes = {
  access_token: PropTypes.func.isRequired,
};

export default Transactions;
