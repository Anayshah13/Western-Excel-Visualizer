import * as XLSX from "xlsx";
import params from "./constants/params";

// Helper function to format date (Month and Day only)
const formatDate = (dateValue) => {
  if (dateValue instanceof Date) {
    const correctedDate = new Date(dateValue.getTime() + 24 * 60 * 60 * 1000);
    return correctedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  }
  return String(dateValue || "").trim();
};

// Core parsing function used in Dashboard
export function parseExcelData(arrayBuffer, paramsList) {
  const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true });
  const desiredParamsMap = new Set(paramsList);
  const combinedGraphData = [];

  // Loop through each sheet
  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const raw = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true });

    if (raw.length === 0) return;

    const dateHeaders = raw[0].slice(1).map(formatDate);
    const dataRows = raw.slice(1);
    const paramData = {};

    dataRows.forEach(row => {
      const paramName = typeof row[0] === "string" ? row[0].trim() : String(row[0] || "").trim();
      if (paramName && desiredParamsMap.has(paramName)) {
        const dataPoints = row.slice(1);
        paramData[paramName] = dataPoints.slice(0, dateHeaders.length).map(value => {
          const numValue = Number(value);
          return isNaN(numValue) ? null : numValue;
        });
      }
    });

    // Convert this sheet's paramData into graphData format
    dateHeaders.forEach((date, dayIndex) => {
      const dayEntry = { date: `${date}` }; // Add sheet name to distinguish overlapping dates
      Object.keys(paramData).forEach(paramName => {
        const value = paramData[paramName][dayIndex];
        if (value !== null) dayEntry[paramName] = value;
      });
      if (Object.keys(dayEntry).length > 1) {
        combinedGraphData.push(dayEntry);
      }
    });
  });

  return combinedGraphData;
}


// Component for uploading and parsing Excel files
function ExcelReader({ onDataLoaded, setFileName }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (setFileName) setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const arrayBuffer = evt.target.result;
        const parsedData = parseExcelData(arrayBuffer, params);
        onDataLoaded(parsedData);
      } catch (err) {
        console.error("Error parsing Excel file:", err.message);
        alert("Failed to parse Excel file. Please check the file format.");
        onDataLoaded([]); // Clear data
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="upload-container">
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        style={{ display: "none" }}
        id="file-upload"
      />
    </div>
  );
}

export default ExcelReader;