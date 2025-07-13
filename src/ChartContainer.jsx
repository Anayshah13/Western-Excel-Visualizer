import displayNameMap from "./constants/displayNameMap";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function calculateAverage(values) {
  const valid = values.filter((v) => typeof v === "number" && !isNaN(v));
  if (valid.length === 0) return "N/A";
  const sum = valid.reduce((a, b) => a + b, 0);
  return (sum / valid.length).toFixed(2);
}


function ChartContainer({ selected, data }) {
  if (!data || data.length === 0) {
    return selected.length > 0 ? (
      <div className="chart-info">No data available for charting. Please upload a valid Excel file.</div>
    ) : null;
  }

  return (
    <div className="chart-scroll-container">
      {selected.map((param) => {
        const filteredData = data
          .filter((row) => row[param] != null && row[param] !== "")
          .map((row) => ({
            date: row.date,
            value: Number(row[param]),
          }));

        const average = calculateAverage(filteredData.map((d) => d.value));
        const displayName = displayNameMap[param] || param;

        return (
          <div key={param} className="chart-box">
            <div className="chart-title">{displayName}</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2830cdff"
                  strokeWidth={1.75}
                />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ marginTop: "0.5rem", textAlign: "center" }}>
              <strong>Average:</strong> {average}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChartContainer;

