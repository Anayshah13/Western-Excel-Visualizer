import { useState } from "react";
import ParameterList from "./ParameterList";
import ChartContainer from "./ChartContainer";
import { BsUpload } from "react-icons/bs";
import { HiDocumentText } from "react-icons/hi2";
import ExcelReader, { parseExcelData } from "./ExcelReader";
import params from "./constants/params";

const EXISTING_FILE_NAME = "sample.xlsx";
const EXCEL_FILE_PATH = `/${EXISTING_FILE_NAME}`;

function Dashboard() {
  const [mode, setMode] = useState(null);
  const [selectedParams, setSelectedParams] = useState([]);
  const [fileName, setFileName] = useState("");
  const [excelData, setExcelData] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleParam = (param) => {
    setSelectedParams((prev) =>
      prev.includes(param) ? prev.filter((p) => p !== param) : [...prev, param]
    );
  };

  const handleDataLoaded = (parsedData) => {
    if (parsedData && parsedData.length > 0) {
      setExcelData(parsedData);
      setMode("existing");
    } else {
      console.warn("Parsed data is empty.");
      setExcelData([]);
      setMode(null);
    }
  };

  const loadExistingData = async () => {
    setLoading(true);
    setFileName(EXISTING_FILE_NAME);

    try {
      console.log(`Attempting to fetch file from: ${EXCEL_FILE_PATH}`);
      const response = await fetch(EXCEL_FILE_PATH);
      if (!response.ok) {
        throw new Error(`Failed to load file. Status: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      console.log(`File fetched. Length: ${arrayBuffer.byteLength}`);
      const parsedData = parseExcelData(arrayBuffer, params);
      console.log("Parsed sample:", parsedData.slice(0, 5));
      handleDataLoaded(parsedData);
    } catch (error) {
      console.error("Error loading existing data:", error);
      setExcelData([]);
      setMode(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="logo-container">
        <h1>Western Metals Excel Visualizer</h1>
      </div>

      <div className="button-group">
        <label htmlFor="file-upload" className="mode-button">
          <div className="icon-label">
            <BsUpload size={48} />
            <ExcelReader
              onDataLoaded={(parsedData) => {
                setExcelData(parsedData);
                setMode("upload");
              }}
              setFileName={setFileName}
            />
            <span>{fileName ? `Uploaded: ${fileName}` : "Upload"}</span>
          </div>
        </label>

        <div onClick={loadExistingData} className="mode-button">
          <div className="icon-label">
            <HiDocumentText size={48} />
            <span>{loading ? "Loading..." : "Use Existing Data"}</span>
          </div>
        </div>
      </div>

      {mode && (
        <>
          <ParameterList
            parameters={params}
            selected={selectedParams}
            onToggle={toggleParam}
          />
          <ChartContainer selected={selectedParams} data={excelData} />
        </>
      )}
    </div>
  );
}

export default Dashboard;
