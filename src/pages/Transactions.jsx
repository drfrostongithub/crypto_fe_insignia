import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { API_BASE_URL } from "../api";
import TransactionChart from "../components/TransactionsChart";
import { jwtDecode } from "jwt-decode";

const Transactions = ({ access_token }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferDetails, setTransferDetails] = useState({
    recipientId: "",
    amount: "",
  });
  const [userInfo, setUserInfo] = useState({});
  const [depositAmount, setDepositAmount] = useState(""); // State for deposit amount
  const [showDepositModal, setShowDepositModal] = useState(false); // Modal visibility
  const [page, setPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(1); // Total pages available

  const fetchTransactions = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/wallets/transactions/user/top`,
          {
            headers: { access_token: `${access_token}` },
            params: { page, limit: 10 }, // Send page and limit as query parameters
          }
        );
        setTransactions(response.data.transactions);
        setTotalPages(response.data.totalPages); // Update total pages for pagination
      } catch (err) {
        console.error("Error fetching transactions", err);
      } finally {
        setLoading(false);
      }
    },
    [access_token]
  );

  const fetchBalance = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/wallets/balance`, {
        headers: { access_token: `${access_token}` },
      });
      setBalance(response.data.balance);
    } catch (err) {
      console.error("Error fetching balance", err);
    }
  }, [access_token]);

  const decodeToken = (access_token) => {
    try {
      const decoded = jwtDecode(access_token);
      return decoded;
    } catch (err) {
      console.error("Error decoding token", err);
      return null;
    }
  };

  const handleTransfer = async () => {
    try {
      const { to_username, amount } = transferDetails;
      const response = await axios.post(
        `${API_BASE_URL}/wallets/transfer`,
        { to_username, amount },
        { headers: { access_token } }
      );
      alert(response.data.message);
      fetchBalance();
      fetchTransactions();
      setShowTransferModal(false);
    } catch (err) {
      console.error("Error making transfer", err);
      alert(err.response?.data?.message || "Transfer failed");
    }
  };

  const handleDeposit = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/wallets/deposit`, // Endpoint to handle deposit
        { amount: depositAmount },
        { headers: { access_token } }
      );
      alert(response.data.message); // Show success message
      fetchBalance(); // Refresh the balance
      setShowDepositModal(false); // Close the modal
    } catch (err) {
      console.error("Error making deposit", err);
      alert(err.response?.data?.message || "Deposit failed");
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchTransactions(newPage); // Fetch transactions for the new page
  };

  useEffect(() => {
    const decodedToken = decodeToken(access_token);
    if (decodedToken) {
      setUserInfo({
        id: decodedToken.id || "",
        username: decodedToken.username || "",
      });
    }
    fetchTransactions();
    fetchBalance();
  }, [fetchBalance, fetchTransactions, access_token]);

  const filteredTransactions = Array.isArray(transactions)
    ? transactions.filter((transaction) => {
        const sender = transaction.Sender?.username || "";
        const recipient = transaction.Recipient?.username || "";
        return (
          sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipient.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
    : [];

  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    window.location.reload();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">
            Welcome, {userInfo.username}
          </h3>
          <h3 className="text-xl font-semibold">Balance: {balance}</h3>
          <p className="text-sm text-gray-600">User ID: {userInfo.id}</p>
        </div>
        <div className="flex space-x-4">
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
            onClick={() => (window.location.href = "/top-spenders")}
          >
            Top 10 Spenders
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setShowDepositModal(true)} // Open Deposit Modal
          >
            Deposit
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setShowTransferModal(true)}
          >
            Transfer
          </button>
          {access_token && (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </div>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-6 flex">
          <div className="bg-white shadow p-4 rounded flex-1">
            <TransactionChart transactions={transactions} />
          </div>
          <div className="space-y-4 flex-1 p-4">
            <input
              type="text"
              placeholder="Search by Sender or Recipient"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="overflow-x-auto">
              <table className="min-w-full border divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Sender
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Recipient
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-4 py-2">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        {transaction.Sender?.username}
                      </td>
                      <td className="px-4 py-2">
                        {transaction.Recipient?.username}
                      </td>
                      <td className="px-4 py-2">{transaction.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Previous
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showTransferModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded shadow p-6 w-96 space-y-4">
            <h3 className="text-lg font-semibold">Transfer Funds</h3>
            <input
              type="text"
              placeholder="Recipient Username"
              value={transferDetails.to_username}
              onChange={(e) =>
                setTransferDetails((prev) => ({
                  ...prev,
                  to_username: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Amount"
              value={transferDetails.amount}
              onChange={(e) =>
                setTransferDetails((prev) => ({
                  ...prev,
                  amount: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex space-x-4">
              <button
                onClick={handleTransfer}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
              <button
                onClick={() => setShowTransferModal(false)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* // Modal for Deposit */}
      {showDepositModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded shadow p-6 w-96 space-y-4">
            <h3 className="text-lg font-semibold">Deposit Funds</h3>
            <input
              type="number"
              placeholder="Amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex space-x-4">
              <button
                onClick={handleDeposit} // Handle deposit
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
              <button
                onClick={() => setShowDepositModal(false)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Transactions.propTypes = {
  access_token: PropTypes.string.isRequired,
};

export default Transactions;
