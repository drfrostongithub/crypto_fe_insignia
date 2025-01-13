import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { API_BASE_URL } from "../api";

const Transactions = ({ token }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data);
    } catch (err) {
      console.error("Error fetching transactions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [token]);

  //   const filteredTransactions = transactions.filter((transaction) =>
  //     transaction.name.toLowerCase().includes(searchQuery.toLowerCase())
  //   );

  return (
    <div>
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
  token: PropTypes.func.isRequired,
};

export default Transactions;
