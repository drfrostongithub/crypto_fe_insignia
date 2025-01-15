import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";
import PropTypes from "prop-types";

const TopSpenders = ({ access_token }) => {
  const [topSpenders, setTopSpenders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopSpenders = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/wallets/transactions/top`,
          {
            headers: { access_token },
          }
        );
        setTopSpenders(response.data.topSpenders);
      } catch (err) {
        console.error("Error fetching top spenders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSpenders();
  }, [access_token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Top 10 Spenders</h1>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <table className="min-w-full border divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Username
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Total Outbound Value
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {topSpenders.map((spender) => (
              <tr key={spender.senderId}>
                <td className="px-4 py-2">{spender.Sender?.username}</td>
                <td className="px-4 py-2">{spender.totalOutboundValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

TopSpenders.propTypes = {
  access_token: PropTypes.string.isRequired,
};

export default TopSpenders;
