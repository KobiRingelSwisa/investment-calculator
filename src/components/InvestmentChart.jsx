import PropTypes from "prop-types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function InvestmentChart({ data }) {
  const chartData = {
    labels: data.map((year) => `Year ${year.year}`),
    datasets: [
      {
        label: "Investment Value",
        data: data.map((year) => year.valueEndOfYear),
        borderColor: "#2c8d99",
        backgroundColor: "rgba(44, 141, 153, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Total Interest",
        data: data.map(
          (year) =>
            year.valueEndOfYear -
            year.annualInvestment * year.year -
            data[0].valueEndOfYear +
            data[0].interest +
            data[0].annualInvestment
        ),
        borderColor: "#76c0ae",
        backgroundColor: "rgba(118, 192, 174, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Investment Growth Over Time",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <Line options={options} data={chartData} />
    </div>
  );
}

InvestmentChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number.isRequired,
      valueEndOfYear: PropTypes.number.isRequired,
      interest: PropTypes.number.isRequired,
      annualInvestment: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default InvestmentChart;
