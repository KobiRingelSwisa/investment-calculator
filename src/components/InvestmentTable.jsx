import PropTypes from "prop-types";
import { useState, useRef } from "react";
import { formatter } from "../util/investment";
import { Sparklines, SparklinesLine } from "react-sparklines";

function InvestmentTable({ data, isAdjusted }) {
  const [sortConfig, setSortConfig] = useState({
    key: "year",
    direction: "asc",
  });
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedYears, setSelectedYears] = useState([]);
  const tableRef = useRef(null);

  const initialInvestment =
    data[0].valueEndOfYear - data[0].interest - data[0].annualInvestment;

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleYearSelect = (year) => {
    setSelectedYears((prev) => {
      if (prev.includes(year)) {
        return prev.filter((y) => y !== year);
      }
      if (prev.length < 2) {
        return [...prev, year];
      }
      return [prev[1], year];
    });
  };

  const exportToCSV = () => {
    const headers = [
      "Year",
      "Investment Value",
      "Interest (Year)",
      "Total Interest",
      "Invested Capital",
      "Growth Rate",
      isAdjusted ? "Real Return Rate" : "",
    ].filter(Boolean);

    const csvContent = [
      headers.join(","),
      ...getSortedData().map((yearData) => {
        const totalInterest =
          yearData.valueEndOfYear -
          yearData.annualInvestment * yearData.year -
          initialInvestment;
        const totalAmountInvested = yearData.valueEndOfYear - totalInterest;
        const growthRate = calculateGrowthRate(yearData);

        const row = [
          yearData.year,
          yearData.valueEndOfYear,
          yearData.interest,
          totalInterest,
          totalAmountInvested,
          growthRate.toFixed(1),
          isAdjusted ? yearData.realReturnRate.toFixed(1) : "",
        ].filter(Boolean);

        return row.join(",");
      }),
    ].join("\\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "investment_data.csv";
    link.click();
  };

  const getSortedData = () => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Special handling for calculated values
      if (sortConfig.key === "totalInterest") {
        aValue =
          a.valueEndOfYear - a.annualInvestment * a.year - initialInvestment;
        bValue =
          b.valueEndOfYear - b.annualInvestment * b.year - initialInvestment;
      } else if (sortConfig.key === "totalAmountInvested") {
        aValue =
          a.valueEndOfYear -
          (a.valueEndOfYear - a.annualInvestment * a.year - initialInvestment);
        bValue =
          b.valueEndOfYear -
          (b.valueEndOfYear - b.annualInvestment * b.year - initialInvestment);
      } else if (sortConfig.key === "yearlyGrowth") {
        aValue =
          (a.valueEndOfYear - a.annualInvestment) /
            (a.valueEndOfYear - a.interest - a.annualInvestment) -
          1;
        bValue =
          (b.valueEndOfYear - b.annualInvestment) /
            (b.valueEndOfYear - b.interest - b.annualInvestment) -
          1;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sortedData;
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "↕️";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const calculateGrowthRate = (yearData) => {
    const previousValue =
      yearData.valueEndOfYear - yearData.interest - yearData.annualInvestment;
    return (
      ((yearData.valueEndOfYear - yearData.annualInvestment) / previousValue -
        1) *
      100
    );
  };

  const renderSortableHeader = (key, label) => (
    <td
      onClick={() => handleSort(key)}
      className="sortable-header"
      title={`Click to sort by ${label}`}
    >
      {label} {getSortIcon(key)}
    </td>
  );

  const calculateSummaryStats = () => {
    const totalReturn =
      data[data.length - 1].valueEndOfYear - initialInvestment;
    const totalReturnPercentage = (totalReturn / initialInvestment) * 100;
    const annualGrowthRates = data.map(calculateGrowthRate);
    const averageGrowth =
      annualGrowthRates.reduce((acc, curr) => acc + curr, 0) / data.length;
    const maxGrowth = Math.max(...annualGrowthRates);
    const minGrowth = Math.min(...annualGrowthRates);
    const totalInterest = data.reduce((acc, curr) => acc + curr.interest, 0);
    const averageInterest = totalInterest / data.length;

    return {
      totalReturn,
      totalReturnPercentage,
      averageGrowth,
      maxGrowth,
      minGrowth,
      totalInterest,
      averageInterest,
    };
  };

  const getComparisonData = () => {
    if (selectedYears.length !== 2) return null;
    const [year1, year2] = selectedYears.sort((a, b) => a - b);
    const data1 = data.find((d) => d.year === year1);
    const data2 = data.find((d) => d.year === year2);

    const growth =
      ((data2.valueEndOfYear - data1.valueEndOfYear) / data1.valueEndOfYear) *
      100;
    const interestDiff = data2.interest - data1.interest;

    return {
      yearDiff: year2 - year1,
      growth,
      interestDiff,
      valueChange: data2.valueEndOfYear - data1.valueEndOfYear,
    };
  };

  const stats = calculateSummaryStats();
  const comparison = getComparisonData();

  return (
    <div className="table-container">
      <div className="table-actions">
        <button onClick={exportToCSV} className="export-button">
          Export to CSV
        </button>
      </div>
      <table id="result" ref={tableRef}>
        <thead>
          <tr>
            {renderSortableHeader("year", "Year")}
            {renderSortableHeader(
              "valueEndOfYear",
              `Investment Value${isAdjusted ? " (Adj.)" : ""}`
            )}
            {renderSortableHeader(
              "interest",
              `Interest (Year)${isAdjusted ? " (Adj.)" : ""}`
            )}
            {renderSortableHeader(
              "totalInterest",
              `Total Interest${isAdjusted ? " (Adj.)" : ""}`
            )}
            {renderSortableHeader(
              "totalAmountInvested",
              `Invested Capital${isAdjusted ? " (Adj.)" : ""}`
            )}
            {renderSortableHeader("yearlyGrowth", "Growth Rate")}
            {isAdjusted && <td>Real Return Rate</td>}
          </tr>
        </thead>
        <tbody>
          {getSortedData().map((yearData) => {
            const totalInterest =
              yearData.valueEndOfYear -
              yearData.annualInvestment * yearData.year -
              initialInvestment;
            const totalAmountInvested = yearData.valueEndOfYear - totalInterest;
            const growthRate = calculateGrowthRate(yearData);
            const isSelected = selectedYears.includes(yearData.year);

            return (
              <tr
                key={yearData.year}
                onMouseEnter={() => setHoveredRow(yearData.year)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => handleYearSelect(yearData.year)}
                className={`${
                  hoveredRow === yearData.year ? "highlighted" : ""
                } ${isSelected ? "selected" : ""}`}
              >
                <td>{yearData.year}</td>
                <td>
                  {formatter.format(yearData.valueEndOfYear)}
                  {hoveredRow === yearData.year && (
                    <span className="tooltip">End of year value</span>
                  )}
                </td>
                <td>
                  {formatter.format(yearData.interest)}
                  {hoveredRow === yearData.year && (
                    <span className="tooltip">Interest earned this year</span>
                  )}
                </td>
                <td>
                  {formatter.format(totalInterest)}
                  {hoveredRow === yearData.year && (
                    <span className="tooltip">
                      Total interest earned so far
                    </span>
                  )}
                </td>
                <td>
                  {formatter.format(totalAmountInvested)}
                  {hoveredRow === yearData.year && (
                    <span className="tooltip">Total capital invested</span>
                  )}
                </td>
                <td className={growthRate >= 0 ? "positive" : "negative"}>
                  {growthRate.toFixed(1)}%
                  {hoveredRow === yearData.year && (
                    <span className="tooltip">Annual growth rate</span>
                  )}
                </td>
                {isAdjusted && (
                  <td>
                    {yearData.realReturnRate.toFixed(1)}%
                    {hoveredRow === yearData.year && (
                      <span className="tooltip">
                        Return rate adjusted for inflation
                      </span>
                    )}
                  </td>
                )}
                <td className="sparkline-cell">
                  <Sparklines
                    data={data
                      .slice(0, yearData.year)
                      .map((d) => d.valueEndOfYear)}
                    height={20}
                  >
                    <SparklinesLine color="#2ecc71" />
                  </Sparklines>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="table-summary">
        <div className="summary-section">
          <h4>Investment Summary</h4>
          <p>
            Total Return: {formatter.format(stats.totalReturn)} (
            {stats.totalReturnPercentage.toFixed(1)}%)
          </p>
          <p>Average Annual Growth: {stats.averageGrowth.toFixed(1)}%</p>
          <p>Best Growth Year: {stats.maxGrowth.toFixed(1)}%</p>
          <p>Worst Growth Year: {stats.minGrowth.toFixed(1)}%</p>
          <p>Total Interest Earned: {formatter.format(stats.totalInterest)}</p>
          <p>
            Average Annual Interest: {formatter.format(stats.averageInterest)}
          </p>
        </div>
        {comparison && (
          <div className="comparison-section">
            <h4>
              Period Comparison (Year {selectedYears[0]} to {selectedYears[1]})
            </h4>
            <p>Time Period: {comparison.yearDiff} years</p>
            <p>Total Growth: {comparison.growth.toFixed(1)}%</p>
            <p>Value Change: {formatter.format(comparison.valueChange)}</p>
            <p>Interest Change: {formatter.format(comparison.interestDiff)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

InvestmentTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number.isRequired,
      valueEndOfYear: PropTypes.number.isRequired,
      interest: PropTypes.number.isRequired,
      annualInvestment: PropTypes.number.isRequired,
      realReturnRate: PropTypes.number,
    })
  ).isRequired,
  isAdjusted: PropTypes.bool.isRequired,
};

export default InvestmentTable;
