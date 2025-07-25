import { useState, useEffect } from "react";
import ParameterList from "./ParameterList";
import ChartContainer from "./ChartContainer";
import { BsUpload } from "react-icons/bs";
import { HiDocumentText } from "react-icons/hi2";
import ExcelReader, { parseExcelData } from "./ExcelReader";
import params from "./constants/params";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
const EXISTING_FILE_NAME = "sample.xlsx";
const EXCEL_FILE_PATH = `/${EXISTING_FILE_NAME}`;

function Dashboard() {
  const [chartType, setChartType] = useState('line');
  const handleChartTypeToggle = (event) => {
    setChartType(event.target.checked ? 'bar' : 'line');
  };
  const [mode, setMode] = useState(null);
  const [selectedParams, setSelectedParams] = useState([]);
  const [fileName, setFileName] = useState("");
  const [excelData, setExcelData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([0, 0]);
  const [allDates, setAllDates] = useState([]);

  const toggleParam = (param) => {
    setSelectedParams((prev) =>
      prev.includes(param) ? prev.filter((p) => p !== param) : [...prev, param]
    );
  };

  const applyDateFilter = (data, range, dates) => {
    const [startIdx, endIdx] = range;
    const startDate = dates[startIdx];
    const endDate = dates[endIdx];
    const filtered = data.filter((entry) => {
      const date = entry.date;
      return dayjs(date).isSameOrAfter(startDate) && dayjs(date).isSameOrBefore(endDate);
    });
    setFilteredData(filtered);
  };

  const handleDataLoaded = (parsedData) => {
    if (parsedData && parsedData.length > 0) {
      setExcelData(parsedData);

      const dates = parsedData.map((entry) => entry.date);
      setAllDates(dates);
      setDateRange([0, dates.length - 1]);
      setFilteredData(parsedData);
      setMode("existing");
    } else {
      console.warn("Parsed data is empty.");
      setExcelData([]);
      setFilteredData([]);
      setMode(null);
    }
  };

  const loadExistingData = async () => {
    setLoading(true);
    setFileName(EXISTING_FILE_NAME);

    try {
      const response = await fetch(EXCEL_FILE_PATH);
      if (!response.ok) {
        throw new Error(`Failed to load file. Status: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const parsedData = parseExcelData(arrayBuffer, params);
      handleDataLoaded(parsedData);
    } catch (error) {
      console.error("Error loading existing data:", error);
      setExcelData([]);
      setFilteredData([]);
      setMode(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (excelData.length && allDates.length) {
      applyDateFilter(excelData, dateRange, allDates);
    }
  }, [dateRange]);

  return (
    <div className="dashboard-container">
      <div className="logo-container">
        <h1>Production Analysis</h1>
      </div>

      <div className="button-group">
        <label htmlFor="file-upload" className="mode-button">
          <div className="icon-label">
            <BsUpload size={48} />
            <ExcelReader
              onDataLoaded={handleDataLoaded}
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

      {mode && allDates.length > 1 && (
        <div style={{ margin: "50px 0", width: "75%" }}>
          <div style={{ marginBottom: 10, fontWeight: "700", color: "#000000ff", fontSize: "1.2rem", fontFamily: "Monserrat" }}>
            From: {allDates[dateRange[0]]} &nbsp; | &nbsp; To: {allDates[dateRange[1]]}
          </div>
          <Slider
            range
            min={0}
            max={allDates.length - 1}
            value={dateRange}
            onChange={(val) => setDateRange(val)}
            trackStyle={[
              {
                backgroundColor: "#27b039ff",
                height: 12, 
              },
            ]}
            handleStyle={[
              {
                borderColor: "#152b99",
                backgroundColor: "#fff",
                height: 24, 
                width: 24,  
                marginTop: -7, 
              },
              {
                borderColor: "#152b99",
                backgroundColor: "#fff",
                height: 24,
                width: 24, 
                marginTop: -7, 
              },
            ]}
            railStyle={{
              backgroundColor: "#ccc",
              height: 12,
            }}
          />
        </div>
      )}

      {mode && (
        <>
          <div class="toggle-button-cover">
          <div id="button-3" class="button r">
          <input class="checkbox" type="checkbox" onChange={handleChartTypeToggle} checked={chartType === 'bar'}/>
          <div class="knobs"/>
          <div class="layer"/>
          </div>
          </div>
          <ParameterList
            parameters={params}
            selected={selectedParams}
            onToggle={toggleParam}
          />
          <ChartContainer selected={selectedParams} data={filteredData} chartType={chartType}/>
        </>
      )}
    </div>
  );
}

export default Dashboard;