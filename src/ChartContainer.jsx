import displayNameMap from "./constants/displayNameMap";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts";

const CustomTooltip = ({ active, payload, label, average }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: '2px solid #ccc',
        lineHeight: '0.15'
      }}>
        <p className="label">{`${label}`}</p>
        <p className="value" style={{ color: '#2830cdff' }}>
          {`Value: ${payload[0].value}`}
        </p>
        <p className="average" style={{ color: 'red' }}>
          {`Avg: ${average}`}
        </p>
      </div>
    );
  }
  return null;
};

function calculateAverage(values) {
  const valid = values.filter((v) => typeof v === "number" && !isNaN(v));
  if (valid.length === 0) return "N/A";
  const sum = valid.reduce((a, b) => a + b, 0);
  return (sum / valid.length).toFixed(2);
}

function ChartContainer({ selected, data, chartType }) {
  if (!data || data.length === 0) {
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
              {chartType === 'line' ? (
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip average={average} />}/>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#2462b3"
                    strokeWidth={1.75}
                    dot={true}
                  />
                  <ReferenceLine
                      y={Number(average)}
                      label={{ value: "Avg", position: "right" }}
                      stroke="#ff0000ff"
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                    />
                </LineChart>
              ) : (
                <BarChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip average={average} />}/>
                  <Bar dataKey="value" fill="#2830cdff" />
                  <ReferenceLine
                      y={Number(average)}
                      label={{ value: "Avg", position: "right" }}
                      stroke="#ff0000ff"
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                    />
                </BarChart>
              )}
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

