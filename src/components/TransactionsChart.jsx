import { Line } from "react-chartjs-2";
import PropTypes from "prop-types";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const TransactionChart = ({ transactions }) => {
  const chartData = {
    labels: transactions.map((transaction) =>
      new Date(transaction.createdAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Transaction Value",
        data: transactions.map((transaction) => transaction.amount),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  return <Line data={chartData} />;
};

TransactionChart.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      createdAt: PropTypes.string.isRequired, // ISO date string
      amount: PropTypes.number.isRequired, // Transaction amount
    })
  ).isRequired,
};

export default TransactionChart;
